import { get } from "lodash";

function getStackTrace() {
  const obj = {};
  try {Error.captureStackTrace(obj, getStackTrace); }
  catch (err) {}
  return `${obj.stack}`.substr(6);
}

function getReactComponent(trace) {
  const start_idx = trace.indexOf("at new");
  if (start_idx == -1) {
    return "";
  }
  const subtrace = trace.substr(start_idx + 7);
  const end_idx = subtrace.indexOf(" (");
  if (end_idx == -1) {
    return "";
  }
  return subtrace.substr(0, end_idx);
}

function Logger(topic, color, extra_styles) {
  return ((msg, ...args) => {
    const ts = new Date().toLocaleTimeString();
    const tag = `[${topic}][${ts}]`;
    const stack = getStackTrace().replaceAll("\n", `\n${tag} `);
    const component = getReactComponent(stack);
    const comp_tag = component ? `[${component}]` : "";
    console.groupCollapsed(
      `%c${tag}${comp_tag} ${JSON.stringify(msg, null, "  ")}`,
      `color: ${color}; ${extra_styles ? extra_styles : ""}`
    );
    if (args)
      console.log(
        `%c${tag}${comp_tag}`,
        `color: ${color}; ${extra_styles ? extra_styles : ""}`,
        args
      );
    console.debug(`%c${tag}${stack}`, `color: ${color}; ${extra_styles ? extra_styles : ""}`);
    console.groupEnd();
  }).bind(this);
}

window.log = Logger("default_logger", "green");

export default Logger;
