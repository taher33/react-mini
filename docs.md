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

## ReactDOM

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

## react package

now that we got rendering to the screen, let's get to the real meat of react and try to implement some hooks

# useState

<!-- todo: update the dan abramove quote -->

useState is the bread and butter of UI development, like dan said "UI is a function of state" or something like that I can't really remember

ok what is the useState hook then?? well looking at the code for it `const [counter, setCounter] = React.useState(10);` it's just a function that takes the initial state and returns a tuple, first element is just the value for the state, second element is the function to update the state and cause a rerender

so let's try to implement that:

```
function useState(initialState) {
  let state = initialState;
  function dispatch(newState) {
    state = newState;
    //rerender
  }

  const tuple = [initialState, dispatch];

  return tuple;
}
```

rerendering is just removing the old elements from the dom and inserting the new ones, insert part is done already in the render function now we just need to remove the dom elements and call the render function with the correct arguments and rerendering should be done. But Taher you might say react doesn't blow up the whole app for a state update and you are correct react does handle updates better by updating only the parts that are effected by the state change, this is exciting to implement but for now I just want to build a counter not a stripe website

so let's see how we can do it:

```
function rerenderApp(element, root, appElement) {
  return () => {
    appElement.remove();
    createRoot(element).render(root);
  };
}

function createRoot(element) {
  return {
    render: (root) => {
      const newEl = document.createElement("div");
      walkTree(root, newEl);
      document.body.insertBefore(newEl, element);

      ReactDOM.rerender = rerenderApp(element, root, newEl);
    },
  };
}
```

rerenderApp is a function that returns a function so that we can set the needed params for rendering and removing elements from the dom, so the parent element for our app is removed from dom and render just repaints to the screen, easy simple and quick to implement

let's create a counter then in our elements

```
function Profile() {
  const [counter, setCounter] = React.useState(10);

  return (
    <div>
      <button
        onClick={() => {
          const newCount = counter + 1;
          setCounter(newCount);
        }}
      >
        change counter: {counter}
      </button>
    </div>
  );
}
```

looks like any counter ever written in react so let's run it

<!-- todo: add an image maybe -->

running this and clicking the change counter button won't change anything in the browser, and that's to be expected since the variables are just getting reset on every render, so we need to keep track of the states

```
const stateMap = {
  states: [],
  calls: -1,
};

function useState(initialState) {
  const callId = ++stateMap.calls;

  if (stateMap.states[callId]) {
    return stateMap.states[callId];
  }

  function dispatch(newState) {
    stateMap.states[callId][0] = newState;
    //rerender
    stateMap.calls = -1;
    ReactDOM.rerender();
  }

  const tuple = [initialState, dispatch];
  stateMap.states[callId] = tuple;

  return tuple;
}
```

so we are keeping track of two things, the states which is an array of tuples first element is the state value second is the update state function, calls is just to keep track of the index of the state that we are trying to get

in first render the states array is empty so we fill it up by the tuples that we create and we keep track of them plus the callId

after updating the state we call dispatch this will update the state with the correct callId then reset the calls number (will explain in a sec why) and rerender the whole app, rerendering the app will call useState again so it would `const callId = ++stateMap.calls;` so if we don't reset calls before rerender calls would be increasing endlessly and would just try to access a state that doesn't exist, so by resetting calls we would have access to the correct state

so let's save and try to rerun the counter again

nothing would happen cause I forgot to implement `onClick` in our react dom, sorry

```
if (children.props.onClick) {
  newEl.addEventListener("click", children.props.onClick);
}
```

we add this inside the case where we handle dom elements so the walk function would like this

```
function walkTree(children, parentEl) {
  if (!children) return;
  if (Array.isArray(children)) {
    children.forEach((el) => {
      if (!el.tag) {
        //since no tag is given it's just text
        parentEl.appendChild(document.createTextNode(el));
      } else {
        walkTree(el, parentEl);
      }
    });
    return;
  }

  if (typeof children.tag === "function") {
    walkTree(children.tag(children.props), parentEl);
    return;
  }

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
    if (children.props.onClick) {
      newEl.addEventListener("click", children.props.onClick);
    }
    walkTree(children.props.children, newEl);
    parentEl.appendChild(newEl);
  }
}
```

let's try running the counter again

<!-- todo: add an image or a video -->

and boom state is updating in the screen

# useRef

useRef is just useState without the returning the dispatch function so we can reuse most of the logic

```
function useRef(initialState) {
  const callId = ++stateMap.calls;

  if (stateMap.states[callId]) {
    return stateMap.states[callId];
  }

  stateMap.states[callId] = { current: initialState };

  return stateMap.states[callId];
}
```

I don't create the dispatch function for useRef since we don't need it, I set the state to an object and return that, this worked for me when updating the current it would actually update the states array and wouldn't do something weird it's the difference between returning just the value or a reference to the object

```
const ref = React.useRef(null);
console.log("ref", ref.current);
```

the ref.current value will be preserved after rerenders, but no implementation of the ref prop for dom elements yet

# useEffect

this hook will be simple after implementing useState since it uses the same trick of keeping track of states (in this case dependency arrays) in an object that won't be destroyed after rerender

so let's implement it:

```
React.useEffect(() => {
  console.log("this is called");
}, []);
```

this is a simple use case for useEffect and we can see that it takes two arguments, first one is a callback and second is the dependency array

```
function useEffect(cb, depArr) {
  if (!depArr) throw new Error("you don't want this buddy");

  const callId = ++depMap.calls;
  const prevDeps = depMap.deps[callId];

  if (
    !prevDeps ||
    depArr.length !== prevDeps.length ||
    depArr.some((value, id) => {
      return value !== prevDeps[id];
    })
  ) {
    cb();
    depMap.deps[callId] = depArr;
  }
}
```

you can tell that I'm a better software dev than the whole react team since I do tell you that you must specify the dep array for useEffect lol, I added that cause I thought it was funny that's all

we keep track of the prev dep arrays in this object

```
const depMap = {
  deps: [],
  calls: -1,
};
```

same way with the states tracking, we check if the prevDeps are there or not, if they are not then this is the first render and we should run the effect call back and we register the deps for the next renders, if there is any change the deps from the previous ones then we fire the call back and update the deps that we are tracking

<!-- todo: still yet to do the cleanup function -->

and there we have it, functioning useEffect hook so let's use it to do the only useful thing for this hook, fetching dog images

```
React.useEffect(() => {
  fetch("https://dog.ceo/api/breeds/image/random").then((res) =>
    res.json().then((res) => setImageSrc(res.message))
  );
  console.log("this is called");
}, [counter]);
```

every time we change the counter we fetch a random dog image and put it inside the imageSrc state

```
<img src={imageSrc} />
```

we are setting the image src to the state, and update our ReactDOM logic so it sets the scr attribute for image tags

```
if (children.tag === "img" && children.props.src) {
  newEl.src = children.props.src;
}
```

and there we have it ever time we update the the counter we see a new dog image
