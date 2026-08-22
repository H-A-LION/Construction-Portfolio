<?php
// backend/src/Controllers/ServiceController.php
namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Service;

class ServiceController {
    public function index() {
        $services = Service::getAll();
        return Response::success($services);
    }

    public function show($id) {
        $service = Service::find($id);
        if (!$service) {
            return Response::notFound('Service not found');
        }
        return Response::success($service);
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['title', 'icon', 'description'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return Response::error("Field '{$field}' is required", 400);
            }
        }
        
        $result = Service::create($input);
        if ($result) {
            return Response::success(null, 'Service created successfully', 201);
        }
        return Response::error('Failed to create service', 500);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $service = Service::find($id);
        if (!$service) {
            return Response::notFound('Service not found');
        }
        
        $result = Service::update($id, $input);
        if ($result) {
            return Response::success(null, 'Service updated successfully');
        }
        return Response::error('Failed to update service', 500);
    }

    public function delete($id) {
        $service = Service::find($id);
        if (!$service) {
            return Response::notFound('Service not found');
        }
        
        $result = Service::delete($id);
        if ($result) {
            return Response::success(null, 'Service deleted successfully');
        }
        return Response::error('Failed to delete service', 500);
    }

    public function reorder() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['orders']) || !is_array($input['orders'])) {
            return Response::error('Orders array is required', 400);
        }
        
        $result = Service::reorder($input['orders']);
        if ($result) {
            return Response::success(null, 'Services reordered successfully');
        }
        return Response::error('Failed to reorder services', 500);
    }
}