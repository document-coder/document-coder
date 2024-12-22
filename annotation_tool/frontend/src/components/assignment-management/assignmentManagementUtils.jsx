import React from "react";
import SelectAsignee from "src/components/assignment-management/SelectAsignee";

export const get_assignment_column_list = ({ annotators, setAssigneeCallback, statusChangeCallback }) => {
  const generateAssigneeSelect = (
    (assignment) => {
      if (assignment.status === "UNASSIGNED") {
        return (
          <SelectAsignee
            assignment={assignment}
            annotators={annotators}
            onAssign={(assignment, email) => setAssigneeCallback(assignment, email)}
          />
        );
      } else {
        return <div className="assignee-cell">
          <span> {assignment.coder_email}</span>
          <button
            onClick={() => setAssigneeCallback(assignment, null)}
            className="unassign-button">
            Unassign
          </button>
        </div>
      }
    }
  ).bind(this);
  return [
    {
      name: "Document Collection",
      display_fn: (assignment) => assignment.label,
      sort_fn: (assignment) => assignment.label
    },
    {
      name: "Status",
      display_fn: (assignment) => assignment.status,
      sort_fn: (assignment) => assignment.status
    },
    {
      name: "Assigned To",
      display_fn: generateAssigneeSelect,
      sort_fn: (assignment) => assignment.coder_email || "zzz"
    },
    {
      name: "Link",
      display_fn: (assignment) => {
        return <>
          {(assignment.coder_email === CURRENT_USER) &&
            <a href={assignment.url} target="_blank" rel="noreferrer">
              Go to annotation screen
            </a>}
        </>
      }
    }, {
      name: "Actions",
      display_fn: (assignment) => (
        <div className="assignment-actions">
          {assignment.coder_email === CURRENT_USER && <>
            <div><button onClick={() => statusChangeCallback(assignment, "COMPLETE")}> Complete </button></div>
            <div><button onClick={() => statusChangeCallback(assignment, "IN_PROGRESS")}> In Progress </button></div>
          </>}
        </div>
      )
    }, {
      name: "Created",
      display_fn: (assignment) => new Date(assignment.created_dt).toLocaleString(),
      sort_fn: (assignment) => assignment.created_dt
    }
  ];
}
