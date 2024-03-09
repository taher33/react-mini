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
