helloo everyone, today let's try building a library that looks similar to reactjs in order to understand how it really works under the hood

first thing is that react doesn't work with jsx, jsx is a completely different project so react doesn't really understand in it so a transpiler must come in to save us, enter (babel)[https://babeljs.io/docs/] I don't want to use a library or a framework and be forced to write something like this

```
import { jsx as _jsx } from "react/jsx-runtime";
function App() {
  const [count, setCount] = useState(0);
  return /*#__PURE__*/_jsx("a", {
    href: "#"
  });
}
```

babel will transform the jsx for us (maybe we will build babel our selves too next??)

so let's configure that first

here they are

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

and I have a script to run babel

`"build": "babel src -d dist"`

so the input would be:

```
function Profile() {
  const user = {
    firstName: "helo",
    lastName: "yello",
  };
  return (
    <div>
      <img src="avatar.png" className="profile" />
      <h3>{[user.firstName, user.lastName].join(" ")}</h3>
    </div>
  );
}

```

and the output would look like:

```
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
    })]
  });
}
```

so you can see that all html elements are turned into function calls for `jsx` or `jsxs`

now when running the file it wouldn't complain about not understanding the `>` token since it's not valid js

ok transpilation is done and we are back into js land but what about the imports from `jsx-runtime` we don't have that set yet so let's build it

first let's create a packages folder and this is where we will put the logic for react-mini

in the jsx folder let's create the jsx runtime and export the functions the code needs

```
export function jsx(tag, props, children) {
  console.log({ tag, props, children });
}
export function jsxs(tag, props, children) {
  console.log("hello", { tag, props, children });
}
```

just logging the arguments for now

doing this you'll run into problems trying to import into the index.js since it's not a module so let's set the script tag in our html

```
<script src="dist/index.js" type="module"></script>
```

but just opening this html file will throw a CORS error, I know right this thing just can't stop making our lives miserable
to fix this we need a server to serve this html, let's create server.js and put this gpt code inside:

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
      console.log({ err, pathext: path.extname(filePath) });
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

server.listen(port, hostname, () => console.log("port going brrr"));

```

you can see in line 16 that I'm checking for an empty extensions and that is because of this `import { jsx as _jsx } from "../packages/jsx/jsx-runtime";`
the import doesn't have the "js" extension and that is causing 404 errors so for now this is a quick and dirty fix until I find out how it's done for something like vite or next.js

I use this script to run it `"dev": "npm run build && node server.js"` transpile the jsx and run the server

##ReactDOM
