const React = {};

import ReactDOM from "../reactDom/reactDOM";

const stateMap = {
  states: [],
  calls: -1,
};

const depMap = {
  deps: [],
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
    depMap.calls = -1;
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

function useEffect(cb, depArr) {
  if (!depArr) throw new Error("you don't want this buddy");

  const callId = ++depMap.calls;
  const prevDeps = depMap.deps[callId];

  if (
    !prevDeps ||
    depArr.length !== prevDeps.length ||
    depArr.some((value, id) => {
      return value !== prevDeps[id];
    })
  ) {
    cb();
    depMap.deps[callId] = depArr;
  }
}

React.useState = useState;
React.useRef = useRef;
React.useEffect = useEffect;

export default React;
