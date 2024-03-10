import ReactDOM from "../packages/reactDom/reactDOM";
function Profile() {
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    text here <span>text here 222</span>
  </div>
);
