const React = {};
function createElement(tag, props, children) {
  console.log({ tag, props, children });
}

React.createElement = createElement;
console.log({ React });
