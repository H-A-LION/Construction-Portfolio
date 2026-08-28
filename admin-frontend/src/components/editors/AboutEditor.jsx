// src/admin/components/editors/AboutEditor.jsx
import React, { useState,useEffect } from 'react';
import InputField from '../common/InputField';
import TextAreaField from '../common/TextAreaField';
import { FaTrash, FaPlus } from "react-icons/fa";

const AboutEditor = ({ data, onChange }) => {
    // Initialize with default values to prevent undefined errors
  const defaultData = {
    tag: '',
    title: '',
    description: '',
    features: []
  };

  const [formData, setFormData] = useState({...defaultData, ...data});

    // Update formData when data prop changes
  useEffect(() => {
    if (data) {
      setFormData(prev => ({
        ...defaultData,
        ...data,
        features: data.features || []
      }));
    }
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    const updated = { ...formData, features: updatedFeatures };
    setFormData(updated);
    onChange(updated);
  };

  const addFeature = () => {
    const updatedFeatures = [...formData.features, { title: '', description: '' }];
    const updated = { ...formData, features: updatedFeatures };
    setFormData(updated);
    onChange(updated);
  };

  const removeFeature = (index) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = currentFeatures.filter((_, i) => i !== index);
    const updated = { ...formData, features: updatedFeatures };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="editor-section">
      <h3>About Section Content</h3>
      
      <div className="editor-grid">
        <InputField
          label="Tag Text"
          value={formData.tag}
          onChange={(val) => handleChange('tag', val)}
          placeholder="About Us"
        />

        <InputField
          label="Title"
          value={formData.title}
          onChange={(val) => handleChange('title', val)}
          placeholder="Building Excellence Since 2010"
        />

        <TextAreaField
          label="Description"
          value={formData.description}
          onChange={(val) => handleChange('description', val)}
          placeholder="BuildPort is a full-service construction company..."
          rows={4}
        />

        <div className="features-editor">
          <div className="features-header">
            <label>Features</label>
            <button type="button" onClick={addFeature} className="add-btn">
              <FaPlus /> Add Feature
            </button>
          </div>
          
          {formData.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-fields">
                <InputField
                  label="Feature Title"
                  value={feature.title}
                  onChange={(val) => handleFeatureChange(index, 'title', val)}
                  placeholder="Quality Assurance"
                />
                <InputField
                  label="Feature Description"
                  value={feature.description}
                  onChange={(val) => handleFeatureChange(index, 'description', val)}
                  placeholder="Rigorous quality control at every stage"
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeFeature(index)}
                className="remove-btn"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;