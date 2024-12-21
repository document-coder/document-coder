# recommended tools

The following are tools that may be helpful for working with the codebase.

## Docker

The project contains a Dockerfile for building a containerized version of the project. This can be useful for testing the project without installing dependencies on your local machine or dealing with compatibility issues.

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) is a popular IDE with decent support for python and javascript, and several plug-ins for working with DJango, Docker, and vite.

The project contains VSCode hooks for running tests, debugging, and building the project. Loading the project in VSCode will provide many helpful quality-of-life features out-of-the-box.

Notably, if you run the task `run webapp in docker with debugpy` and then select `Python Debugger: Remote Attach` in the debug panel, the debugger will attach to the running container, allowing you to set breakpoints, inspect variables, step through code, and capture errors.

## Redux DevTools

[Redux DevTools](https://github.com/reduxjs/redux-devtools) is a browser extension that can be used to inspect the state of the application, rewind and replay actions. It can make debugging the frontend application much easier.

![Redux DevTools](./images/redux-devtools.png)

## React Developer Tools

[React Developer Tools](https://react.dev/learn/react-developer-tools) is a browser extension that can be used to inspect the React component tree, view props and state, and debug performance issues. It's extremely helpful for figuring out the state of individual components in the application.

![React Developer Tools](./images/react-devtool.png)