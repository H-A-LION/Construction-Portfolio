<?php
// src/Helpers/Validator.php
namespace App\Helpers;

class Validator {
    private $data;
    private $rules = [];
    private $errors = [];

    public function __construct($data) {
        $this->data = $data;
    }

    public function required($field) {
        $this->rules[$field][] = 'required';
        return $this;
    }

    public function email($field) {
        $this->rules[$field][] = 'email';
        return $this;
    }

    public function string($field) {
        $this->rules[$field][] = 'string';
        return $this;
    }

    public function minLength($field, $min) {
        $this->rules[$field][] = ['min_length' => $min];
        return $this;
    }

    public function maxLength($field, $max) {
        $this->rules[$field][] = ['max_length' => $max];
        return $this;
    }

    public function integer($field) {
        $this->rules[$field][] = 'integer';
        return $this;
    }

    public function passes() {
        $this->errors = [];
        foreach ($this->rules as $field => $rules) {
            foreach ($rules as $rule) {
                $this->validateRule($field, $rule);
            }
        }
        return empty($this->errors);
    }

    private function validateRule($field, $rule) {
        $value = $this->data[$field] ?? null;

        if ($rule === 'required') {
            if ($value === null || $value === '' || $value === []) {
                $this->errors[$field][] = "The {$field} field is required";
            }
            return;
        }

        if ($rule === 'email') {
            if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $this->errors[$field][] = "The {$field} must be a valid email address";
            }
            return;
        }

        if ($rule === 'string') {
            if ($value !== null && !is_string($value)) {
                $this->errors[$field][] = "The {$field} must be a string";
            }
            return;
        }

        if ($rule === 'integer') {
            if ($value !== null && !filter_var($value, FILTER_VALIDATE_INT)) {
                $this->errors[$field][] = "The {$field} must be an integer";
            }
            return;
        }

        if (is_array($rule)) {
            if (isset($rule['min_length'])) {
                $min = $rule['min_length'];
                if ($value !== null && strlen($value) < $min) {
                    $this->errors[$field][] = "The {$field} must be at least {$min} characters";
                }
            }
            if (isset($rule['max_length'])) {
                $max = $rule['max_length'];
                if ($value !== null && strlen($value) > $max) {
                    $this->errors[$field][] = "The {$field} must not exceed {$max} characters";
                }
            }
        }
    }

    public function errors() {
        return $this->errors;
    }
}