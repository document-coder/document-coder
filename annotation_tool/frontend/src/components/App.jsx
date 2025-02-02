import React, { Component } from "react";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "src/store";
import MainRouter from "./MainRouter";
import Logger from "src/Logger";
// magic for log preservation
for (let __i = 0; __i++ < 10;) console.groupEnd();
console.group();

const log = Logger("app", "grey", "background-color: white; border: 3px solid black; font-size: 2em");

class App extends Component {
  render() {
    if (location.pathname === "/c/") {
      log(`Redirecting to project list!`);
      location.href = "/";
    }
    log(`App Loading!`);
    return (
      <Provider store={store}>
        <MainRouter />
      </Provider>
    );
  }
}

const container = document.querySelector("#app");
const root = ReactDOM.createRoot(container);
root.render(<App tab="home" />);
