import ReactDOM from "../packages/reactDom/reactDOM";
import { jsx as _jsx } from "../packages/jsx/jsx-runtime";
import { jsxs as _jsxs } from "../packages/jsx/jsx-runtime";
function Profile() {
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
    })]
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsxs("div", {
  children: ["text here ", _jsx("span", {
    children: "text here 222"
  })]
}));