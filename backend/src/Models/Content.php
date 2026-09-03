<?php
// src/Models/Content.php
namespace App\Models;

use App\Helpers\Database;
use PDO;

class Content {
    public static function getLatest($section) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT * FROM content 
            WHERE section = :section AND is_published = 1 
            ORDER BY version DESC LIMIT 1
        ");
        $stmt->execute([':section' => $section]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result && is_string($result['data'])) {
            $decoded = json_decode($result['data'], true);
            if ($decoded === null) {
                $cleanData = trim($result['data']);
                if (strpos($cleanData, '"') === 0) {
                    $cleanData = stripslashes($cleanData);
                    $cleanData = trim($cleanData, '"');
                    $cleanData = stripslashes($cleanData);
                    $decoded = json_decode($cleanData, true);
                }
            }
            $result['data'] = $decoded ?: [];
        }
    
        return $result;
    }

    public static function create($data) {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            INSERT INTO content (section, data, version, last_modified_by, is_published, 
                hero_image, hero_image_alt, about_image_1, about_image_1_alt, 
                about_image_2, about_image_2_alt, background_image, background_image_alt,
                image_mapping) 
            VALUES (:section, :data, :version, :last_modified_by, :is_published, 
                :hero_image, :hero_image_alt, :about_image_1, :about_image_1_alt,
                :about_image_2, :about_image_2_alt, :background_image, :background_image_alt,
                :image_mapping)
        ");
        
        return $stmt->execute([
            ':section' => $data['section'],
            ':data' => json_encode($data['data']),
            ':version' => $data['version'],
            ':last_modified_by' => $data['last_modified_by'] ?? null,
            ':is_published' => $data['is_published'] ?? true,
            ':hero_image' => $data['hero_image'] ?? null,
            ':hero_image_alt' => $data['hero_image_alt'] ?? null,
            ':about_image_1' => $data['about_image_1'] ?? null,
            ':about_image_1_alt' => $data['about_image_1_alt'] ?? null,
            ':about_image_2' => $data['about_image_2'] ?? null,
            ':about_image_2_alt' => $data['about_image_2_alt'] ?? null,
            ':background_image' => $data['background_image'] ?? null,
            ':background_image_alt' => $data['background_image_alt'] ?? null,
            ':image_mapping' => $data['image_mapping'] ?? null
        ]);
    }

    public static function getHistory($section) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT c.*, u.name as modified_by_name 
            FROM content c
            LEFT JOIN users u ON c.last_modified_by = u.id
            WHERE c.section = :section 
            ORDER BY c.version DESC
        ");
        $stmt->execute([':section' => $section]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getVersion($section, $version) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT * FROM content 
            WHERE section = :section AND version = :version
        ");
        $stmt->execute([
            ':section' => $section,
            ':version' => $version
        ]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function getLatestVersion($section) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT MAX(version) as max_version 
            FROM content 
            WHERE section = :section
        ");
        $stmt->execute([':section' => $section]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['max_version'] ?? 0;
    }
}