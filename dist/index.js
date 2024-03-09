import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function Profile() {
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("img", {
      src: "avatar.png",
      className: "profile"
    }), /*#__PURE__*/_jsx("h3", {
      children: [user.firstName, user.lastName].join(" ")
    })]
  });
}