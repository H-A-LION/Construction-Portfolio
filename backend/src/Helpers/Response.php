<?php
// src/Helpers/Response.php
namespace App\Helpers;

class Response {
    public static function success($data = null, $message = 'Success', $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    public static function error($message, $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    public static function unauthorized($message = 'Unauthorized') {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    public static function forbidden($message = 'Forbidden') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    public static function notFound($message = 'Not found') {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    public static function validationError($errors) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $errors
        ]);
        exit;
    }

    public static function json($data, $code = 200) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}