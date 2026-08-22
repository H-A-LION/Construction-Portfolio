// src/admin/components/editors/HeroEditor.jsx
import React, { useState } from 'react';
import InputField from '../common/InputField';
import TextAreaField from '../common/TextAreaField';
import StatEditor from '../common/StatEditor';

const HeroEditor = ({ data, onChange }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...formData.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    const updated = { ...formData, stats: updatedStats };
    setFormData(updated);
    onChange(updated);
  };

  const addStat = () => {
    const updatedStats = [...formData.stats, { number: '', label: '' }];
    const updated = { ...formData, stats: updatedStats };
    setFormData(updated);
    onChange(updated);
  };

  const removeStat = (index) => {
    const updatedStats = formData.stats.filter((_, i) => i !== index);
    const updated = { ...formData, stats: updatedStats };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="editor-section">
      <h3>Hero Section Content</h3>
      
      <div className="editor-grid">
        <InputField
          label="Badge Text"
          value={formData.badge}
          onChange={(val) => handleChange('badge', val)}
          placeholder="2026 Award Winner"
        />

        <TextAreaField
          label="Title"
          value={formData.title}
          onChange={(val) => handleChange('title', val)}
          placeholder="Built with precision & integrity"
          rows={2}
        />

        <TextAreaField
          label="Description"
          value={formData.description}
          onChange={(val) => handleChange('description', val)}
          placeholder="From concept to completion..."
          rows={3}
        />

        <div className="stats-editor">
          <div className="stats-header">
            <label>Statistics</label>
            <button type="button" onClick={addStat} className="add-btn">
              <i className="fas fa-plus"></i> Add Stat
            </button>
          </div>
          
          {formData.stats.map((stat, index) => (
            <StatEditor
              key={index}
              index={index}
              stat={stat}
              onChange={handleStatChange}
              onRemove={() => removeStat(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;