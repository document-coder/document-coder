import _ from "lodash";
import { APIActionTypes, AppActionTypes, NULL_OP, UserActionsTypes } from "src/actions/types";
import { overwrite_stored_object_copies, overwrite_stored_value } from "./utils";

const defaultState = {
  selectedQuestionIdentifier: "-1",
  selectedCategoryIdentifier: "-1",
  localCodingInstance: {
    categoryHighlights: {},
  }, // the current coding values
  localCodings: {}, // for coding editing
  updateSinceLastSave: true,
};
const LOCAL_CODING_INSTANCE = "localCodingInstance";

function get_default_question() {
  return {
    values: {},
    sentences: {},
    comment: "",
    confidence: null,
  };
}

function _updateState(state, updateDict) {
  return { ...state, ...updateDict };
}

function changeValues(state, { question_identifier, values }) {
  return overwrite_stored_value(state, [LOCAL_CODING_INSTANCE, question_identifier], {
    ...(state.localCodingInstance[question_identifier] ?? get_default_question()),
    values: values,
  });
}

function changeQuestionMeta(state, { payload: { question_identifier, field, value } }) {
  const next_state = { ...state };
  next_state.localCodingInstance[question_identifier] = {
    ...(state.localCodingInstance[question_identifier] ?? get_default_question()),
    ...{ [field]: value },
  };
  return next_state;
}

function toggleParagraph(state, { paragraph_idx, doc_ordinal }) {
  if (state.selectedQuestionIdentifier == "-1") return state;
  const current =
    state.localCodingInstance?.categoryHighlights?.[state.selectedCategoryIdentifier] ?? {};
  const key = `${doc_ordinal}-${paragraph_idx}`;
  return overwrite_stored_value(
    state,
    [LOCAL_CODING_INSTANCE, "categoryHighlights", state.selectedCategoryIdentifier],
    { ...current, ...{ [key]: !current[key] } }
  );
}

function toggleSentence(state, { paragraph_idx, sentence_idx, doc_ordinal }) {
  if (state.selectedQuestionIdentifier == "-1") return state;
  var current_value =
    state.localCodingInstance[state.selectedQuestionIdentifier] ?? get_default_question();
  var new_policy_sentences = { ...current_value.sentences[doc_ordinal] };
  if (!new_policy_sentences[paragraph_idx]) {
    new_policy_sentences[paragraph_idx] = [sentence_idx];
  } else if (new_policy_sentences[paragraph_idx].indexOf(sentence_idx) < 0) {
    new_policy_sentences[paragraph_idx].push(sentence_idx);
  } else {
    new_policy_sentences[paragraph_idx] = new_policy_sentences[paragraph_idx].filter(
      (e) => e !== sentence_idx
    );
  }
  const new_value = overwrite_stored_value(
    current_value,
    ["sentences", doc_ordinal],
    new_policy_sentences
  );
  return overwrite_stored_value(
    state,
    [LOCAL_CODING_INSTANCE, state.selectedQuestionIdentifier],
    new_value
  );
}

function selectQuestion(state, { question_identifier, category_identifier }) {
  return _updateState(state, {
    selectedQuestionIdentifier: question_identifier,
    selectedCategoryIdentifier: category_identifier,
  });
}

function loadSavedCodingInstance(state, { coding_values }) {
  if (!coding_values) return state;
  return { ...state, ...{ localCodingInstance: coding_values } };
}

function loadSavedCodings(state, payload) {
  return _updateState(state, {
    localCodings: _.fromPairs(_.map(payload, (coding) => [coding.id, coding])),
  });
}

function setCurrentView(state, { policy_instance_id, coding_id, merge_mode }) {
  return _updateState(state, {
    policyInstanceId: policy_instance_id,
    codingId: coding_id,
    merge_mode: merge_mode == true,
  });
}

function changeCoding(state, { coding }) {
  return overwrite_stored_value(state, ["localCodings", coding.id], coding);
}

export default (state = defaultState, action) => {
  const new_state = _updateState(state, {
    updateSinceLastSave: false,
    updateHackOccured: "" + new Date(),
  });
  switch (action.type) {
    // updates that don't mutate user input state.
    case AppActionTypes.SET_CURRENT_VIEW:
      return setCurrentView(state, action.payload);
    case APIActionTypes.POST_CODING_INSTANCE:
      new_state.updateSinceLastSave = true;
      return new_state;
    case APIActionTypes.SERVER_CODING_INSTANCE:
      return loadSavedCodingInstance(new_state, action.payload);
    case APIActionTypes.GET_CODING_LIST:
      return loadSavedCodings(new_state, action.payload);

    // updates that mutate user's input
    case UserActionsTypes.SELECT_QUESTION:
      return selectQuestion(new_state, action.payload);
    case UserActionsTypes.CHANGE_QUESTION_META:
      return changeQuestionMeta(new_state, action);
    case UserActionsTypes.TOGGLE_SENTENCE:
      return toggleSentence(new_state, action.payload);
    case UserActionsTypes.TOGGLE_PARAGRAPH:
      return toggleParagraph(new_state, action.payload);
    case UserActionsTypes.CHANGE_VALUE:
      return changeValues(new_state, action.payload);
    case UserActionsTypes.UPDATE_CODING:
      return changeCoding(new_state, action.payload);

    case NULL_OP:
      return new_state;

    // null action
    default:
      return state;
  }
};
