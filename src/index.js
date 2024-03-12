import ReactDOM from "../packages/reactDom/reactDOM";
import "./styles.css";
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
