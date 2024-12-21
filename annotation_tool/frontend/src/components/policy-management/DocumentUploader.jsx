import React, { Component } from "react";
import { marked } from 'marked';
import _ from "lodash";
import { parseMarkdownToDocument, collectFootnotes } from "src/components/utils/markdownParser";
import DocumentPreview from "src/components/policy-management/DocumentPreview";


const DocumentUploader = ({ policyInstanceId, onUploadDocument, onCancel }) => {
  const [title, setTitle] = React.useState("");
  const [markdown, setMarkdown] = React.useState("");
  const [parsedContent, setParsedContent] = React.useState(null);
  const [previewMode, setPreviewMode] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [footnoteManager, setFootnoteManager] = React.useState(collectFootnotes());


  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setMarkdown(content);
        try {
          const parsed = parseMarkdownToDocument(content, footnoteManager);
          setParsedContent(parsed);
          validateContent(parsed);
          setPreviewMode(true);
          if (!title.trim()) setTitle(file.name.replace(/\.md$/, ''));
        } catch (error) {
          setErrors([`Error parsing markdown: ${error.message}`]);
        }
      };
      reader.readAsText(file);
    }
  };

  const validateContent = (content) => {
    const newErrors = [];
    content.forEach((paragraph, idx) => {
      if (!paragraph.type) {
        newErrors.push(`Paragraph ${idx + 1}: Missing type`);
      }
      if (!['text', 'section', 'list_item', 'link'].includes(paragraph.type)) {
        newErrors.push(`Paragraph ${idx + 1}: Invalid type ${paragraph.type}`);
      }
      if (!Array.isArray(paragraph.content)) {
        newErrors.push(`Paragraph ${idx + 1}: Content must be an array`);
      }
      if (paragraph.content.length === 0) {
        newErrors.push(`Paragraph ${idx + 1}: No sentences found`);
      }
      if (paragraph.type === 'section' && typeof paragraph.level !== 'number') {
        newErrors.push(`Paragraph ${idx + 1}: Section missing level`);
      }
      if (paragraph.type === 'list_lis item' && typeof paragraph.depth !== 'number') {
        newErrors.push(`Paragraph ${idx + 1}: List item missing depth`);
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleUpdateParagraph = (index, new_edit_text) => {
    const updatedParagraphs = parseMarkdownToDocument(new_edit_text, footnoteManager);
    setParsedContent(content => {
      const newContent = [...content];
      newContent.splice(index, 1); // delete old paragraph
      newContent.splice(index, 0, ...updatedParagraphs);
      const updatedFootnotes = footnoteManager.getAll().map(note => ({
        type: 'link',
        content: [note]
      }));
      return [...newContent.filter(p => p.type !== 'link'), ...updatedFootnotes];
    });
  };

  const handleUpload = async () => {
    if (!title.trim() || !parsedContent) {
      alert("Please provide both title and content");
      return;
    }

    if (!validateContent(parsedContent)) {
      alert("Please fix validation errors before uploading");
      return;
    }

    try {
      await onUploadDocument(policyInstanceId, title, parsedContent);
      setTitle("");
      setMarkdown("");
      setParsedContent(null);
      setPreviewMode(false);
      setErrors([]);
    } catch (error) {
      alert("Error uploading document");
      throw error;
    }
  };
  const error_list = [...errors];
  if (!title.trim()) {
    error_list.unshift("No document title provided");
  }
  return (
    <div className="document-uploader">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document title"
        className="document-title-input"
      />
      {!previewMode ? (
        <div className="upload-section">
          <input
            type="file"
            accept=".md"
            onChange={handleFileSelect}
            className="document-file-input"
          />
          <p className="upload-help">Upload a markdown file to begin</p>
        </div>
      ) : (
        <div className="preview-section">
          <div className="preview-errors">
            {error_list.length > 0 && (
              <div className="error-list">
                <h4>Please fix the following issues:</h4>
                <ul>
                  {error_list.map((error, idx) => (
                    <li key={idx} className="error-item">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="preview-content">
            <DocumentPreview
              content={parsedContent}
              onUpdateParagraph={handleUpdateParagraph}
            />
          </div>

          <div className="preview-actions">

            <button
              onClick={handleUpload}
              disabled={error_list.length > 0}
              className="document-upload-button"
            >
              {error_list.length > 0 ? (
                `${error_list.length} errors found. Please fix before uploading.`
              ) : (
                `Upload`
              )}
            </button>
            <button
              onClick={onCancel}
              className="preview-cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;