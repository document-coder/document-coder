import _ from "lodash";
import React from "react";
import Loading from "src/components/widgets/Loading";


const getPolicyInstanceLabel = (policyInstance, policies) => {
  const policy = policies[policyInstance.policy_id];
  return `${policy.name} - ${policyInstance.scan_dt}`;
};

const AssignmentCreationDialog = ({
  onSubmit,
  onCancel,
  policyInstances,
  policies,
  projectPrefix,
  defaultCoding
}) => {
  const [policyInstanceId, setPolicyInstanceId] = React.useState('');
  const [label, setLabel] = React.useState('');

  if (policyInstances._unloaded) {
    return <Loading />;
  }

  const handleSubmit = () => {
    const url = `/c/${projectPrefix}/code-policy/${policyInstanceId}-${label}/${defaultCoding}`;

    onSubmit({
      url,
      label,
      status: "UNASSIGNED"
    });
  };

  return (
    <div className="create-assignment-form">
      <select
        value={policyInstanceId}
        onChange={(e) => {
          setPolicyInstanceId(e.target.value);
          setLabel(getPolicyInstanceLabel(policyInstances[e.target.value], policies).slice(0, 30));
        }}>
        <option value="">Select document collection...</option>
        {_.map(
          _.sortBy(policyInstances, (pi) => -pi.id), pi => (
            <option key={pi.id} value={pi.id}>{
              getPolicyInstanceLabel(pi, policies)
            }</option>
          ))}
      </select>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Document Collection Name..."
      />

      <button
        onClick={handleSubmit}
        disabled={!policyInstanceId || !label}>
        Create Assignment
      </button>

      <button onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default AssignmentCreationDialog;