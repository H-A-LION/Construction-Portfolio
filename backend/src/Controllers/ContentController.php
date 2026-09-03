<?php
// src/Controllers/ContentController.php
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Database;
use App\Models\Content;
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
    
        // Decode data
        $data = $content['data'];
        if (is_string($data)) {
            $decoded = json_decode($data, true);
            if ($decoded === null && is_string($data)) {
                $cleanData = trim($data);
                if (strpos($cleanData, '"') === 0) {
                    $cleanData = stripslashes($cleanData);
                    $cleanData = trim($cleanData, '"');
                    $cleanData = stripslashes($cleanData);
                    $decoded = json_decode($cleanData, true);
                }
            }
            $data = $decoded ?: [];
        }
        
        // Add image fields to response based on section
        $response = $data;
        if (is_array($response)) {
            // Hero section
            if ($section === 'hero') {
                $response['hero_image'] = $content['hero_image'] ?? null;
                $response['hero_image_alt'] = $content['hero_image_alt'] ?? null;
            }
            // About section
            if ($section === 'about') {
                $response['about_image_1'] = $content['about_image_1'] ?? null;
                $response['about_image_1_alt'] = $content['about_image_1_alt'] ?? null;
                $response['about_image_2'] = $content['about_image_2'] ?? null;
                $response['about_image_2_alt'] = $content['about_image_2_alt'] ?? null;
            }
            // Services section
            if ($section === 'services') {
                $response['background_image'] = $content['background_image'] ?? null;
                $response['background_image_alt'] = $content['background_image_alt'] ?? null;
            }
            // Contact section - no images typically
        }

        return Response::success($response);
    }

    /**
     * Update content for a specific section
     */
    public function update($section) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['data'])) {
            return Response::error('Data is required', 400);
        }
        
        $user = $GLOBALS['user'] ?? null;
        $isPublished = $input['is_published'] ?? true;
        $data = $input['data'];
        
        // Handle image fields based on section
        $heroImage = null;
        $heroImageAlt = null;
        $aboutImage1 = null;
        $aboutImage1Alt = null;
        $aboutImage2 = null;
        $aboutImage2Alt = null;
        $backgroundImage = null;
        $backgroundImageAlt = null;
        
        // Hero section images
        if ($section === 'hero') {
            $heroImage = $data['hero_image'] ?? null;
            $heroImageAlt = $data['hero_image_alt'] ?? null;
            unset($data['hero_image']);
            unset($data['hero_image_alt']);
        }
        
        // About section images
        if ($section === 'about') {
            $aboutImage1 = $data['about_image_1'] ?? null;
            $aboutImage1Alt = $data['about_image_1_alt'] ?? null;
            $aboutImage2 = $data['about_image_2'] ?? null;
            $aboutImage2Alt = $data['about_image_2_alt'] ?? null;
            unset($data['about_image_1']);
            unset($data['about_image_1_alt']);
            unset($data['about_image_2']);
            unset($data['about_image_2_alt']);
        }
        
        // Services section background
        if ($section === 'services') {
            $backgroundImage = $data['background_image'] ?? null;
            $backgroundImageAlt = $data['background_image_alt'] ?? null;
            unset($data['background_image']);
            unset($data['background_image_alt']);
        }
        
        // Get latest version
        $latestVersion = Content::getLatestVersion($section);
        $newVersion = $latestVersion + 1;
        
        // Create new version with appropriate image fields
        $result = Content::create([
            'section' => $section,
            'data' => json_encode($data),
            'version' => $newVersion,
            'last_modified_by' => $user ? $user['id'] : null,
            'is_published' => $isPublished,
            'hero_image' => $heroImage,
            'hero_image_alt' => $heroImageAlt,
            'about_image_1' => $aboutImage1,
            'about_image_1_alt' => $aboutImage1Alt,
            'about_image_2' => $aboutImage2,
            'about_image_2_alt' => $aboutImage2Alt,
            'background_image' => $backgroundImage,
            'background_image_alt' => $backgroundImageAlt
        ]);
        
        if (!$result) {
            return Response::error('Failed to update content', 500);
        }
        
        return Response::success([
            'section' => $section,
            'version' => $newVersion,
            'data' => $data
        ], 'Content updated successfully');
    }

    /**
     * Upload image for any section
     */
    public function uploadImage($section) {
        try {
            $user = $GLOBALS['user'] ?? null;
            if (!$user) {
                return Response::error('Unauthorized', 401);
            }
            
            if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
                return Response::error('No image file provided or upload error', 400);
            }
            
            $file = $_FILES['image'];
            $field = $_POST['field'] ?? 'hero_image';
            $originalName = $_POST['original_name'] ?? $file['name'];
            
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
            
            // Generate unique filename with original name preserved
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
            $cleanBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '', $baseName);
            $filename = $cleanBaseName . '_' . time() . '_' . uniqid() . '.' . $extension;
            
            // Create upload directory if it doesn't exist
            $uploadDir = __DIR__ . '/../../uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Move uploaded file
            $targetPath = $uploadDir . $filename;
            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                return Response::error('Failed to upload image', 500);
            }
            
            $imagePath = '/uploads/' . $filename;
            
            // Store both the generated path and original name mapping
            $db = Database::getInstance();
            
            // Get current content for this section
            $stmt = $db->prepare("SELECT id, image_mapping FROM content WHERE section = ? ORDER BY version DESC LIMIT 1");
            $stmt->execute([$section]);
            $currentContent = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $imageMapping = [];
            if ($currentContent && $currentContent['image_mapping']) {
                $imageMapping = json_decode($currentContent['image_mapping'], true) ?: [];
            }
            
            // Store mapping of original name to generated path
            $imageMapping[$field] = [
                'original' => $originalName,
                'path' => $imagePath,
                'uploaded_at' => date('Y-m-d H:i:s')
            ];
            
            if ($currentContent) {
                // Update existing content with image and mapping
                $stmt = $db->prepare("UPDATE content SET {$field} = ?, image_mapping = ? WHERE id = ?");
                $stmt->execute([$imagePath, json_encode($imageMapping), $currentContent['id']]);
            } else {
                // Create new content with image and mapping
                $stmt = $db->prepare("INSERT INTO content (section, data, version, {$field}, image_mapping, is_published) VALUES (?, '{}', 1, ?, ?, 1)");
                $stmt->execute([$section, $imagePath, json_encode($imageMapping)]);
            }
            
            return Response::success([
                'success' => true,
                'path' => $imagePath,
                'url' => $this->getImageUrl($imagePath),
                'original_name' => $originalName,
                'field' => $field
            ], 'Image uploaded successfully');
            
        } catch (Exception $e) {
            return Response::error('Upload failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete image for any section
     */
    public function deleteImage($section) {
        try {
            $user = $GLOBALS['user'] ?? null;
            if (!$user) {
                return Response::error('Unauthorized', 401);
            }
            
            $field = $_POST['field'] ?? 'hero_image';
            
            $db = Database::getInstance();
            
            // Get current image path
            $stmt = $db->prepare("SELECT {$field} FROM content WHERE section = ? ORDER BY id DESC LIMIT 1");
            $stmt->execute([$section]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$result || empty($result[$field])) {
                return Response::error('No image to delete', 404);
            }
            
            $imagePath = $result[$field];
            
            // Delete physical file
            $fullPath = __DIR__ . '/../..' . $imagePath;
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
            
            // Remove from database
            $stmt = $db->prepare("UPDATE content SET {$field} = NULL WHERE section = ? ORDER BY id DESC LIMIT 1");
            $stmt->execute([$section]);
            
            return Response::success(null, 'Image deleted successfully');
            
        } catch (Exception $e) {
            return Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Helper: Get full image URL
     */
    private function getImageUrl($path) {
        if (empty($path)) {
            return null;
        }
        
        $baseUrl = $_ENV['APP_URL'] ?? 'http://localhost:8000/';
        return rtrim($baseUrl, '/') . $path;
    }
}