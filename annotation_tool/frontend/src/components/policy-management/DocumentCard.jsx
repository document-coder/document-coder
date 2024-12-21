import React, { Component } from "react";
import DocumentPreview from "src/components/policy-management/DocumentPreview";

const DocumentCard = ({ document, document_index, onModifyDocument }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="document-card">
      <div className="document-card-header">
        <button
          className="policy-card-expand-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "−" : "+"}
        </button>
        <div className="document-card-title">
          <span className="document-ordinal">{document.ordinal}. </span>
          {document.title}
        </div>
        <div className="item-count">{document.content?.length} paragraphs</div>
      </div>
      {expanded && (
        <div className="document-card-content preview-section">
          <DocumentPreview
            content={document.content}
            document_index={document_index}
            onModifyDocument={onModifyDocument}
            allowEdits={false}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentCard;