<?php
// src/Services/JWTService.php
namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTService {
    private $secret;
    private $expire;

    public function __construct() {
        $this->secret = $_ENV['JWT_SECRET'] ?? 'default_secret_key';
        $this->expire = $_ENV['JWT_EXPIRE'] ?? '7d';
    }

    public function generate($userId, $data = []) {
        $expireSeconds = $this->parseExpireTime($this->expire);
        
        $payload = array_merge([
            'sub' => $userId,
            'iat' => time(),
            'exp' => time() + $expireSeconds
        ], $data);

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function decode($token) {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }

    public function verify($token) {
        $decoded = $this->decode($token);
        if (!$decoded) {
            return false;
        }
        
        // Check if token is expired
        if (isset($decoded->exp) && $decoded->exp < time()) {
            return false;
        }
        
        return $decoded;
    }

    private function parseExpireTime($expire) {
        $unit = substr($expire, -1);
        $value = (int) substr($expire, 0, -1);
        
        switch ($unit) {
            case 'd': return $value * 86400;
            case 'h': return $value * 3600;
            case 'm': return $value * 60;
            default: return (int) $expire;
        }
    }
}