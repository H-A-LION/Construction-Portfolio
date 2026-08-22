// src/admin/components/common/InputField.jsx
import React from 'react';

const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  required = false,
  className = ''
}) => {
  return (
    <div className="input-field">
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    </div>
  );
};

export default InputField;