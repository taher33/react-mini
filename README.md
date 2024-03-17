# react-mini

quick and simple implementation of react js and react dom packages, this is for learning purposes

# getting started

run `npm init` since we would need some deps later

create scr folder, this is where we would create the code for react-mini
inside it create an entry point for it index.js and write the same react code you usually write

```
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

ReactDOM.createRoot(document.getElementById("root")).render(<Todo />);
```

in order for the browser to understand this code we will use babel to transpile the jsx into regular js, we install it with some deps: `npm i -D @babel/cli @babel/core @babel/plugin-transform-react-jsx`

we add some config for it in the package.json file

```
"babel": {
    "presets": [],
    "plugins": [
      [
        "@babel/plugin-transform-react-jsx",
        {
          "throwIfNamespace": false,
          "runtime": "automatic",
          "importSource": "../packages/jsx"
        }
      ]
    ]
}
```

add a script to run the babel code transformation in the package.json `"build": "babel src -d dist"`

copy past the actual implementation for react-mini in the root of your project, so this file (packages)[https://github.com/taher33/react-mini/tree/main/packages]

create an html file and add a script and a div of id root that we can target

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <style>
    .bg {
      background-color: rgb(99, 99, 99);
    }
  </style>

  <body class="bg">
    <div id="root"></div>
    <script src="dist/index.js" type="module"></script>
  </body>
</html>
```

the script is of type module so we need a server for it

```
const http = require("http");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1"; // localhost
const port = 3000; // You can use any available port number

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  let contentType = "text/html"; // Default content type

  // Check if the requested file is a JavaScript file
  if (path.extname(filePath) === ".js" || path.extname(filePath) === "") {
    contentType = "application/javascript"; // Set content type to JavaScript
  }
  if (path.extname(filePath) === "") filePath = filePath + ".js";

  // Check if the requested file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
      return;
    }

    // Read the file and serve it
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading file: ${err}`);
        return;
      }

      // Serve the file with the appropriate content type
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    });
  });
});

server.listen(port, hostname, () => console.log("server is running"));
```

add a script to run the server and transform the code using babel `"dev": "npm run build && node server.js"`

run `npm run dev` and your app should be up and running in `http://localhost:3000`
