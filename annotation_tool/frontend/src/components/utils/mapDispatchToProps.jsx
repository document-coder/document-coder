/**
 * there's to much fixing to do now do undo the shorthand
 * https://react-redux.js.org/api/connect
 */

import api from "src/actions/api";
import app from "src/actions/appActions";
import user from "src/actions/userActions";

export default {
  ...api,
  ...app,
  ...user,
};
