/**
 * @readonly
 * @enum {String}
 */
export const APIActionTypes = {
  GET_ASSIGNMENT_LIST: "API_GET_ASSIGNMENT_LIST",
  POST_ASSIGNMENT: "API_POST_ASSIGNMENT",
  GET_PROJECT_SETTINGS: "GET_PROJECT_SETTINGS",
  GET_PROJECT_LIST: "API_GET_PROJECT_LIST",
  GET_POLICY: "API_GET_POLICY",
  GET_POLICIES: "API_GET_POLICIES",
  GET_POLICY_INSTANCE: "API_GET_POLICY_INSTANCE",
  GET_POLICY_INSTANCES: "API_GET_POLICY_INSTANCES",
  GET_REPORT: "API_GET_REPORT",
  POST_POLICY: "API_POST_POLICY",
  POST_POLICY_INSTANCE: "API_POST_POLICY_INSTANCE",
  POST_POLICY_INSTANCE_DOCUMENT: "API_POST_POLICY_INSTANCE_DOCUMENT",
  POST_PROJECT_ROLE: "API_POST_PROJECT_ROLE",
  GET_POLICY_INSTANCE_META: "API_GET_POLICY_INSTANCE_META",
  GET_PROJECT_ROLES: "API_GET_PROJECT_ROLES",
  GET_CODING: "API_GET_CODING",
  GET_CODING_LIST: "API_GET_CODING_LIST",
  GET_CODING_PROGRESS: "API_GET_CODING_PROGRESS",
  POST_CODING_INSTANCE: "API_POST_CODING_INSTANCE",
  GET_CODING_INSTANCE: "API_GET_CODING_INSTANCE",
  AUTO_SAVE: "API_AUTO_SAVE",
  GET_ALL_CODING_INSTANCE: "API_GET_ALL_CODING_INSTANCE",
  ERROR: "ERROR",
  SERVER_CODING_INSTANCE: "SERVER_CODING_INSTANCE",
};

export const APIStatusActionTypes = {
  START: "API-STATUS_START",
  SUCCESS: "API-STATUS_SUCCESS",
  ERROR: "API-STATUS_ERROR",
};

/**
 * @readonly
 * @enum {String}
 */
export const UserActionsTypes = {
  UPDATE_CODING: "UPDATE_CODING",
  SELECT_QUESTION: "USER_SELECT_QUESTION",
  CHANGE_VALUE: "USER_CHANGE_VALUE",
  TOGGLE_SENTENCE: "USER_TOGGLE_SENTENCE",
  TOGGLE_PARAGRAPH: "USER_TOGGLE_PARAGRAPH",
  CLICK_SAVE: "USER_CLICK_SAVE",
  CLICK_RESET: "USER_CLICK_RESET",
  CHANGE_QUESTION_META: "USER_CHANGE_QUESTION_META",
};
/**
 * @readonly
 * @enum {String}
 */
export const AppActionTypes = {
  SET_CURRENT_VIEW: "APP_SET_CURRENT_VIEW",
  SET_CODING_MODE: "APP_SET_MODE",
};
/**
 * @readonly
 * @enum {String}
 */
export const NULL_OP = "NULL_OP";

// note: AI generated warnings. Some might be weird.
export const TYPE_ERROR_EXPLANATIONS = {
  defaults: {
    default: "An error occurred while trying to access or modify some data.",
    400: "Something broke on the code running in your browser when trying to access or modify some data.",
    403: "You attempted to modify or access some data that you aren't listed as having permission to access. Please contact the project owner.",
    404: "Some data you requested could not be found (or your internet connection is unstable).",
    500: "The server experienced an error while trying to access or modify some data.",
    501: "The server does not currently support something you tried to do.",
    503: "The server is down or overloaded and failed to process your request. Please try again.",
  },
  [APIActionTypes.GET_ASSIGNMENT_LIST]: {
    403: "You don't have permission to view assignments in this project. Please contact the project owner.",
    404: "No assignment list is associated with this project (or your internet connection is unstable).",
  },
  [APIActionTypes.POST_ASSIGNMENT]: {
    400: "Failed to modify or create assignemnt: something's wrong with the inputs provided",
    403: "You don't have permission to create or modify assignments in this project. Please contact the project owner.",
    404: "No assignment list is associated with this project (or your internet connection is unstable).",
    500: "The server experienced an error while trying to create or modify an assignment.",
  },
  [APIActionTypes.GET_PROJECT_SETTINGS]: {
    403: "You don't have permission to view this project. Please contact the project owner.",
    404: "This project does not exists on this server (or your internet connection is unstable).",

  },
  [APIActionTypes.GET_PROJECT_LIST]: {
    403: "You don't have permission to view projects on this server. Please contact the website administrator.",
    404: "No projects are available on this server (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_POLICY]: {
    403: "You don't have permission to view this document source. Please contact the project owner.",
    404: "This document source does not exist (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_POLICIES]: {
    403: "You don't have permission to view document sources in this project. Please contact the project owner.",
    404: "No document sources are associated with this project (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_POLICY_INSTANCE]: {
    403: "You don't have permission to view this document collection. Please contact the project owner.",
    404: "This document collection does not exist (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_POLICY_INSTANCES]: {
    403: "You don't have permission to view document collections in this project. Please contact the project owner.",
    404: "No document collections are associated with this project (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_REPORT]: {
    403: "You don't have permission to view this report. Please contact the project owner.",
    404: "This report does not exist (or your internet connection is unstable).",
  },
  [APIActionTypes.POST_POLICY]: {
    400: "Failed to modify or create document source: something's wrong with the inputs provided",
    403: "You don't have permission to create or modify document sources in this project. Please contact the project owner.",
    404: "This project does not exist (or your internet connection is unstable).",
    500: "The server experienced an error while trying to create or modify a document source.",
  },
  [APIActionTypes.POST_POLICY_INSTANCE]: {
    400: "Failed to modify or create document collection: something's wrong with the inputs provided",
    403: "You don't have permission to create or modify document collections in this project. Please contact the project owner.",
    404: "This project does not exist (or your internet connection is unstable).",
    500: "The server experienced an error while trying to create or modify a document collection.",
  },
  [APIActionTypes.POST_POLICY_INSTANCE_DOCUMENT]: {
    400: "Failed to modify or create document collection: something's wrong with the inputs provided",
    403: "You don't have permission to create or modify document collections in this project. Please contact the project owner.",
    404: "This project does not exist (or your internet connection is unstable).",
    500: "The server experienced an error while trying to create or modify a document collection.",
  },
  [APIActionTypes.POST_PROJECT_ROLE]: {
    400: "Failed to modify user permissions or add them to the project: something's wrong with the inputs provided",
    403: "You don't have permission to invite users or modify their permissions in this project. Please contact the project owner.",
    404: "This project does not exist (or your internet connection is unstable).",
    500: "The server experienced an error while trying to invite a user or modify their permissions.",
  },
  [APIActionTypes.GET_POLICY_INSTANCE_META]: {
    403: "You don't have permission to view this document collection. Please contact the project owner.",
    404: "This document collection does not exist (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_PROJECT_ROLES]: {
    403: "You don't have permission to view this project. Please contact the project owner.",
    404: "No users are associated with this project (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_CODING]: {
    403: "You don't have permission to view this annotation scheme. Please contact the project owner.",
    404: "This annotation scheme does not exist (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_CODING_LIST]: {
    403: "You don't have permission to view annotation schemes in this project. Please contact the project owner.",
    404: "No annotation schemes are associated with this project (or your internet connection is unstable).",
  },
  [APIActionTypes.GET_CODING_PROGRESS]: {
    403: "You don't have permission to view the progress tracker for this project. Please contact the project owner.",
    404: "This project does not have a project tracker associated with it (or your internet connection is unstable).",
  },
  [APIActionTypes.POST_CODING_INSTANCE]: {
    400: "Failed to modify or create annotations for this document collection: something's wrong with the inputs provided",
    403: "You don't have permission to create or modify annotations for this document collection. Please contact the project owner.",
    404: "You do not have any annotations associated with this document collection, and they weren't created properly. Please reload this page.",
    500: "The server experienced an error while trying to save your annotations",
  },
  [APIActionTypes.GET_CODING_INSTANCE]: {
    403: "You requested access to annotations you don't have permission to view. Please contact the project owner.",
    404: "No annotations found",
  },
  [APIActionTypes.AUTO_SAVE]: {
    400: "Failed to auto-save your annotations: something's went wrong",
    403: "You are not listed as having permission to save annotations in this project. Please contact the project owner.",
    404: "Failed to autosave: you do not have any annotations associated with this document collection.",
    500: "The server experienced an error while trying to save your annotations",
  },
  [APIActionTypes.GET_ALL_CODING_INSTANCE]: {
    403: "You don't have permission to view annotations for this document collection. Please contact the project owner.",
    404: "No annotations found",
  },
}