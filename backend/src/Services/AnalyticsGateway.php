<?php
namespace App\Services;

class AnalyticsGateway {
    private string $serviceUrl;
    private string $apiKey;
    
    public function __construct() {
        $this->serviceUrl = $_ENV['ANALYTICS_SERVICE_URL'] ?? 'http://localhost:8000';
        $this->apiKey = $_ENV['INTERNAL_API_KEY'] ?? 'your-secret-key-12345';
    }
    
    public function forwardRequest(string $endpoint, string $method, ?array $data = null): array {
        $ch = curl_init();
        $url = $this->serviceUrl . $endpoint;
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'X-Internal-Auth: ' . $this->apiKey
        ]);
        
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            curl_close($ch);
            return ['success' => false, 'status_code' => 503, 'data' => ['error' => curl_error($ch)]];
        }
        
        curl_close($ch);
        
        return [
            'success' => $httpCode >= 200 && $httpCode < 300,
            'status_code' => $httpCode,
            'data' => json_decode($response, true) ?? $response
        ];
    }
}