<?php
// index.php //
require_once __DIR__ . '/vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Error handling
if ($_ENV['APP_DEBUG'] ?? false) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header("Access-Control-Allow-Origin: ".($_ENV['CORS_ORIGIN'] ?? "*"));
    header('Access-Control-Allow-Credentials: true');
}
// header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

// Initialize router
$router = new App\Routes\Router();

// Auth Routes (Public)
$router->post('/api/v1/auth/login', [App\Controllers\AuthController::class, 'login']);
$router->post('/api/v1/auth/register', [App\Controllers\AuthController::class, 'register']);

// Auth Routes (Protected)
$router->get('/api/v1/auth/me', [App\Controllers\AuthController::class, 'me']);
$router->post('/api/v1/auth/logout', [App\Controllers\AuthController::class, 'logout']);
$router->put('/api/v1/auth/update', [App\Controllers\AuthController::class, 'updateProfile']);

// Content Routes (Public)
$router->get('/api/v1/content/{section}', [App\Controllers\ContentController::class, 'get']);

// Content Routes (Protected)
$router->get('/api/v1/content/all', [App\Controllers\ContentController::class, 'getAll']);
$router->put('/api/v1/content/{section}', [App\Controllers\ContentController::class, 'update']);
$router->get('/api/v1/content/{section}/history', [App\Controllers\ContentController::class, 'history']);
$router->post('/api/v1/content/{section}/revert/{version}', [App\Controllers\ContentController::class, 'revert']);
$router->post('/api/v1/content/hero/upload-image', [App\Controllers\ContentController::class, 'uploadHeroImage']);
$router->delete('/api/v1/content/hero/delete-image', [App\Controllers\ContentController::class, 'deleteHeroImage']);

// Project Routes (Protected)
$router->get('/api/v1/projects', [App\Controllers\ProjectController::class, 'index']);
$router->get('/api/v1/projects/{id}', [App\Controllers\ProjectController::class, 'show']);
$router->post('/api/v1/projects', [App\Controllers\ProjectController::class, 'store']);
$router->put('/api/v1/projects/{id}', [App\Controllers\ProjectController::class, 'update']);
$router->delete('/api/v1/projects/{id}', [App\Controllers\ProjectController::class, 'delete']);
$router->put('/api/v1/projects/reorder', [App\Controllers\ProjectController::class, 'reorder']);

// Service Routes (Protected)
$router->get('/api/v1/services', [App\Controllers\ServiceController::class, 'index']);
$router->get('/api/v1/services/{id}', [App\Controllers\ServiceController::class, 'show']);
$router->post('/api/v1/services', [App\Controllers\ServiceController::class, 'store']);
$router->put('/api/v1/services/{id}', [App\Controllers\ServiceController::class, 'update']);
$router->delete('/api/v1/services/{id}', [App\Controllers\ServiceController::class, 'delete']);
$router->put('/api/v1/services/reorder', [App\Controllers\ServiceController::class, 'reorder']);

// Team Routes (Protected)
$router->get('/api/v1/team', [App\Controllers\TeamController::class, 'index']);
$router->get('/api/v1/team/{id}', [App\Controllers\TeamController::class, 'show']);
$router->post('/api/v1/team', [App\Controllers\TeamController::class, 'store']);
$router->put('/api/v1/team/{id}', [App\Controllers\TeamController::class, 'update']);
$router->delete('/api/v1/team/{id}', [App\Controllers\TeamController::class, 'delete']);
$router->put('/api/v1/team/reorder', [App\Controllers\TeamController::class, 'reorder']);

// Dispatch
$router->dispatch();
