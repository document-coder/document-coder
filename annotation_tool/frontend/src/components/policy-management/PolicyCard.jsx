import React, { Component } from "react";
import PolicyInstanceList from "src/components/policy-management/PolicyInstanceList";

const PolicyCard = ({ policy, policy_instances, onCreateInstance, onUploadDocument }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="policy-card">
      <div className="policy-card-header card-header">
        <button
          className="policy-card-expand-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "−" : "+"}
        </button>
        <div className="policy-card-title">{policy.name}</div>
        <div className="item-count">
          {policy_instances.length} collections
        </div>
      </div>
      {expanded && (
        <div className="policy-card-content">
          <PolicyInstanceList
            policyId={policy.id}
            instances={policy_instances || []}
            onCreateInstance={onCreateInstance}
            onUploadDocument={onUploadDocument}
          />
        </div>
      )}
    </div>
  );
};

export default PolicyCard;