import { NULL_OP, UserActionsTypes } from "src/actions/types";
import _ from "lodash";

const user = {};
user.userUpdateCoding = (coding) => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.UPDATE_CODING,
    payload: { coding },
  });
};

user.userSelectQuestion = (question_identifier, category_identifier) => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.SELECT_QUESTION,
    payload: { question_identifier, category_identifier },
  });
};

user.userChangeValue = (question_identifier, values) => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.CHANGE_VALUE,
    payload: { question_identifier, values },
  });
};

user.userToggleParagraph = (doc_ordinal, paragraph_idx) => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.TOGGLE_PARAGRAPH,
    payload: { doc_ordinal, paragraph_idx },
  });
};

user.userToggleSentence = (doc_ordinal, paragraph_idx, sentence_idx) => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.TOGGLE_SENTENCE,
    payload: { doc_ordinal, paragraph_idx, sentence_idx },
  });
};

user.userChangeQuestionMeta = (question_identifier, field, value) => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.CHANGE_QUESTION_META,
    payload: { question_identifier, field, value },
  });
};

user.userClickSave = () => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.CLICK_SAVE,
    payload: {},
  });
};

user.userClickReset = () => async (dispatch) => {
  dispatch({
    type: UserActionsTypes.CLICK_RESET,
    payload: {},
  });
};

user.userNullOp = () => async (dispatch) => {
  dispatch({
    type: NULL_OP,
    payload: {},
  });
};

export default user;
