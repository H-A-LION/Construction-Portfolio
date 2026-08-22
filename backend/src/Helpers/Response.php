<?php
// src/Helpers/Response.php
namespace App\Helpers;

class Response {
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        return self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    public static function error($message, $statusCode = 400, $errors = null) {
        $response = [
            'success' => false,
            'message' => $message
        ];
        if ($errors) {
            $response['errors'] = $errors;
        }
        return self::json($response, $statusCode);
    }

    public static function notFound($message = 'Resource not found') {
        return self::error($message, 404);
    }

    public static function unauthorized($message = 'Unauthorized') {
        return self::error($message, 401);
    }

    public static function forbidden($message = 'Forbidden') {
        return self::error($message, 403);
    }

    public static function validationError($errors) {
        return self::error('Validation failed', 422, $errors);
    }
}