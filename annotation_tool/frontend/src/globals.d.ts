import "src/reducers/stateObjects";

declare global {
  interface Window {
    CURRENT_USER: any;
    SESSION_TIMER: any;
  }
}

let CURRENT_USER = window.CURRENT_USER;
let SESSION_TIMER = window.SESSION_TIMER;

interface MainStore {
  model: ModelState;
  localState: LocalState;
  codingProgress: CodingProgressStateObject[];
}
