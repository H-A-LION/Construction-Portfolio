<?php
// src/Controllers/ContentController.php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Content;
use App\Models\User;

class ContentController {
    public function get($section) {
        $content = Content::getLatest($section);
        if (!$content) {
            return Response::notFound('Content not found');
        }
        
        $content['data'] = json_decode($content['data'], true);
        return Response::success($content['data']);
    }

    public function getAll() {
        $content = Content::getAllSections();
        return Response::success($content);
    }

    public function update($section) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['data'])) {
            return Response::error('Data is required', 400);
        }
        
        $user = $GLOBALS['user'] ?? null;
        $isPublished = $input['is_published'] ?? true;
        
        // Get latest version
        $latestVersion = Content::getLatestVersion($section);
        $newVersion = $latestVersion + 1;
        
        // Create new version
        $result = Content::create([
            'section' => $section,
            'data' => $input['data'],
            'version' => $newVersion,
            'last_modified_by' => $user ? $user['id'] : null,
            'is_published' => $isPublished
        ]);
        
        if (!$result) {
            return Response::error('Failed to update content', 500);
        }
        
        return Response::success([
            'section' => $section,
            'version' => $newVersion,
            'data' => $input['data']
        ], 'Content updated successfully');
    }

    public function history($section) {
        $history = Content::getHistory($section);
        
        // Decode data for each version
        foreach ($history as &$item) {
            $item['data'] = json_decode($item['data'], true);
        }
        
        return Response::success($history);
    }

    public function revert($section, $version) {
        $user = $GLOBALS['user'] ?? null;
        
        // Get the version to revert to
        $historicalContent = Content::getVersion($section, $version);
        if (!$historicalContent) {
            return Response::notFound('Version not found');
        }
        
        // Get latest version
        $latestVersion = Content::getLatestVersion($section);
        $newVersion = $latestVersion + 1;
        
        // Create new version with historical data
        $result = Content::create([
            'section' => $section,
            'data' => json_decode($historicalContent['data'], true),
            'version' => $newVersion,
            'last_modified_by' => $user ? $user['id'] : null,
            'is_published' => true
        ]);
        
        if (!$result) {
            return Response::error('Failed to revert content', 500);
        }
        
        return Response::success([
            'section' => $section,
            'version' => $newVersion,
            'reverted_from_version' => (int) $version
        ], "Reverted to version {$version}");
    }
}

// backend/src/Controllers/ContentController.php
public function updateHeroImage($request) {
    try {
        $userId = $request['user_id'];
        $file = $_FILES['hero_image'];
        
        // Validate image
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            return Response::json(['error' => 'Invalid image type'], 400);
        }
        
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $maxSize) {
            return Response::json(['error' => 'Image too large'], 400);
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'hero_' . time() . '.' . $extension;
        $uploadPath = __DIR__ . '/../../uploads/hero/';
        
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }
        
        // Move file
        if (move_uploaded_file($file['tmp_name'], $uploadPath . $filename)) {
            $db = Database::getInstance();
            $stmt = $db->prepare("UPDATE content SET hero_image = ? WHERE id = 1");
            $stmt->execute(['/uploads/hero/' . $filename]);
            
            return Response::json([
                'success' => true,
                'path' => '/uploads/hero/' . $filename
            ]);
        }
        
        return Response::json(['error' => 'Upload failed'], 500);
    } catch (Exception $e) {
        return Response::json(['error' => $e->getMessage()], 500);
    }
}