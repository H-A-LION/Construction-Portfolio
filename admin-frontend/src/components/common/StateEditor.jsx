// src/admin/components/common/StatEditor.jsx
import React from 'react';
import InputField from './InputField';
import { TiDeleteOutline } from "react-icons/ti";

const StatEditor = ({ index, stat, onChange, onRemove }) => {
  return (
    <div className="stat-editor-item">
      <div className="stat-fields">
        <InputField
          label="Number/Value"
          value={stat.number}
          onChange={(val) => onChange(index, 'number', val)}
          placeholder="120+"
        />
        <InputField
          label="Label"
          value={stat.label}
          onChange={(val) => onChange(index, 'label', val)}
          placeholder="Projects Completed"
        />
      </div>
      <button type="button" onClick={onRemove} className="remove-btn">
        <TiDeleteOutline />
      </button>
    </div>
  );
};

export default StatEditor;