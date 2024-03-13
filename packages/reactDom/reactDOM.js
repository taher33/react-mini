const ReactDOM = {};

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

ReactDOM.createRoot = createRoot;

export default ReactDOM;
