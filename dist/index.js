import ReactDOM from "../packages/reactDom/reactDOM";
import React from "../packages/react/react";
import { jsx as _jsx } from "../packages/jsx/jsx-runtime";
import { jsxs as _jsxs } from "../packages/jsx/jsx-runtime";
function Profile() {
  const [counter, setCounter] = React.useState(10);
  const user = {
    firstName: "helo",
    lastName: "yello"
  };
  return _jsxs("div", {
    children: [_jsx("img", {
      src: "avatar.png",
      className: "profile"
    }), _jsx("h3", {
      children: [user.firstName, user.lastName].join(" ")
    }), _jsxs("div", {
      children: ["hrllo", _jsx("span", {
        children: "yeah"
      })]
    }), _jsxs("button", {
      onClick: () => {
        const newCount = counter + 1;
        setCounter(newCount);
      },
      children: ["change counter: ", counter]
    }), _jsx(Tag, {})]
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
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(Profile, {}));