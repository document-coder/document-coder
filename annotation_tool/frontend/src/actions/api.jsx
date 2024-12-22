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
var _last_api_call_id = 0;

async function doAPIGet(path, dispatch, actionType, res_fn = (res) => res.data) {
  const apiCallId = ++_last_api_call_id;
  dispatch({ type: APIStatusActionTypes.START, payload: { actionType, loading: true }, call_id: apiCallId });

  try {
    const res = await axios.get(`${API_PREFIX}/${path}`);
    let result = res_fn(res);
    dispatch({
      type: actionType,
      payload: result,
    });
    dispatch({ type: APIStatusActionTypes.SUCCESS, payload: { actionType }, call_id: apiCallId });
    return result;
  } catch (e) {
    const errorPayload = {
      actionType,
      error: {
        status: error.response?.status,
        message: error.response?.data?.detail || error.message,
        response: error.response,
        timestamp: new Date().toISOString()
      }
    };
    dispatch({ type: APIStatusActionTypes.ERROR, payload: errorPayload, call_id: apiCallId });
    console.error(e);
    console.log(actionType);
    if (e?.data) throwError(dispatch, e);
    else throw (e);
  }
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
  const result = await axios.get(`/core-api/project/`);
  dispatch({
    type: APIActionTypes.GET_PROJECT_LIST,
    payload: result.data.results,
  });
}

api.apiGetProjectSettings = (project_prefix) => async (dispatch) => {
  log(`called apiGetProjectSettings`);
  const me = await axios.get(`/me`);
  const res = await axios.get(`${API_PREFIX}/project/${project_prefix}/`);
  dispatch({
    type: APIActionTypes.GET_PROJECT_SETTINGS,
    payload: { ...res.data, me: me.data },
  });
};

api.apiUpdateProjectSettings = (project_prefix, settings) => async (dispatch) => {
  log(`called apiUpdateProjectSettings`);
  const res = await axios.patch(
    `${API_PREFIX}/project/${project_prefix}/`,
    { settings: settings },
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
  store.dispatch({
    type: APIActionTypes.GET_PROJECT_SETTINGS,
    payload: res.data,
  });
};

api.apiGetCodingProgress = () => async (dispatch) => {
  log(`called apiGetCodingProgress`);
  const res = await axios.get(`${API_PREFIX}/coding_progress/`);
  dispatch({
    type: APIActionTypes.GET_CODING_PROGRESS,
    payload: res.data,
  });
};


///////////////////////
//    Permissions    //
///////////////////////

api.apiGetProjectRoles = () => async (dispatch) => {
  log(`called apiGetProjectRoles`);
  await doAPIGet(`project_role/`, dispatch, APIActionTypes.GET_PROJECT_ROLES, (res) => (res.data.results));
};

api.apiPostProjectRole = (role_data) => async (dispatch) => {
  log(`called apiPostProjectRole`);
  const res = await axios.post(
    `${API_PREFIX}/project_role/`,
    { ...role_data },
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
  store.dispatch({
    type: APIActionTypes.POST_PROJECT_ROLE,
    payload: res.data,
  });
};

///////////////////////
//    Assignments    //
///////////////////////

api.apiGetAssignments = () => async (dispatch) => {
  log(`called apiGetAssignments`);
  await doAPIGet(`assignment/`, dispatch, APIActionTypes.GET_ASSIGNMENT_LIST, (res) => (res.data.results || []));
};


api.apiPostAssignment = (assignment_data) => async (dispatch) => {
  log(`called apiPostAssignment`);
  const res = await axios.post(
    `${API_PREFIX}/assignment/`,
    { ...assignment_data },
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
  store.dispatch({
    type: APIActionTypes.POST_ASSIGNMENT,
    payload: res.data,
  });
};

//////////////////////
//     Policies     //
//////////////////////

api.apiGetPolicies = () => async (dispatch) => {
  log(`called apiGetPolicies`);
  await doAPIGet(`policy/`, dispatch, APIActionTypes.GET_POLICIES, (res) => (res.data.results));
};

api.apiGetPolicyAssociatedData = (policy_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const policy_instance_list = await doAPIGet(`policy_instance/?policy_id=${policy_id}`, dispatch, APIActionTypes.GET_POLICY_INSTANCES, (res) => res.data.results);
  await doAPIGet(`policy/${policy_id}/`, dispatch, APIActionTypes.GET_POLICY, (res) => res.data);
  for (
    let _i = 0, policy_instance = policy_instance_list[_i++];
    _i < policy_instance_list.length;
    policy_instance = policy_instance_list[_i++]
  ) {
    await doAPIGet(
      `coding_instance/?policy_instance_id=${policy_instance.id}`,
      dispatch,
      APIActionTypes.GET_ALL_CODING_INSTANCE,
      res => res.data.results
    );
  }
};

api.apiPostPolicy = ({ name }) => async (dispatch) => {
  log(`called createNewPolicyInstance`);
  const res = await axios.post(
    `${API_PREFIX}/policy/`,
    { name },
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
  store.dispatch({
    type: APIActionTypes.POST_POLICY,
    payload: res.data,
  });
  const res2 = await axios.get(`${API_PREFIX}/policy/${res.data.id}/`);
  dispatch({
    type: APIActionTypes.GET_POLICY,
    payload: res2.data,
  });
};


////////////////////////////
//    Policy Instances    //
////////////////////////////

api.apiGetPolicyInstance = (policy_instance_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const policy_instance = await doAPIGet(`policy_instance/${policy_instance_id}/`, dispatch, APIActionTypes.GET_POLICY_INSTANCE, (res) => res.data);
  await doAPIGet(`policy/${policy_instance.policy_id}`, dispatch, APIActionTypes.GET_POLICY, (res) => res.data);
};

api.apiGetPolicyInstancesMeta = (policy_instance_id) => async (dispatch) => {
  log(`called apiGetPolicyInstance`);
  const policy_instance = await doAPIGet(
    `policy_instance_meta/`,
    dispatch,
    APIActionTypes.GET_POLICY_INSTANCES,
    (res) => res.data.results
  );
};

api.apiPostPolicyInstance = ({ policy_id, id, scan_dt, content }) => async (dispatch) => {
  log(`called createNewPolicyInstance`);
  const res = await axios.post(
    `${API_PREFIX}/policy_instance/`,
    { policy_id, scan_dt, content, id },
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
  store.dispatch({
    type: APIActionTypes.POST_POLICY_INSTANCE,
    payload: res.data,
  });
  const res2 = await axios.get(`${API_PREFIX}/policy_instance/${res.data.id}/`);
  dispatch({
    type: APIActionTypes.GET_POLICY_INSTANCE,
    payload: res2.data,
  });
};

////////////////////////
//      Coding        //
////////////////////////

api.apiGetCodingList = () => async (dispatch) => {
  log(`called apiGetCodingList`);
  doAPIGet(`coding/`, dispatch, APIActionTypes.GET_CODING_LIST, (res) => res.data.results);
};

api.apiGetCoding = (coding_id) => async (dispatch) => {
  log(`called apiGetCoding`);
  doAPIGet(`coding/${coding_id}/`, dispatch, APIActionTypes.GET_CODING)
};

api.apiSaveCoding = (coding, go_to_editor = false) => async (dispatch) => {
  log(`called apiSaveCoding`);
  const res = await axios.post(
    `${API_PREFIX}/coding/`,
    { ...coding, id: '' },
    { headers: { "X-CSRFToken": await get_CSRF_token() } }
  );
  if (go_to_editor) {
    window.location.href = `/c/${PROJECT_NAME}/coding/${res.data.id}`;
  } else {
    store.dispatch({
      type: APIActionTypes.GET_CODING,
      payload: res.data,
    });
  }
};

api.apiUpdateCoding = (coding_id, coding) => async (dispatch) => {
  log(`called apiUpdateCoding`);
  const res = await axios.patch(`${API_PREFIX}/coding/${coding_id}/`, coding, {
    headers: { "X-CSRFToken": await get_CSRF_token() },
  });
  store.dispatch({
    type: APIActionTypes.GET_CODING,
    payload: res.data,
  });
};

////////////////////////
//  Coding Instance  //
////////////////////////

api.apiGetCodingInstance = (policy_instance_id, coding_id) => async (dispatch) => {
  log(`called apiGetCodingInstance`);
  const coder_email = CURRENT_USER;
  const res = await axios.get(`${API_PREFIX}/coding_instance/`, {
    params: { policy_instance_id, coding_id, coder_email },
  });
  dispatch({
    type: APIActionTypes.GET_CODING_INSTANCE,
    payload: res.data.results ?? [{}],
  });
  if (res.data.results?.length > 0) {
    dispatch({
      type: APIActionTypes.SERVER_CODING_INSTANCE,
      payload: res.data.results[0],
    });
  }
};

api.apiGetAllCodingInstances = (policy_instance_id, coding_id) => async (dispatch) => {
  log(`called apiGetAllCodingInstances`);
  const res = await axios.get(`${API_PREFIX}/coding_instance/`, {
    params: { policy_instance_id, coding_id },
  });
  dispatch({
    type: APIActionTypes.GET_ALL_CODING_INSTANCE,
    payload: res.data.results ?? [{}],
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
  const res = await axios.post(`${API_PREFIX}/coding_instance/`, request_params, {
    headers: { "X-CSRFToken": await get_CSRF_token() },
  });
  store.dispatch({
    type: actionName,
    payload: res.data,
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
