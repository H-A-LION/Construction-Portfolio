<?php
// src/Middleware/AuthMiddleware.php
namespace App\Middleware;

use App\Services\JWTService;
use App\Helpers\Response;
use App\Models\User;

class AuthMiddleware {
    private $jwtService;

    public function __construct() {
        $this->jwtService = new JWTService();
    }

    public function authenticate($requiredRoles = null) {
        $headers = getallheaders();
        
        // Check for Authorization header
        if (!isset($headers['Authorization'])) {
            Response::unauthorized('Authorization header missing');
        }

        $authHeader = $headers['Authorization'];
        
        // Check if it's a Bearer token
        if (strpos($authHeader, 'Bearer ') !== 0) {
            Response::unauthorized('Invalid authorization format');
        }

        $token = substr($authHeader, 7);
        $decoded = $this->jwtService->verify($token);
        
        if (!$decoded) {
            Response::unauthorized('Invalid or expired token');
        }

        // Get user from database
        $user = User::find($decoded->sub);
        if (!$user || !$user['is_active']) {
            Response::unauthorized('User not found or inactive');
        }

        // Check roles if required
        if ($requiredRoles && !in_array($user['role'], (array) $requiredRoles)) {
            Response::forbidden('Insufficient permissions');
        }

        // Store user in request context
        $GLOBALS['user'] = $user;
        return $user;
    }

    public static function user() {
        return $GLOBALS['user'] ?? null;
    }
}