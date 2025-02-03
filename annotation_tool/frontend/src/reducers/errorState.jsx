import { APIStatusActionTypes } from "src/actions/types";
import { TYPE_ERROR_EXPLANATIONS } from "src/actions/types";
import _ from "lodash";

const defaultState = {
  active_call_ids: {}, // call_id: status_code
  errors: [],
}

const injectToastOntoPage = (action) => {
  try {
    const toastDiv = document.querySelector("#toast-container");
    toastDiv.classList.add("active");
    const error_code = action.error?.status || "default";
    const error_explanation = (
      TYPE_ERROR_EXPLANATIONS[action.actionType]?.[error_code] ||
      TYPE_ERROR_EXPLANATIONS.defaults[error_code] ||
      TYPE_ERROR_EXPLANATIONS.defaults.default
    );
    const newToastItem = document.createElement("div");
    const errResponse = action.error?.response;
    var data = '';
    try {
      data += JSON.stringify(JSON.parse(errResponse.config.data));
    } catch (error) {
    }
    newToastItem.classList.add("toast");
    newToastItem.classList.add("ready");
    newToastItem.classList.add(`error-code-${error_code}`);
    newToastItem.innerHTML = `
  <div class='explanation'>${error_explanation}</div>
  <div class='error-detail'>Technical details: {
    server_message: "${errResponse?.data?.detail || ""}"
    request: "[${errResponse?.config?.method}] ${errResponse?.config?.url || ""}" 
    data: ${data}
  }</div>`;
    toastDiv.appendChild(newToastItem);
    setTimeout(() => {
      newToastItem.classList.remove("ready");
      newToastItem.classList.add("active");
      console.log("acitve");
    }, 10);
    setTimeout(() => {
      newToastItem.classList.remove("active");
      newToastItem.classList.add("ready");
      console.log("reardy");
    }, 5000);
    setTimeout(() => {
      newToastItem.remove();
    }, 6000);
  } catch (error) {
    console.error("Failed to inject toast onto page", error);
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case APIStatusActionTypes.START:
      if (state.active_call_ids[action.call_id]) {
        return state;
      } else {
        return {
          ...state,
          active_call_ids: {
            ...state.active_call_ids,
            [action.call_id]: {
              status: "LOADING...",
              task_name: action.payload?.actionType || "",
              start_time: new Date().getTime(),
            },
          },
        }
      }
    case APIStatusActionTypes.SUCCESS:
      const newState = {
        ...state,
        active_call_ids: {
          ...state.active_call_ids,
          [action.call_id]: {
            ...state.active_call_ids[action.call_id] || {},
            status: "DONE",
            end_time: new Date().getTime(),
          }
        },
      };
      // if there all active calls are SUCCESS now that this call_id is SUCCESS, clear the active_call_ids
      if (_.every(newState.active_call_ids, { status: "SUCCESS" })) {
        newState.active_call_ids = {};
      }
      return newState;
    case APIStatusActionTypes.ERROR:
      injectToastOntoPage(action.payload);
      return {
        ...state,
        active_call_ids: {
          ...state.active_call_ids,
          [action.call_id]: {
            ...state.active_call_ids[action.call_id] || {},
            status: "ERROR",
            end_time: new Date().getTime(),
          }
        },
        errors: [...state.errors, action.payload],
      };
    default:
      return state;
  }
}