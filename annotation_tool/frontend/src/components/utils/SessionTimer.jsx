import axios from "axios";
import _ from "lodash";
import { CURRENT_USER, PROJECT_NAME } from "src/constants";

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const CSRF_TOKEN = getCookie("csrftoken");

export default class SessionTimer {
  constructor(user_email, coding_id, policy_instance_id) {
    log("starting timer...");
    this.coding_id = coding_id;
    this.policy_instance_id = policy_instance_id;
    this.session = {};
    this.running_timer_id = undefined;
    this.session.timers = {};
    this.session.id = Date.now();
    if (location.host.startsWith("127")) {
      this.session.id = -`${coding_id}.${policy_instance_id}`;
    }
    this.session.start_ts = Date.now();
    this.session.global_timer = {
      start_ts: Date.now(),
      focused: true,
      paused: false,
      total_focus: 0,
      total_blur: 0,
      last_toggle: Date.now(),
    };
    window.addEventListener("blur", this._blur.bind(this));
    window.addEventListener("focus", this._focus.bind(this));
    window.addEventListener("beforeunload", this._unload.bind(this));
    window.addEventListener("unload", this._unload.bind(this));
    this.post_update = this._post_update.bind(this);
    this.post_update_async = this._post_update_async.bind(this);
    this.run_timer = this._run_timer.bind(this);
    this._get_post_values = this._get_post_values.bind(this);
    this.run_timer("setup");
  }
  _blur(e) {
    const cur_time = Date.now();

    const last_toggle = this.session.global_timer.last_toggle;
    this.session.global_timer.focused = false;
    this.session.global_timer.total_focus += cur_time - last_toggle;
    this.session.global_timer.last_toggle = cur_time;

    const cur_timer = this.session.timers[this.session.running_timer_id];
    cur_timer.focused = false;
    cur_timer.total_focus += cur_time - cur_timer.last_toggle;
    cur_timer.last_toggle = cur_time;
    this.post_update();
  }
  _focus(e) {
    const cur_time = Date.now();
    const last_toggle = this.session.global_timer.last_toggle;
    this.session.global_timer.focused = true;
    this.session.global_timer.total_blur += cur_time - last_toggle;
    this.session.global_timer.last_toggle = cur_time;

    const cur_timer = this.session.timers[this.session.running_timer_id];
    cur_timer.focused = true;
    cur_timer.total_blur += cur_time - cur_timer.last_toggle;
    cur_timer.last_toggle = cur_time;
    this.post_update();
  }
  _unload(e) {
    e.preventDefault();
    this.post_update_async();
  }
  _run_timer(timer_id) {
    const cur_time = Date.now();
    const last_timer = this.session.timers[this.session.running_timer_id];
    if (last_timer) {
      last_timer.total_focus += cur_time - last_timer.last_toggle;
    }
    _.map(this.session.timers, (e) => {
      e.focused = false;
      e.paused = true;
    });
    this.session.running_timer_id = timer_id;
    if (!this.session.timers[timer_id]) {
      this.session.timers[timer_id] = {
        start_ts: cur_time,
        focused: true,
        paused: false,
        total_focus: 0,
        total_blur: 0,
        last_toggle: cur_time,
      };
    } else {
      this.session.timers[timer_id].last_toggle = cur_time;
      this.session.timers[timer_id].focused = true;
      this.session.timers[timer_id].paused = false;
    }
    this.post_update();
  }
  _get_post_values() {
    return {
      coder_email: CURRENT_USER,
      coding_id: this.coding_id,
      policy_instance_id: this.policy_instance_id,
      session_timing: {
        total_blur: this.session.global_timer.total_blur,
        total_focus: this.session.global_timer.total_focus,
        start_ts: this.session.global_timer.start_ts,
      },
      question_timings: _.fromPairs(
        _.map(this.session.timers, (q_timing, q_identifier) => {
          return [
            q_identifier,
            {
              total_blur: q_timing.total_blur,
              total_focus: q_timing.total_focus,
              start_ts: q_timing.start_ts,
            },
          ];
        })
      ),
      session_identifier: this.session.id,
    };
  }
  _post_update() {
    axios.post(`/api/${PROJECT_NAME}/timing_session/`, this._get_post_values(), {
      headers: { "X-CSRFToken": CSRF_TOKEN },
    });
  }
  async _post_update_async() {
    await axios.post(`/api/${PROJECT_NAME}/timing_session/`, this._get_post_values(), {
      headers: { "X-CSRFToken": CSRF_TOKEN },
    });
  }
}
