/**
 *
 * @param {array} array
 * @param {object} object
 * @param {number} index
 * @returns {array}
 */
export function insert(array, obj, index) {
  return [...array.slice(0, index), obj, ...array.slice(index)];
}

/**
 *
 * @param {array} array
 * @param {object} object
 * @param {number} index
 * @returns {array}
 */
export function replace(array, obj, index) {
  return [...array.slice(0, index), obj, ...array.slice(index + 1)];
}

/**
 *
 * @param {array} array
 * @param {number} index
 * @returns {array}
 */
export function deleteItem(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
