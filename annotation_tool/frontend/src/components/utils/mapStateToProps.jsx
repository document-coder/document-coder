/**
 * @param state
 * @param {ModelState} state.model
 * @param {CodingProgressStateObject} state.codingProgress
 * @param {LocalState} state.localState
 * @param {Function | Null} useParams
 */
export default (state, useParams = null) => ({
  model: state.model,
  codingProgress: state.codingProgressStore,
  localState: state.localState,
  route: useParams ? useParams : null,
  errors: state.errors,
});
