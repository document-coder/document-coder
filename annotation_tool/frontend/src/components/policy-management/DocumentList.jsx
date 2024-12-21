import React, { Component } from "react";
import DocumentCard from "src/components/policy-management/DocumentCard";
import DocumentUploader from "src/components/policy-management/DocumentUploader";

const DocumentList = ({ documents, policyInstanceId, onUploadDocument, onModifyDocument }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="document-list">
      <div className="document-grid">
        {documents.map((doc, idx) => (
          <DocumentCard
            key={idx}
            document_index={idx}
            document={doc}
            onModifyDocument={onModifyDocument}
          />
        ))}
      </div>
      {!expanded ? (
        <div className="document-list-actions">
          <button
            className="document-list-expand-button"
            onClick={() => setExpanded(true)}
          >
            Upload New Document
          </button>
        </div>
      ) : (
        <DocumentUploader
          policyInstanceId={policyInstanceId}
          onUploadDocument={onUploadDocument}
          onCancel={() => setExpanded(false)}
        />
      )}
    </div>
  );
};

export default DocumentList;