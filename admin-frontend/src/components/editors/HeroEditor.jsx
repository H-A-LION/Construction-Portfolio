// src/admin/components/editors/HeroEditor.jsx
import React, { useState } from 'react';
import InputField from '../common/InputField';
import TextAreaField from '../common/TextAreaField';
import StatEditor from '../common/StateEditor';
import ImageUpload from '../common/ImageUpload';

const HeroEditor = ({ data, onChange }) => {
  const [formData, setFormData] = useState(data || { stats: [] });

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleImageChange = (path, filename, uploadResult) => {
    const updated = { 
      ...formData, 
      hero_image: path,
      hero_image_filename: filename,
      hero_image_upload: uploadResult // Store the full upload result
    };
    setFormData(updated);
    onChange(updated);
  };

  const handleAltTextChange = (value) => {
    const updated = { ...formData, hero_image_alt: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...(formData.stats || [])];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    const updated = { ...formData, stats: updatedStats };
    setFormData(updated);
    onChange(updated);
  };

  const addStat = () => {
    const updatedStats = [...(formData.stats || []), { number: '', label: '' }];
    const updated = { ...formData, stats: updatedStats };
    setFormData(updated);
    onChange(updated);
  };

  const removeStat = (index) => {
    const updatedStats = (formData.stats || []).filter((_, i) => i !== index);
    const updated = { ...formData, stats: updatedStats };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="editor-section">
      <h3>Hero Section Content</h3>
      
      <div className="editor-grid">
        <ImageUpload
          section="hero"
          field="hero_image"
          currentImage={formData.hero_image}
          onImageChange={handleImageChange}
          label="Hero Background Image"
          altText={formData.hero_image_alt || ''}
          onAltTextChange={handleAltTextChange}
          imageMapping={formData.image_mapping || {}}
        />

        <InputField
          label="Badge Text"
          value={formData.badge || ''}
          onChange={(val) => handleChange('badge', val)}
          placeholder="2026 Award Winner"
        />

        <TextAreaField
          label="Title"
          value={formData.title || ''}
          onChange={(val) => handleChange('title', val)}
          placeholder="Built with precision & integrity"
          rows={2}
        />

        <TextAreaField
          label="Description"
          value={formData.description || ''}
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
          
          {(formData.stats || []).map((stat, index) => (
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