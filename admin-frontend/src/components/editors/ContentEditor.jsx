// admin-frontend/src/components/ContentEditor.jsx
import React from 'react';
import HeroEditor from './editors/HeroEditor';
import AboutEditor from './editors/AboutEditor';
import ContactEditor from './editors/ContactEditor';
import ServiceEditor from './editors/ServiceEditor';
import TeamEditor from './editors/TeamEditor';
import ProjectEditor from './editors/ProjectEditor';

const ContentEditor = ({ section, content, onContentChange }) => {
  const renderEditor = () => {
    switch(section) {
      case 'hero':
        return <HeroEditor data={content} onChange={onContentChange} />;
      case 'about':
        return <AboutEditor data={content} onChange={onContentChange} />;
      case 'services':
        return <ServiceEditor data={content} onChange={onContentChange} />;
      case 'team':
        return <TeamEditor data={content} onChange={onContentChange} />;
      case 'projects':
        return <ProjectEditor data={content} onChange={onContentChange} />;
      case 'contact':
        return <ContactEditor data={content} onChange={onContentChange} />;
      default:
        return (
          <div className="editor-placeholder">
            <i className="fas fa-construction"></i>
            <p>Editor for {section} section coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="content-editor">
      {renderEditor()}
    </div>
  );
};

export default ContentEditor;