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

  stateMap.states[callId] = [initialState, dispatch];

  return stateMap.states[callId];
}

function useRef(initialState) {
  const callId = ++stateMap.calls;

  if (stateMap.states[callId]) {
    return stateMap.states[callId];
  }

  stateMap.states[callId] = { current: initialState };

  return stateMap.states[callId];
}

React.useState = useState;
React.useRef = useRef;

export default React;
