const React = {};

import ReactDOM from "../reactDom/reactDOM";

const stateMap = {
  states: [],
  calls: -1,
};

function useState(initialState) {
  const callId = ++stateMap.calls;

  if (stateMap.states[callId]) {
    return stateMap.states[callId];
  }

  function dispatch(newState) {
    stateMap.states[callId][0] = newState;
    //rerender
    stateMap.calls = -1;
    ReactDOM.rerender();
  }

  const tuple = [initialState, dispatch];
  stateMap.states[callId] = tuple;

  return tuple;
}

React.useState = useState;

export default React;
