// @ts-ignore
export const CURRENT_USER = window.CURRENT_USER;
export const CONFIDENCE_LEVELS = ["very low", "low", "medium", "high", "very high"];
export const PROJECT_NAME = window.location.pathname.split("/")[2];
export const ROLES = [
  "can_annotate",
  "can_view_schema",
  "can_view_assignments",
  "can_view_content",
  "can_assign_tasks",
  "can_manage_content",
  "can_modify_schema",
  "can_export_data",
  "can_review",
  "is_owner",
];
export const DEFAULT_ROLES = {
  can_annotate: true,
  can_view_schema: true,
  can_view_assignments: true,
  can_view_content: true,
  can_assign_tasks: false,
  can_manage_content: false,
  can_modify_schema: false,
  can_export_data: false,
  can_review: false,
  is_owner: false,
}