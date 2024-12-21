// @ts-nocheck
import "src/components/App";
import * as locals from "src/styles/main.scss";
if (window.location.pathname.charAt(window.location.pathname.length - 1) != "/")
  window.history.replaceState(null, null, window.location.pathname + "/");
