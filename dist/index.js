import ReactDOM from "../packages/reactDom/reactDOM";
import React from "../packages/react/react";
import { jsx as _jsx } from "../packages/jsx/jsx-runtime";
import { jsxs as _jsxs } from "../packages/jsx/jsx-runtime";
function Todo() {
  const [todos, setTodos] = React.useState(["first todo"]);
  const inputVal = React.useRef("");
  return _jsxs("div", {
    children: [_jsxs("label", {
      title: "todo title",
      children: ["todo title", _jsx("input", {
        onChange: evt => {
          inputVal.current = evt.target.value;
        }
      })]
    }), _jsx("button", {
      onClick: () => {
        if (!inputVal.current) return;
        setTodos([...todos, inputVal.current]);
      },
      children: "add todo"
    }), _jsx("ul", {
      children: todos.map(el => {
        return _jsx("li", {
          children: el
        });
      })
    })]
  });
}
function Tag() {
  return _jsx(Button, {
    children: "yasser zaki"
  });
}
function Button({
  children
}) {
  return _jsx("button", {
    className: "hello",
    style: {
      backgroundColor: "red"
    },
    children: children
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(Todo, {}));