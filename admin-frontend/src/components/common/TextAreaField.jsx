// src/admin/components/common/TextAreaField.jsx
import React from 'react';

const TextAreaField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  required = false
}) => {
  return (
    <div className="textarea-field">
      {label && <label>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );
};

export default TextAreaField;