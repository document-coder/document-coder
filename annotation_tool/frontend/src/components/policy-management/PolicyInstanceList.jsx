import React, { Component } from "react";
import PolicyInstanceCard from "src/components/policy-management/PolicyInstanceCard";
import Loading from "src/components/widgets/Loading";

const InstanceCreateDialog = ({ onCreateInstance, policyId }) => {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [scanDate, setScanDate] = React.useState("");
  const handleCreateInstance = async () => {
    try {
      await onCreateInstance(policyId, scanDate);
      setShowCreateDialog(false);
      setScanDate("");
    } catch (error) {
      throw error;
    }
  };

  if (showCreateDialog) {
    return (
      <div className="instance-create-dialog">
        <p>New Document Collection Info:</p>
        <div className="instance-create-form">
          <label htmlFor="scan-date">Collection Date:</label>
          <input
            id="scan-date"
            type="date"
            value={scanDate}
            onChange={(e) => setScanDate(e.target.value)}
            className="instance-date-input"
          />
        </div>
        <div className="instance-create-actions">
          <button
            onClick={handleCreateInstance}
            disabled={!scanDate}
          >
            Create
          </button>
          <button
            onClick={() => {
              setShowCreateDialog(false);
              setScanDate("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="instance-create-actions">
        <button
          className="instance-create-button"
          onClick={() => setShowCreateDialog(true)}
        >
          Add new Document Collection
        </button>
      </div>
    );
  }
}

const PolicyInstanceList = ({ instances, policyId, onUploadDocument, onCreateInstance }) => {
  if (instances._unloaded) {
    return <Loading />;
  }

  return (
    <div className="policy-instance-list">
      <div className="instance-grid">
        {instances.map(instance => (
          <PolicyInstanceCard
            key={instance.id}
            instance={instance}
            onUploadDocument={onUploadDocument}
          />
        ))}
      </div>
      <InstanceCreateDialog
        policyId={policyId}
        onCreateInstance={onCreateInstance}
      />
    </div>
  );
};

export default PolicyInstanceList;