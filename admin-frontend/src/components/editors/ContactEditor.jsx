// src/admin/components/editors/ContactEditor.jsx
import React, { useState } from 'react';
import InputField from '../common/InputField';
import TextAreaField from '../common/TextAreaField';

const ContactEditor = ({ data, onChange }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="editor-section">
      <h3>Contact Section Content</h3>
      
      <div className="editor-grid">
        <InputField
          label="Title"
          value={formData.title}
          onChange={(val) => handleChange('title', val)}
          placeholder="Let's Build Together"
        />

        <TextAreaField
          label="Description"
          value={formData.description}
          onChange={(val) => handleChange('description', val)}
          placeholder="Have a project in mind?..."
          rows={3}
        />

        <InputField
          label="Phone Number"
          value={formData.phone}
          onChange={(val) => handleChange('phone', val)}
          placeholder="+1 (555) 123-4567"
        />

        <InputField
          label="Email Address"
          value={formData.email}
          onChange={(val) => handleChange('email', val)}
          placeholder="info@buildport.com"
          type="email"
        />

        <InputField
          label="Address"
          value={formData.address}
          onChange={(val) => handleChange('address', val)}
          placeholder="123 Construction Ave, Suite 200"
        />
      </div>
    </div>
  );
};

export default ContactEditor;