import React from "react";
import SortableTable from "src/components/widgets/SortableTable";

const _COLUMNS = [
  {
    name: "assignment",
    display_fn: (assignment) => <a href={assignment.url}>{assignment.label}</a>,
    sort_fn: (assignment) => assignment.label,
  },
  {
    name: "created",
    display_fn: (assignment) => new Date(assignment.created_dt).toDateString(),
    sort_fn: (assignment) => assignment.created_dt,
  },
  {
    name: "due date",
    display_fn: (assignment) => new Date(assignment.due_dt).toDateString(),
    sort_fn: (assignment) => assignment.due_dt,
  },
  {
    name: "progress",
    display_fn: (assignment) => `${Math.round((100 * assignment.notes?.progress) / 65)}%`,
    sort_fn: (assignment) => assignment.notes?.progress,
  },
  {
    name: "status",
    display_fn: (assignment) => assignment.status,
    sort_fn: (assignment) => assignment.status,
  },
];

/**
 * @param {object} params
 * @param {Assignment[]} params.assignments
 * @returns
 */
export default function SortableAssignmentTable({ assignments = [] }) {
  return <SortableTable id="assignment-list-table" items={assignments} columns={_COLUMNS} />;
}
