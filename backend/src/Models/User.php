<?php
// src/Models/User.php
namespace App\Models;

use App\Helpers\Database;
use PDO;

class User {
    public static function create($data) {
        $db = Database::getInstance()->getConnection();
        
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        
        $stmt = $db->prepare("
            INSERT INTO users (name, email, password, role, is_active) 
            VALUES (:name, :email, :password, :role, :is_active)
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':password' => $hashedPassword,
            ':role' => $data['role'] ?? 'viewer',
            ':is_active' => $data['is_active'] ?? true
        ]);
        
        return $db->lastInsertId();
    }

    public static function findByEmail($email) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function find($id) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function update($id, $data) {
        $db = Database::getInstance()->getConnection();
        
        $fields = [];
        $values = [':id' => $id];
        
        foreach ($data as $key => $value) {
            if ($key === 'password') {
                $value = password_hash($value, PASSWORD_BCRYPT);
            }
            $fields[] = "$key = :$key";
            $values[":$key"] = $value;
        }
        
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        return $stmt->execute($values);
    }

    public static function verifyPassword($password, $hashed) {
        return password_verify($password, $hashed);
    }
}