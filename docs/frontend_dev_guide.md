# Frontend Development Guide: Creating New Pages

## Overview

This guide walks through the process of creating new pages in the annotation tool frontend. The application uses React with Redux for state management, following a pattern where:
- The server is the source of truth for all data
- Redux manages application state 
- Component local state is minimized
- API interactions are centralized

## Project Structure

New pages should follow the established project structure:

```
src/
  components/
    NewFeatureApp.jsx        # Main page component
    new-feature/            # Feature-specific components
      ComponentOne.jsx
      ComponentTwo.jsx
  actions/
    types.jsx              # Action type definitions
    api.jsx               # API interaction layer
  reducers/
    model.jsx             # Core state management
```

Function calls should be made at the top level, and passed down to subcomponents.

## Step-by-Step Guide

### 1. Define API Actions

First, add your API action types to `actions/types.jsx`:

```javascript
export const APIActionTypes = {
  // existing types...
  GET_NEW_FEATURE_DATA: "API_GET_NEW_FEATURE_DATA",
  UPDATE_NEW_FEATURE: "API_UPDATE_NEW_FEATURE",
};
```

### 2. Add API Methods

Add methods to `actions/api.jsx` to handle server communication:

```javascript
api.getNewFeatureData = () => async (dispatch) => {
  log(`called getNewFeatureData`);
  await doAPIGet(
    `new-feature/`, 
    dispatch, 
    APIActionTypes.GET_NEW_FEATURE_DATA,
    (res) => res.data.results
  );
};
```

### 3. Update State Management

Extend the default state in `reducers/model.jsx` if needed:

```javascript
const defaultState = {
  // existing state...
  newFeature: { "_unloaded": true },
};
```

Add handling for your actions in the reducer:

```javascript
case APIActionTypes.GET_NEW_FEATURE_DATA:
  return overwrite_stored_object_copies(
    state, 
    _wrapObjectList(action.payload), 
    "newFeature"
  );
```

### 4. Create the Page Component

Create your main page component (e.g., `components/NewFeatureApp.jsx`):

```javascript
import React, { Component } from "react";
import { connect } from "react-redux";
import mapStateToProps from "src/components/utils/mapStateToProps";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import withParams from "src/components/utils/withParams";
import Loading from "src/components/widgets/Loading";

class NewFeatureApp extends Component {
  constructor(props) {
    super(props);
    // Load initial data
    this.props.getNewFeatureData();
  }

  render() {
    const { model: { newFeature } } = this.props;
    
    if (newFeature._unloaded) {
      return <Loading />;
    }

    return (
      <div className="new-feature-app page-root">
        {/* Your page content */}
      </div>
    );
  }
}

export default withParams(
  connect(mapStateToProps, mapDispatchToProps)(NewFeatureApp)
);
```

If you need to change state, the API functions are available in `state.props`

### 5. Add Route

Add your route to `MainRouter.jsx`:

```javascript
<Route path={`new-feature`} element={<NewFeatureApp />} />
```

## Key Principles

### State Management

1. **Server as Source of Truth**
   - All persistent data should come from the server
   - Use the API wrapper for all server communication
   - Handle loading states using the `_unloaded` flag

2. **Redux State**
   - Use Redux for all shared application state
   - Initialize state with `_unloaded: true` for data that is stored server-side
   - Use `overwrite_stored_object_copies` helper for updating collections

3. **Components are Stateless**
   - Never use component local state, except for truly temporary, ephemeral UI state
   - If state needs to persist or be shared, pass it through the API via Redux.

### Loading States

Always handle loading states explicitly:

```javascript
if (dataObject._unloaded) {
  return <Loading />;
}
```

### API Integration

1. Always use the API wrapper (`api.jsx`)
2. Follow the established pattern for API methods:
   - Use `doAPIGet` for GET requests
   - Add appropriate error handling
   - Dispatch actions with transformed response data

## Common Pitfalls

1. **Initialization Order**
   - Always check for `_unloaded` state
   - Initialize data in constructor
   - Handle cases where dependent data isn't loaded

2. **State Updates**
   - Don't modify Redux state directly
   - Use `overwrite_stored_object_copies` for collections
   - Handle loading states explicitly

3. **Component Structure**
   - Keep components focused and small
   - Use the widgets directory for shared components
   - Follow existing patterns for component organization

## Testing Your Page

1. Verify data loading and error states
2. Test offline behavior
3. Ensure proper cleanup of subscriptions/listeners
4. Verify proper state management
5. Test URL parameter handling

## Style Guidelines

1. Use 2-space indentation
2. Follow existing naming conventions
3. Use SCSS for styling
4. Add styles to appropriate SCSS file in `styles/`