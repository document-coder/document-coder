import React from "react";

const SelectAsignee = ({ assignment, annotators, onAssign }) => {
  const [selectedEmail, setSelectedEmail] = React.useState('');

  const handleChange = (e) => {
    const email = e.target.value;
    setSelectedEmail(email);
    onAssign(assignment, email || null);
  };

  return (
    <select
      value={selectedEmail}
      onChange={handleChange}>
      <option value="">Select annotator...</option>
      {annotators.map(role => (
        <option key={role.user_email} value={role.user_email}>
          {role.user_email}
        </option>
      ))}
    </select>
  );
};

export default SelectAsignee;