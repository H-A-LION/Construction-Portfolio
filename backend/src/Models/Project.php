<?php
// src/Models/Project.php
namespace App\Models;

use App\Helpers\Database;
use PDO;

class Project {
    public static function getAll($filters = [], $limit = 10, $page = 1) {
        $db = Database::getInstance()->getConnection();
        
        $where = [];
        $params = [];
        
        if (!empty($filters['category'])) {
            $where[] = "category = :category";
            $params[':category'] = $filters['category'];
        }
        
        if (!empty($filters['is_featured'])) {
            $where[] = "is_featured = :is_featured";
            $params[':is_featured'] = $filters['is_featured'];
        }

        $whereClause = !empty($where) ? "WHERE " . implode(' AND ', $where) : "";
        
        $offset = ($page - 1) * $limit;
        
        $stmt = $db->prepare("
            SELECT * FROM projects 
            {$whereClause}
            ORDER BY display_order ASC, created_at DESC 
            LIMIT :limit OFFSET :offset
        ");
        
        //$params[':limit'] = $limit;
        //$params[':offset'] = $offset;

        //Represents the SQL INTEGER data type.
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        //Array indexed by column name only. 
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Safely decode JSON fields if they exist
        foreach ($projects as &$project) {
        if (isset($project['image']) && $project['image'] !== null) {
            $project['image'] = json_decode($project['image'], true);
        }
        if (isset($project['is_featured']) && $project['is_featured'] !== null) {
            $project['is_featured'] = json_decode($project['is_featured'], true);
        }
        if (isset($project['tags']) && $project['tags'] !== null) {
            $project['tags'] = json_decode($project['tags'], true);
        }
        }
        
        // Get total count
        $countStmt = $db->prepare("SELECT COUNT(*) as total FROM projects {$whereClause}");
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute($params);
        //Array indexed by column name only. 
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        return [
            'data' => $projects,
            'pagination' => [
                'page' => (int) $page,
                'limit' => (int) $limit,
                'total' => (int) $total,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    public static function find($id) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($project) {
        if (isset($project['images']) && $project['images'] !== null) {
            $project['images'] = json_decode($project['images'], true);
        }
        if (isset($project['features']) && $project['features'] !== null) {
            $project['features'] = json_decode($project['features'], true);
        }
        if (isset($project['tags']) && $project['tags'] !== null) {
            $project['tags'] = json_decode($project['tags'], true);
        }
        }
        
        return $project;
    }

    public static function create($data) {
        $db = Database::getInstance()->getConnection();
        
        // Encode JSON fields
        if (isset($data['image'])) {
            $data['image'] = json_encode($data['image']);
        }
        if (isset($data['is_featured'])) {
            $data['is_featured'] = json_encode($data['is_featured']);
        }
        
        $fields = array_keys($data);
        $placeholders = array_map(function($field) {
            return ":$field";
        }, $fields);
        
        $sql = "INSERT INTO projects (" . implode(', ', $fields) . ") 
                VALUES (" . implode(', ', $placeholders) . ")";
        
        $stmt = $db->prepare($sql);
        return $stmt->execute($data);
    }

    public static function update($id, $data) {
        $db = Database::getInstance()->getConnection();
        
        // Encode JSON fields
        if (isset($data['image'])) {
            $data['image'] = json_encode($data['image']);
        }
        if (isset($data['is_featured'])) {
            $data['is_featured'] = json_encode($data['is_featured']);
        }
        
        $sets = [];
        $params = [':id' => $id];
        
        foreach ($data as $key => $value) {
            $sets[] = "$key = :$key";
            $params[":$key"] = $value;
        }
        
        if (empty($sets)) {
            return true; // Nothing to update
        } 
        $sql = "UPDATE projects SET " . implode(', ', $sets) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete($id) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM projects WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public static function reorder($orders) {
        $db = Database::getInstance()->getConnection();
        $db->beginTransaction();
        
        try {
            foreach ($orders as $order) {
                $stmt = $db->prepare("UPDATE projects SET display_order = :order WHERE id = :id");
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