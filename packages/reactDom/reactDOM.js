const ReactDOM = {};

function createRoot(element) {
  return {
    render: (root) => {
      console.log(root);
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

ReactDOM.createRoot = createRoot;

export default ReactDOM;
