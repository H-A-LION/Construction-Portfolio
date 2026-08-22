<?php
// src/Routes/Router.php
namespace App\Routes;

class Router {
    private $routes = [];
    private $method;
    private $path;
    private $params = [];

    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Handle OPTIONS requests for CORS
        if ($this->method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
            exit(0);
        }
    }

    public function get($route, $callback) {
        $this->addRoute('GET', $route, $callback);
    }

    public function post($route, $callback) {
        $this->addRoute('POST', $route, $callback);
    }

    public function put($route, $callback) {
        $this->addRoute('PUT', $route, $callback);
    }

    public function delete($route, $callback) {
        $this->addRoute('DELETE', $route, $callback);
    }

    private function addRoute($method, $route, $callback) {
        $this->routes[] = [
            'method' => $method,
            'route' => $route,
            'callback' => $callback
        ];
    }

    public function dispatch() {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $this->method) {
                continue;
            }
            
            $pattern = preg_replace('/\{[a-zA-Z_]+\}/', '([a-zA-Z0-9_]+)', $route['route']);
            $pattern = '#^' . $pattern . '$#';
            
            if (preg_match($pattern, $this->path, $matches)) {
                array_shift($matches);
                $this->params = $matches;
                
                // Call callback with parameters
                if (is_callable($route['callback'])) {
                    return call_user_func_array($route['callback'], $this->params);
                }
                
                // If callback is array [Controller::class, 'method']
                if (is_array($route['callback'])) {
                    $controller = new $route['callback'][0]();
                    $method = $route['callback'][1];
                    return call_user_func_array([$controller, $method], $this->params);
                }
            }
        }
        
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Route not found']);
    }
}