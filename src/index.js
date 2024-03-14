import ReactDOM from "../packages/reactDom/reactDOM";
import React from "../packages/react/react";

function Todo() {
  const [todos, setTodos] = React.useState(["first todo"]);
  const inputVal = React.useRef("");
  return (
    <div>
      <label title="todo title">
        todo title
        <input
          onChange={(evt) => {
            inputVal.current = evt.target.value;
          }}
        />
      </label>
      <button
        onClick={() => {
          if (!inputVal.current) return;
          setTodos([...todos, inputVal.current]);
        }}
      >
        add todo
      </button>
      <ul>
        {todos.map((el) => {
          return <li>{el}</li>;
        })}
      </ul>
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

ReactDOM.createRoot(document.getElementById("root")).render(<Todo />);
