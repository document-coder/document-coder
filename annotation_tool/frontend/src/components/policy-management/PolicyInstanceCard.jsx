import React, { Component } from "react";
import DocumentList from "src/components/policy-management/DocumentList";

const PolicyInstanceCard = ({ instance, onUploadDocument }) => {
  const [expanded, setExpanded] = React.useState(false);
  const documents = instance.content || [];

  return (
    <div className="instance-card">
      <div className="instance-card-header card-header">
        <button
          className="instance-card-expand-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "−" : "+"}
        </button>
        <div className='instance-card-title'>
          {new Date(instance.scan_dt).toISOString().slice(0, 10)}
        </div>
        <div className='item-count'>
          {documents.length} documents
        </div>
      </div>
      {
        expanded && (
          <div className="instance-card-content">
            <DocumentList
              documents={documents}
              policyInstanceId={instance.id}
              onUploadDocument={onUploadDocument}
            />
          </div>
        )
      }
    </div >
  );
};

export default PolicyInstanceCard;