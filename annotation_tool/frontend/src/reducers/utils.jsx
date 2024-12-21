/**
 * idempotent state update. replaces entries located at
 * state.<object_type>.<object_id>
 * @param {object} state - the current state, which starts as {@link defaultState} and gets filled in as API calls complete.
 * @param {object} object_copies - objects, keyed on id
 * @param {String} object_type
 * @returns the next state
 */
export function overwrite_stored_object_copies(state, object_copies, object_type) {
  const to_ret = {
    ...state,
    ...{
      [object_type]: {
        ...state[object_type],
        ...object_copies,
      },
    },
  };
  delete to_ret[object_type]._unloaded;
  return to_ret;
}

/**
 * given state.<level_1>.<level_2>.... = <value>
 * change value, without changing anything else about state's values
 * but also maintaining idempotency
 */
export function overwrite_stored_value(state, path, value) {
  const next_state = { ...state };
  let cur_pointer = next_state;
  for (let p of path.slice(0, -1)) {
    cur_pointer[p] = { ...cur_pointer[p] };
    cur_pointer = cur_pointer[p];
  }
  cur_pointer[path[path.length - 1]] = value;
  return next_state;
}
