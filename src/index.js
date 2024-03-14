import ReactDOM from "../packages/reactDom/reactDOM";
import React from "../packages/react/react";

function Profile() {
  const [counter, setCounter] = React.useState(10);
  const [imageSrc, setImageSrc] = React.useState(
    "https://images.dog.ceo/breeds/spaniel-welsh/n02102177_2766.jpg"
  );
  const user = {
    firstName: "helo",
    lastName: "yello",
  };

  const ref = React.useRef(null);

  React.useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random").then((res) =>
      res.json().then((res) => setImageSrc(res.message))
    );
    console.log("this is called");
  }, [counter]);

  return (
    <div>
      <img src={imageSrc} />
      <h3>{[user.firstName, user.lastName].join(" ")}</h3>
      <div>
        hrllo<span>yeah</span>
      </div>
      <button
        onClick={() => {
          ref.current = 12;
          const newCount = counter + 1;
          setCounter(newCount);
        }}
      >
        change counter: {counter}
      </button>
      current doesn't change after rerender: {ref.current ? ref.current : ""}
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
