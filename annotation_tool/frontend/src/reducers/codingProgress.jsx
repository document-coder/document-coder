import _ from "lodash";
import { APIActionTypes } from "src/actions/types";

const defaultState = [];

export default (state = defaultState, action) => {
  switch (action.type) {
    case APIActionTypes.GET_CODING_PROGRESS:
      return action.payload.data;
    default:
      return state;
  }
};
