<?php
// backend/src/Models/Service.php
namespace App\Models;

use App\Helpers\Database;
use PDO;

class Service {
    public static function getAll() {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("
            SELECT * FROM services 
            WHERE is_active = 1 
            ORDER BY display_order ASC, created_at DESC
        ");
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // foreach ($services as &$service) {
        //     $service['features'] = json_decode($service['features'], true);
        // }
        
        return $services;
    }

    public static function find($id) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM services WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $service = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // if ($service) {
        //     $service['features'] = json_decode($service['features'], true);
        // }
        
        return $service;
    }

    public static function create($data) {
        $db = Database::getInstance()->getConnection();
        
        // if (isset($data['features'])) {
        //     $data['features'] = json_encode($data['features']);
        // }
        
        $fields = array_keys($data);
        $placeholders = array_map(function($field) {
            return ":$field";
        }, $fields);
        
        $sql = "INSERT INTO services (" . implode(', ', $fields) . ") 
                VALUES (" . implode(', ', $placeholders) . ")";
        
        $stmt = $db->prepare($sql);
        return $stmt->execute($data);
    }

    public static function update($id, $data) {
        $db = Database::getInstance()->getConnection();
        
        // if (isset($data['features'])) {
        //     $data['features'] = json_encode($data['features']);
        // }
        
        $sets = [];
        $params = [':id' => $id];
        
        foreach ($data as $key => $value) {
            $sets[] = "$key = :$key";
            $params[":$key"] = $value;
        }
        
        $sql = "UPDATE services SET " . implode(', ', $sets) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete($id) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM services WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public static function reorder($orders) {
        $db = Database::getInstance()->getConnection();
        $db->beginTransaction();
        
        try {
            foreach ($orders as $order) {
                $stmt = $db->prepare("UPDATE services SET display_order = :order WHERE id = :id");
                $stmt->execute([
                    ':order' => $order['order'],
                    ':id' => $order['id']
                ]);
            }
            $db->commit();
            return true;
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
}