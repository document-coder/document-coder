import { APIActionTypes } from "src/actions/types";
import { overwrite_stored_object_copies } from "./utils";

const defaultState = {
  projects: { "_unloaded": true }, // id: <projectinfo>
  policies: { "_unloaded": true }, // id: <policyinfo>
  policy_instances: { "_unloaded": true }, // id: <policyinstance>
  codings: { "_unloaded": true }, // id: <coding>
  coding_instances: { "_unloaded": true }, // id: <codinginstance>
  assignments: { "_unloaded": true }, // id: <coding>
  project: { "_unloaded": true }, // key: value
  report: { "_unloaded": true }, // [project: <project_id>, answers: {<question_id>: {<coder_email>: <Answer>}}, ...]
};

/**
 * Takes a list of objects with ids and makes them into an object keyed on id.
 * @param {object[]} objectList
 * @param {Number} objectList[].id
 * @returns
 */
function _wrapObjectList(objectList) {
  const to_ret = {};
  for (var c of objectList) {
    to_ret[c.id] = c;
  }
  return to_ret;
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case APIActionTypes.ERROR:
      alert(`ERROR loading ${action.payload.config.url}\n${action.payload.data.detail}`);
      return { ...state };
    case APIActionTypes.GET_PROJECT_SETTINGS:
      return { ...state, ...{ project: action.payload } };
    case APIActionTypes.GET_POLICY:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "policies"
      );
    case APIActionTypes.GET_PROJECT_LIST:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "projects");
    case APIActionTypes.GET_POLICIES:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "policies");
    case APIActionTypes.GET_POLICY_INSTANCE:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "policy_instances"
      );
    case APIActionTypes.GET_POLICY_INSTANCES:
      return overwrite_stored_object_copies(
        state,
        _wrapObjectList(action.payload),
        "policy_instances"
      );
    case APIActionTypes.GET_CODING_LIST:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "codings");
    case APIActionTypes.GET_CODING:
      return overwrite_stored_object_copies(
        state,
        { [action.payload.id]: action.payload },
        "codings"
      );
    case APIActionTypes.AUTO_SAVE:
      action.payload = [action.payload];
    case APIActionTypes.GET_CODING_INSTANCE:
    case APIActionTypes.GET_ALL_CODING_INSTANCE:
      return overwrite_stored_object_copies(
        state,
        _wrapObjectList(action.payload),
        "coding_instances"
      );
    case APIActionTypes.GET_ASSIGNMENT_LIST:
      return overwrite_stored_object_copies(state, _wrapObjectList(action.payload), "assignments");
    case APIActionTypes.POST_CODING_INSTANCE:
      return {
        ...state,
        ...{},
      };
    case APIActionTypes.GET_REPORT:
      return { ...state, ...{ report: action.payload } };
    case APIActionTypes.POST_POLICY_INSTANCE_DOCUMENT:
      return state;
    case APIActionTypes.POST_POLICY_INSTANCE:
      return state;
    default:
      return state;
  }
};
