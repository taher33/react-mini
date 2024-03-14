import ReactDOM from "../packages/reactDom/reactDOM";
import React from "../packages/react/react";
import { jsx as _jsx } from "../packages/jsx/jsx-runtime";
import { jsxs as _jsxs } from "../packages/jsx/jsx-runtime";
function Profile() {
  const [counter, setCounter] = React.useState(10);
  const [imageSrc, setImageSrc] = React.useState("https://images.dog.ceo/breeds/spaniel-welsh/n02102177_2766.jpg");
  const user = {
    firstName: "helo",
    lastName: "yello"
  };
  const ref = React.useRef(null);
  React.useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random").then(res => res.json().then(res => setImageSrc(res.message)));
    console.log("this is called");
  }, [counter]);
  return _jsxs("div", {
    children: [_jsx("img", {
      src: imageSrc
    }), _jsx("h3", {
      children: [user.firstName, user.lastName].join(" ")
    }), _jsxs("div", {
      children: ["hrllo", _jsx("span", {
        children: "yeah"
      })]
    }), _jsxs("button", {
      onClick: () => {
        ref.current = 12;
        const newCount = counter + 1;
        setCounter(newCount);
      },
      children: ["change counter: ", counter]
    }), "current doesn't change after rerender: ", ref.current ? ref.current : "", _jsx(Tag, {})]
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