<?php
// src/Controllers/ContentController.php
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Database;
use App\Models\Content;
use App\Models\User;
use Exception;
use PDO;

class ContentController {
    
    /**
     * Get content for a specific section
     */
    public function get($section) {
        $content = Content::getLatest($section);
        if (!$content) {
            return Response::notFound('Content not found');
        }
        
        // data is already JSON type in database, but might be returned as string
        $data = $content['data'];
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        
        return Response::success($data);
    }

    /**
     * Get all content sections - FIXED
     */
    // src/Controllers/ContentController.php
    public function getAll() {
        try {
            $db = Database::getInstance()->getConnection();
        
            // Get all distinct sections
            $stmt = $db->query("SELECT DISTINCT section FROM content ORDER BY section");
            $sections = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
            if (empty($sections)) {
                return Response::notFound('Content not found');
            }
        
            $result = [];
            foreach ($sections as $section) {
                // Get latest published version
                $stmt = $db->prepare("
                    SELECT * FROM content 
                    WHERE section = :section AND is_published = 1 
                    ORDER BY version DESC LIMIT 1
                ");
                $stmt->execute([':section' => $section]);
                $content = $stmt->fetch(PDO::FETCH_ASSOC);
            
                if ($content) {
                    $data = $content['data'];
                    $data = json_decode($data, true);
                    $result[] = [
                        'section' => $section,
                        'version' => $content['version'],
                        'data' => $data,
                        'is_published' => (bool)$content['is_published'],
                        'last_modified' => $content['created_at'],
                        'last_modified_by' => $content['last_modified_by'],
                        'hero_image' => $content['hero_image'] ?? null,
                        'hero_image_alt' => $content['hero_image_alt'] ?? null
                    ];
                }
            }
        
            if (empty($result)) {
                return Response::notFound('Content not found');
            }
        
            return Response::success($result);
        } catch (\Exception $e) {
            return Response::error('Failed to fetch content: ' . $e->getMessage(), 500);
        }
    }   

    /**
     * Update content for a specific section - FIXED
     */
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
            'data' => json_encode($input['data']),
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
            'data' => is_string($input['data']) ? json_decode($input['data'], true) : $input['data']
        ], 'Content updated successfully');
    }

    /**
     * Upload hero image - FIXED
     */
    public function uploadHeroImage() {
        try {
            $user = $GLOBALS['user'] ?? null;
            if (!$user) {
                return Response::error('Unauthorized', 401);
            }
            
            if (!isset($_FILES['hero_image']) || $_FILES['hero_image']['error'] !== UPLOAD_ERR_OK) {
                return Response::error('No image file provided or upload error', 400);
            }
            
            $file = $_FILES['hero_image'];
            
            // Validate image type
            $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
            
            if (!in_array($mimeType, $allowedTypes)) {
                return Response::error('Invalid image type. Allowed: JPEG, PNG, WEBP, GIF', 400);
            }
            
            // Validate file size (5MB max)
            $maxSize = 5 * 1024 * 1024;
            if ($file['size'] > $maxSize) {
                return Response::error('Image too large. Max size: 5MB', 400);
            }
            
            // Validate image dimensions
            $imageInfo = getimagesize($file['tmp_name']);
            if ($imageInfo === false) {
                return Response::error('Invalid image file', 400);
            }
            
            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'hero_' . time() . '_' . uniqid() . '.' . $extension;
            
            // Create upload directory if it doesn't exist
            $uploadDir = __DIR__ . '/../../uploads/hero/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Move uploaded file
            $targetPath = $uploadDir . $filename;
            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                return Response::error('Failed to upload image', 500);
            }
            
            // Save image path to database
            $imagePath = '/uploads/hero/' . $filename;
            $db = Database::getInstance();
            
            // Update content table - add hero_image column if not exists
            try {
                $db->getConnection()->exec("ALTER TABLE content ADD COLUMN IF NOT EXISTS hero_image VARCHAR(255) DEFAULT NULL");
            } catch (\PDOException $e) {
                // Column might already exist
            }
            
            $stmt = $db->prepare("UPDATE content SET hero_image = ? WHERE section = 'hero' ORDER BY id DESC LIMIT 1");
            $stmt->execute([$imagePath]);
            
            return Response::success([
                'success' => true,
                'path' => $imagePath,
                'url' => $this->getImageUrl($imagePath)
            ], 'Image uploaded successfully');
            
        } catch (Exception $e) {
            return Response::error('Upload failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete hero image - FIXED
     */
    public function deleteHeroImage() {
        try {
            $user = $GLOBALS['user'] ?? null;
            if (!$user) {
                return Response::error('Unauthorized', 401);
            }
            
            $db = Database::getInstance();
            
            // Get current image path
            $stmt = $db->prepare("SELECT hero_image FROM content WHERE section = 'hero' ORDER BY id DESC LIMIT 1");
            $stmt->execute();
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if (!$result || empty($result['hero_image'])) {
                return Response::error('No image to delete', 404);
            }
            
            $imagePath = $result['hero_image'];
            
            // Delete physical file
            $fullPath = __DIR__ . '/../..' . $imagePath;
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
            
            // Remove from database
            $stmt = $db->prepare("UPDATE content SET hero_image = NULL WHERE section = 'hero' ORDER BY id DESC LIMIT 1");
            $stmt->execute();
            
            return Response::success(null, 'Image deleted successfully');
            
        } catch (Exception $e) {
            return Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get content history for a section - FIXED
     */
    public function history($section) {
        $history = Content::getHistory($section);
        
        // Decode data for each version
        if (is_array($history)) {
            foreach ($history as &$item) {
                $item['data'] = isset($item['data']) && !empty($item['data']) 
                    ? json_decode($item['data'], true) 
                    : [];
            }
        }
        
        return Response::success($history ?: []);
    }

    /**
     * Revert to a specific version - FIXED
     */
    public function revert($section, $version) {
        $user = $GLOBALS['user'] ?? null;
        if (!$user) {
            return Response::error('Unauthorized', 401);
        }
        
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
            'data' => $historicalContent['data'],
            'version' => $newVersion,
            'last_modified_by' => $user['id'],
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

    /**
     * Helper: Get full image URL
     */
    private function getImageUrl($path) {
        if (empty($path)) {
            return null;
        }
        
        $baseUrl = $_ENV['APP_URL'] ?? 'http://localhost:8000';
        return $baseUrl . $path;
    }
}