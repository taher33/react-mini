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

let's create a folder inside packages and this would hold our ReactDOM implementation, react doesn't care about the UI so it can be used for anything, examples are react native react ink and the most known react dom

reactDom cares about displaying to the browser so let's build that first

```
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
```

this is from a react project so let's try to mimic that

```
const ReactDOM = {};

function createRoot(element) {
  return {
    render: (root) => {
      console.log(root);
    },
  };
}


ReactDOM.createRoot = createRoot;

export default ReactDOM;

```

and let's import this inside our component

```
ReactDOM.createRoot(document.getElementById("root")).render(
  <App/>
);
```

after doing this and running the program it would log undefined for the root but that's because our jsx handling functions don't return anything yet

remember our transpiled code would look like this

```
ReactDOM.createRoot(document.getElementById("root")).render(
  jsx(App,{})
);
```

so let's fix that quickly

```
export function jsx(tag, props) {
  return {
    tag,
    props,
  };
}
export function jsxs(tag, props) {
  return {
    tag,
    props,
  };
}
```

I don't do anything fancy for now I just return whatever I receive

after running the code, the render function would log this

```
{
  tag:App,
  children:{}
}
```

but this isn't very useful to us, the function components have their own implantation so for now let's ignore them, I just want to show something in the browser

```
ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    text here <span>text here 222</span>
  </div>
);
```

this would be simpler to handle and we won't any logic for functional or class components

the log for render function would become

```
{
  "tag": "div",
  "props": {
      "children": [
          "text here ",
          {
              "tag": "span",
              "props": {
                  "children": "text here 222"
              }
          }
      ]
  }
}
```

this is more useful to us and we can use it to create dom elements in the browser, so let's add more logic in the render function

```
function createRoot(element) {
  return {
    render: (root) => {
      let newEl;
      if (!root.tag) {
        newEl = document.createTextNode(root);
      } else {
        newEl = document.createElement(root.tag);
      }
      walkTree(root.props.children, newEl);
      document.body.insertBefore(newEl, element);
    },
  };
}

function walkTree(children, parentEl) {
  if (Array.isArray(children)) {
    children.forEach((el) => {
      if (!el.tag) {
        //since no tag is given it's just text
        parentEl.appendChild(document.createTextNode(el));
      } else {
        const newEl = document.createElement(el.tag);
        walkTree(el.props.children, newEl);
        parentEl.appendChild(newEl);
      }
    });
    return;
  }
  if (!children.tag) {
    //since no tag is given it's just text
    parentEl.appendChild(document.createTextNode(children));
  } else {
    const newEl = document.createElement(children.tag);
    walkTree(children.tag.props.children, newEl);
    parentEl.appendChild(newEl);
  }
}

```

render now creates the root dom node then calls to walkTree function to traverse the children and creates the dom elements for each child and appends them to their correspondent parent recursively

running the code, will put the dom elements inside our browser for us to see, and congrats we got stuff displaying.

# functional components

in this section I'll try to handle functional components since they don't seem to be working for now

one thing that you'll notice after logging the result from jsx function for functional components is that we get the function signature so we can just call it and it'll return it's children whatever they are and we can just shove them inside the walkTree for it to process, some changes need to be made tho

let's ads logic to check if the tag is a function

```
if (typeof children.tag === "function") {
    const functionCallRes = children.tag(children.props);
    walkTree(functionCallRes.props.children, newEl);
    return;
}
```

we just call the function and it would return to us what we need, we use a the children.props for the function since it does expect it if the components receives props

and let's updates the render function so it doesn't blow up if the root is a functional component

```
render: (root) => {
  const newEl = document.createElement("div");
  walkTree(root, newEl);

  document.body.insertBefore(newEl, element);
}
```

we can also add support for the `style` prop for our elements so we can add styles in the future, the code for it is pretty straight forward

```
if (children.props.style) {
  Object.keys(children.props.style).forEach((key) => {
    newEl.style[key] = children.props.style[key];
  });
}
```

this is for the case where we create a dom element, so here:

```
if (!children.tag) {
  //since no tag is given it's just text
  parentEl.appendChild(document.createTextNode(children));
} else {
  const newEl = document.createElement(children.tag);

  if (children.props.style) {
    Object.keys(children.props.style).forEach((key) => {
      newEl.style[key] = children.props.style[key];
    });
  }
  walkTree(children.props.children, newEl);
  parentEl.appendChild(newEl);
}
```
