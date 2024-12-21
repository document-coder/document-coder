import React, { Component } from "react";
import PolicyCard from "src/components/policy-management/PolicyCard";
import _ from "lodash";

const PolicyList = ({ policies, policy_instances = [], onUploadDocument, onCreatePolicy, onCreateInstance }) => {
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newPolicyName, setNewPolicyName] = React.useState("");

  const handleCreatePolicy = async () => {
    if (newPolicyName.trim()) {
      try {
        await onCreatePolicy({ name: newPolicyName });
        setNewPolicyName("");
        setShowCreateForm(false);
      } catch (error) {
        // alert("Failed to create policy. Please try again.");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCreatePolicy();
    }
  };


  const sortedPolicies = Object.values(policies)
    .filter(p => !p._unloaded)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (policy_instances._unloaded) {
    policy_instances = [];
  }

  const policy_instances_by_policy = (
    policy_instances._unloaded ?
      {} :
      _.groupBy(policy_instances, 'policy_id')
  );

  return (
    <div className="policy-list card-list">
      <div className="policy-add-button">
        <button
          className="policy-create-button"
          onClick={() => setShowCreateForm(true)}
        >
          Add a new Document Source
        </button>
      </div>

      {showCreateForm && (
        <div className="policy-create-form">
          <input
            type="text"
            value={newPolicyName}
            onChange={(e) => setNewPolicyName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter policy name"
            className="policy-name-input"
            autoFocus
          />
          <div className="policy-create-actions">
            <button
              className="policy-create-submit"
              onClick={handleCreatePolicy}
            >
              Create
            </button>
            <button
              className="policy-create-cancel"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {sortedPolicies.map(policy => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          policy_instances={policy_instances_by_policy[policy.id] || []}
          onCreateInstance={onCreateInstance}
          onUploadDocument={onUploadDocument}
        />
      ))}
    </div>
  )
};

export default PolicyList;