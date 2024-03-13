import ReactDOM from "../packages/reactDom/reactDOM";
import React from "../packages/react/react";

function Profile() {
  const [counter, setCounter] = React.useState(10);
  const user = {
    firstName: "helo",
    lastName: "yello",
  };

  return (
    <div>
      <img src="avatar.png" className="profile" />
      <h3>{[user.firstName, user.lastName].join(" ")}</h3>
      <div>
        hrllo<span>yeah</span>
      </div>
      <button
        onClick={() => {
          const newCount = counter + 1;
          setCounter(newCount);
        }}
      >
        change counter: {counter}
      </button>
      <Tag />
    </div>
  );
}

function Tag() {
  return <Button>yasser zaki</Button>;
}

function Button({ children }) {
  return (
    <button className="hello" style={{ backgroundColor: "red" }}>
      {children}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Profile />);
