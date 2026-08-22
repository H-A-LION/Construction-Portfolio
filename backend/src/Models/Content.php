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
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function getAllSections() {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("
            SELECT section, MAX(version) as max_version 
            FROM content 
            WHERE is_published = 1 
            GROUP BY section
        ");
        $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = [];
        foreach ($sections as $section) {
            $stmt = $db->prepare("
                SELECT * FROM content 
                WHERE section = :section AND version = :version
            ");
            $stmt->execute([
                ':section' => $section['section'],
                ':version' => $section['max_version']
            ]);
            $content = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($content) {
                $result[$content['section']] = json_decode($content['data'], true);
            }
        }
        
        return $result;
    }

    public static function create($data) {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            INSERT INTO content (section, data, version, last_modified_by, is_published) 
            VALUES (:section, :data, :version, :last_modified_by, :is_published)
        ");
        
        return $stmt->execute([
            ':section' => $data['section'],
            ':data' => json_encode($data['data']),
            ':version' => $data['version'],
            ':last_modified_by' => $data['last_modified_by'] ?? null,
            ':is_published' => $data['is_published'] ?? true
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