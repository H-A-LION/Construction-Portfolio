<?php
namespace App\Controllers;

use App\Services\AnalyticsGateway;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;

class AnalyticsController {
    private AnalyticsGateway $gateway;
    
    public function __construct() {
        $this->gateway = new AnalyticsGateway();
    }
    
    public function track(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Basic validation
            if (!isset($input['eventType']) || !isset($input['visitorId'])) {
                Response::json(['error' => 'Missing required fields'], 400);
                return;
            }
            
            $result = $this->gateway->forwardRequest('/api/analytics/track', 'POST', $input);
            Response::json($result['data'], $result['status_code']);
            
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getOverview(): void {
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();
            
            if (!$user) {
                Response::json(['error' => 'Unauthorized'], 401);
                return;
            }
            
            $days = $_GET['days'] ?? 30;
            $result = $this->gateway->forwardRequest("/api/analytics/admin/overview?days=$days", 'GET');
            Response::json($result['data'], $result['status_code']);
            
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getTrafficSources(): void {
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();
            
            if (!$user) {
                Response::json(['error' => 'Unauthorized'], 401);
                return;
            }
            
            $days = $_GET['days'] ?? 30;
            $result = $this->gateway->forwardRequest("/api/analytics/admin/traffic-sources?days=$days", 'GET');
            Response::json($result['data'], $result['status_code']);
            
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getGeolocation(): void {
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();
            
            if (!$user) {
                Response::json(['error' => 'Unauthorized'], 401);
                return;
            }
            
            $days = $_GET['days'] ?? 30;
            $result = $this->gateway->forwardRequest("/api/analytics/admin/geolocation?days=$days", 'GET');
            Response::json($result['data'], $result['status_code']);
            
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getDeviceBreakdown(): void {
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();
            
            if (!$user) {
                Response::json(['error' => 'Unauthorized'], 401);
                return;
            }
            
            $days = $_GET['days'] ?? 30;
            $result = $this->gateway->forwardRequest("/api/analytics/admin/device-breakdown?days=$days", 'GET');
            Response::json($result['data'], $result['status_code']);
            
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getUniqueVsReturning(): void {
        try {
            $auth = new AuthMiddleware();
            $user = $auth->handle();
            
            if (!$user) {
                Response::json(['error' => 'Unauthorized'], 401);
                return;
            }
            
            $days = $_GET['days'] ?? 30;
            $result = $this->gateway->forwardRequest("/api/analytics/admin/unique-vs-returning?days=$days", 'GET');
            Response::json($result['data'], $result['status_code']);
            
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
}