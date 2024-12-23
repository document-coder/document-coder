import _ from "lodash";
import axios from "axios";
import { APIActionTypes, APIStatusActionTypes } from "src/actions/types";
import store from "src/store";
import { CURRENT_USER, PROJECT_NAME } from "src/constants";
import Logger from "src/Logger";
const log = Logger("api", "cyan");

async function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
async function get_CSRF_token() {
  return await getCookie("csrftoken");
}

const API_PREFIX = `/api/${PROJECT_NAME}`
const _AUTO_SAVE_INTERVAL_MINUTES = 5;
const api = {};

/////////////////////////
//    REST Wrappers    //
/////////////////////////

var _last_api_call_id = 0;

async function _wrapAPI(rest_fn, request_type, dispatch, actionType, payload_fn, ...args) {
  log(`sent ${request_type} request to ${args[0]}`);
  const apiCallId = ++_last_api_call_id;
  dispatch({ type: APIStatusActionTypes.START, payload: { actionType, loading: true }, call_id: apiCallId });

  try {
    const res = await rest_fn(...args);
    let result = payload_fn(res);
    dispatch({
      type: actionType,
      payload: result,
    });
    dispatch({ type: APIStatusActionTypes.SUCCESS, payload: { actionType }, call_id: apiCallId });
    return res;
  } catch (e) {
    const errorPayload = {
      actionType,
      error: {
        status: e.response?.status,
        message: e.response?.data?.detail || e.message,
        response: e.response,
        timestamp: new Date().toISOString()
      }
    };
    dispatch({ type: APIStatusActionTypes.ERROR, payload: errorPayload, call_id: apiCallId });
    // console.error(e);
    console.error(`error while performing ${actionType}: ${e.message}`);
    if (e.name !== "AxiosError") {
      throw e;
    }
  }
}

async function doAPIGet({ path, dispatch, actionType, params = {}, payload_fn = (res) => res.data, use_project_prefix = true }) {
  return await _wrapAPI(
    axios.get,
    "GET",
    dispatch,
    actionType,
    payload_fn,
    use_project_prefix ? `${API_PREFIX}/${path}` : path,
    { headers: { "X-CSRFToken": await get_CSRF_token() } },
  );
}

async function doAPIPost({ path, data, dispatch, actionType, payload_fn = (res) => res.data }) {
  return await _wrapAPI(
    axios.post,
    "POST",
    dispatch,
    actionType,
    payload_fn,
    `${API_PREFIX}/${path}`,
    data,
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
}

async function doAPIPatch({ path, data, dispatch, actionType, payload_fn = (res) => res.data }) {
  return await _wrapAPI(
    axios.patch,
    "PATCH",
    dispatch,
    actionType,
    payload_fn,
    `${API_PREFIX}/${path}`,
    data,
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
}

function throwError(dispatch, error) {
  dispatch({
    type: APIActionTypes.ERROR,
    payload: error.response,
  });
}

////////////////////////
//      Projects      //
////////////////////////

api.apiGetProjectList = () => async (dispatch) => {
  log(`called getProjectList`);
  await doAPIGet({
    path: `/core-api/project/`,
    dispatch,
    actionType: APIActionTypes.GET_PROJECT_LIST,
    payload_fn: (res) => res.data.results,
    use_project_prefix: false
  });
}

api.apiGetProjectSettings = (project_prefix) => async (dispatch) => {
  log(`called apiGetProjectSettings`);
  const me = await axios.get(`/me`);
  await doAPIGet({
    path: `project/${project_prefix}/`,
    dispatch,
    actionType: APIActionTypes.GET_PROJECT_SETTINGS,
    payload_fn: (res) => ({ ...res.data, me: me.data })
  });
};

api.apiUpdateProjectSettings = (project_prefix, settings) => async (dispatch) => {
  log(`called apiUpdateProjectSettings`);
  await doAPIPatch({
    path: `project/${project_prefix}/`,
    data: { settings },
    dispatch,
    actionType: APIActionTypes.GET_PROJECT_SETTINGS,
  });
};

api.apiGetCodingProgress = () => async (dispatch) => {
  log(`called apiGetCodingProgress`);
  await doAPIGet({
    path: `coding_progress/`,
    dispatch,
    actionType: APIActionTypes.GET_CODING_PROGRESS,
  });
};


///////////////////////
//    Permissions    //
///////////////////////

api.apiGetProjectRoles = () => async (dispatch) => {
  log(`called apiGetProjectRoles`);
  await doAPIGet({
    path: `project_role/`,
    dispatch,
    actionType: APIActionTypes.GET_PROJECT_ROLES,
    payload_fn: (res) => res.data.results
  });
};

api.apiPostProjectRole = (role_data) => async (dispatch) => {
  log(`called apiPostProjectRole`);
  await doAPIPost({
    path: `project_role/`,
    data: { ...role_data },
    dispatch,
    actionType: APIActionTypes.POST_PROJECT_ROLE,
  });
};

///////////////////////
//    Assignments    //
///////////////////////

api.apiGetAssignments = () => async (dispatch) => {
  log(`called apiGetAssignments`);
  await doAPIGet({
    path: `assignment/`,
    dispatch,
    actionType: APIActionTypes.GET_ASSIGNMENT_LIST,
    payload_fn: (res) => (res.data.results || [])
  });
};


api.apiPostAssignment = (assignment_data) => async (dispatch) => {
  log(`called apiPostAssignment`);
  await doAPIPost({
    path: `assignment/`,
    data: { ...assignment_data },
    dispatch,
    actionType: APIActionTypes.POST_ASSIGNMENT,
  });
};

//////////////////////
//     Policies     //
//////////////////////

api.apiGetPolicies = () => async (dispatch) => {
  log(`called apiGetPolicies`);
  await doAPIGet({
    path: `policy/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICIES,
    payload_fn: (res) => res.data.results
  });
};

api.apiGetPolicyAssociatedData = (policy_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const res = await doAPIGet({
    path: `policy_instance/?policy_id=${policy_id}`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY_INSTANCES,
    payload_fn: (res) => res.data.results
  })
  const policy_instance_list = res.data.results;
  await doAPIGet({
    path: `policy/${policy_id}/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY,
    payload_fn: (res) => res.data
  });
  for (
    let _i = 0, policy_instance = policy_instance_list[_i++];
    _i < policy_instance_list.length;
    policy_instance = policy_instance_list[_i++]
  ) {
    await doAPIGet({
      path: `coding_instance/?policy_instance_id=${policy_instance.id}`,
      dispatch,
      actionType: APIActionTypes.GET_ALL_CODING_INSTANCE,
      payload_fn: (res) => res.data.results
    });
  }
};

api.apiPostPolicy = ({ name }) => async (dispatch) => {
  log(`called createNewPolicyInstance`);
  const res = await doAPIPost({
    path: `policy/`,
    data: { name },
    dispatch,
    actionType: APIActionTypes.POST_POLICY,
  });
  await doAPIGet({
    path: `policy/${res.data.id}/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY,
  });
};


////////////////////////////
//    Policy Instances    //
////////////////////////////

api.apiGetPolicyInstance = (policy_instance_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const res = await doAPIGet({
    path: `policy_instance/${policy_instance_id}/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY_INSTANCE,
  });
  const policy_instance = res.data;
  await doAPIGet({
    path: `policy/${policy_instance.policy_id}/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY,
  });
};

api.apiGetPolicyInstancesMeta = (policy_instance_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  await doAPIGet({
    path: `policy_instance_meta/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY_INSTANCES,
    payload_fn: (res) => res.data.results
  });
};

api.apiPostPolicyInstance = ({ policy_id, id, scan_dt, content }) => async (dispatch) => {
  log(`called createNewPolicyInstance`);
  const res = await doAPIPost({
    path: `policy_instance/`,
    data: { policy_id, id, scan_dt, content },
    dispatch,
    actionType: APIActionTypes.POST_POLICY_INSTANCE,
  });
  const new_policy_instance = res.data;
  await doAPIGet({
    path: `policy_instance/${new_policy_instance.id}/`,
    dispatch,
    actionType: APIActionTypes.GET_POLICY_INSTANCE,
  });
};

////////////////////////
//      Coding        //
////////////////////////

api.apiGetCodingList = () => async (dispatch) => {
  log(`called apiGetCodingList`);
  await doAPIGet({
    path: `coding/`,
    dispatch,
    actionType: APIActionTypes.GET_CODING_LIST,
    payload_fn: (res) => res.data.results
  });
};

api.apiGetCoding = (coding_id) => async (dispatch) => {
  log(`called apiGetCoding`);
  await doAPIGet({
    path: `coding/${coding_id}/`,
    dispatch,
    actionType: APIActionTypes.GET_CODING,
  });
};

api.apiSaveCoding = (coding, go_to_editor = false) => async (dispatch) => {
  log(`called apiSaveCoding`);
  const res = await doAPIPost({
    path: `coding/`,
    data: { ...coding, id: '' },
    dispatch: go_to_editor ? (() => { }) : dispatch,
    actionType: APIActionTypes.GET_CODING,
  });
  const new_coding = res.data;
  if (go_to_editor) {
    window.location.href = `/c/${PROJECT_NAME}/coding/${new_coding.id}`;
  }
};

api.apiUpdateCoding = (coding_id, coding) => async (dispatch) => {
  log(`called apiUpdateCoding`);
  await doAPIPatch({
    path: `coding/${coding_id}/`,
    data: coding,
    dispatch,
    actionType: APIActionTypes.GET_CODING,
  });
};

////////////////////////
//  Coding Instance  //
////////////////////////

api.apiGetCodingInstance = (policy_instance_id, coding_id) => async (dispatch) => {
  log(`called apiGetCodingInstance`);
  const coder_email = CURRENT_USER;
  const res = await doAPIGet({
    path: `coding_instance/`,
    params: { policy_instance_id, coding_id, coder_email },
    dispatch,
    actionType: APIActionTypes.GET_CODING_INSTANCE,
    payload_fn: (res) => (res.data.results ?? [{}]),
  });
  const query_results = res.data.results;
  if (query_results?.length > 0) {
    dispatch({
      type: APIActionTypes.SERVER_CODING_INSTANCE,
      payload: query_results[0],
    });
  }
};

api.apiGetAllCodingInstances = (policy_instance_id, coding_id) => async (dispatch) => {
  log(`called apiGetAllCodingInstances`);
  await doAPIGet({
    path: `coding_instance/`,
    params: { policy_instance_id, coding_id },
    dispatch,
    actionType: APIActionTypes.GET_ALL_CODING_INSTANCE,
    payload_fn: (res) => (res.data.results ?? [{}]),
  });
};

api.apiPostCodingInstance = () => async (dispatch) => {
  log(`called apiPostCodingInstance`);
  _save_fn(store, dispatch, APIActionTypes.POST_CODING_INSTANCE);
};

////////////////////////
//  Auto Save Logic   //
////////////////////////
/**
 * # How this works:
 * 
 * We detect if the user is currently annotating documents by checking to see if  `localStore` reducer is active and has a `codingId` set.
 *
 * If it is, then we attempt to save current state of the coding instance to the server under two conditions:
 *   1. Every 5 minutes.
 *   2. When the user presses `ctrl+s` or `cmd+s`.
 */
var _LAST_AUTO_SAVE = 0;
const _JUMP = 10000;

const _save_fn = async function (store, dispatch, actionName = APIActionTypes.AUTO_SAVE) {
  console.debug("auto save");
  const state = store.getState();
  const policy_instance_id = state.localState.policyInstanceId;
  if (policy_instance_id === null) {
    console.info("auto save is not active: no policy instance selected");
    return;
  }
  const policy_id = state.model.policy_instances[policy_instance_id].policy_id;
  const coding_id = state.localState.codingId;
  const coding_values = state.localState.localCodingInstance;
  const coder_email = CURRENT_USER;
  const request_params = {
    policy_instance_id,
    policy_id,
    coding_id,
    coder_email,
    coding_values,
  };
  await doAPIPost({
    path: `coding_instance/`,
    data: request_params,
    dispatch,
    actionType: actionName,
  });
};

// if there is a lot of resource contention, the setInterval can put a ton of _save_fn calls on the stack.
// this will short-circuit those extra calls.
const _limited_save_fn = _.debounce(_save_fn, 5000, { leading: true, trailing: true });

const _apiAutoSave = (override = false) =>
  async (dispatch) => {
    const cur_time = new Date().getTime();
    if (!store.getState().localState.codingId) return;
    _limited_save_fn(store, dispatch, APIActionTypes.AUTO_SAVE);
  };

// save every 5 minutes
setInterval(
  function () {
    _save_fn(store, store.dispatch);
  }.bind(this),
  1000 * 60 * _AUTO_SAVE_INTERVAL_MINUTES /*five minutes*/
);

// listen for ctrl+s or cmd+s and save
const _manual_auto_save = async function (e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
    e.preventDefault();
    console.log("SAVE");
    _limited_save_fn(store, store.dispatch);
  }
};
document.addEventListener("keydown", _manual_auto_save, false);

api.apiAutoSave = _apiAutoSave;

export default api;
