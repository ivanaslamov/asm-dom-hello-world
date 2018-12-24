var recycler = {
  create: function create(name) {
    name = name.toUpperCase();
    var list = recycler.nodes[name];
    if (list !== undefined) {
      var node = list.pop();
      if (node !== undefined) return node;
    }
    return document.createElement(name);
  },
  createNS: function createNS(name, ns) {
    name = name.toUpperCase();
    var list = recycler.nodes[name + ns];
    if (list !== undefined) {
      var _node = list.pop();
      if (_node !== undefined) return _node;
    }
    var node = document.createElementNS(ns, name);
    node.asmDomNS = ns;
    return node;
  },
  createText: function createText(text) {
    var list = recycler.nodes['#text'];
    if (list !== undefined) {
      var node = list.pop();
      if (node !== undefined) {
        node.nodeValue = text;
        return node;
      }
    }
    return document.createTextNode(text);
  },
  createComment: function createComment(comment) {
    var list = recycler.nodes['#comment'];
    if (list !== undefined) {
      var node = list.pop();
      if (node !== undefined) {
        node.nodeValue = comment;
        return node;
      }
    }
    return document.createComment(comment);
  },
  collect: function collect(node) {
    // clean
    var i = void 0;

    // eslint-disable-next-line
    while (i = node.lastChild) {
      node.removeChild(i);
      recycler.collect(i);
    }

    i = node.attributes !== undefined ? node.attributes.length : 0;

    while (i--) {
      node.removeAttribute(node.attributes[i].name);
    }

    node.asmDomVNode = undefined;

    if (node.asmDomRaws !== undefined) {
      node.asmDomRaws.forEach(function (raw) {
        node[raw] = undefined;
      });
      node.asmDomRaws = undefined;
    }

    if (node.asmDomEvents !== undefined) {
      Object.keys(node.asmDomEvents).forEach(function (event) {
        node.removeEventListener(event, node.asmDomEvents[event], false);
      });
      node.asmDomEvents = undefined;
    }

    if (node.nodeValue !== null && node.nodeValue !== '') {
      node.nodeValue = '';
    }

    Object.keys(node).forEach(function (key) {
      if (key[0] !== 'a' || key[1] !== 's' || key[2] !== 'm' || key[3] !== 'D' || key[4] !== 'o' || key[5] !== 'm') {
        node[key] = undefined;
      }
    });

    // collect
    var name = node.nodeName;
    if (node.asmDomNS !== undefined) name += node.namespaceURI;
    var list = recycler.nodes[name];
    if (list !== undefined) list.push(node);else recycler.nodes[name] = [node];
  },

  nodes: {}
};

var nodes = { 0: null };
var lastPtr = 0;

var addPtr = function addPtr(node) {
  if (node === null) return 0;
  if (node.asmDomPtr !== undefined) return node.asmDomPtr;
  nodes[++lastPtr] = node;
  node.asmDomPtr = lastPtr;
  return lastPtr;
};

var _domApi = {
  'addNode': function addNode(node) {
    addPtr(node.parentNode);
    addPtr(node.nextSibling);
    return addPtr(node);
  },
  'createElement': function createElement(tagName) {
    return addPtr(recycler.create(tagName));
  },
  'createElementNS': function createElementNS(namespaceURI, qualifiedName) {
    return addPtr(recycler.createNS(qualifiedName, namespaceURI));
  },
  'createTextNode': function createTextNode(text) {
    return addPtr(recycler.createText(text));
  },
  'createComment': function createComment(text) {
    return addPtr(recycler.createComment(text));
  },
  'createDocumentFragment': function createDocumentFragment() {
    return addPtr(document.createDocumentFragment());
  },
  'insertBefore': function insertBefore(parentNodePtr, newNodePtr, referenceNodePtr) {
    nodes[parentNodePtr].insertBefore(nodes[newNodePtr], nodes[referenceNodePtr]);
  },
  'removeChild': function removeChild(childPtr) {
    var node = nodes[childPtr];
    if (node === null || node === undefined) return;
    var parent = node.parentNode;
    if (parent !== null) parent.removeChild(node);
    recycler.collect(node);
  },
  'appendChild': function appendChild(parentPtr, childPtr) {
    nodes[parentPtr].appendChild(nodes[childPtr]);
  },
  'removeAttribute': function removeAttribute(nodePtr, attr) {
    nodes[nodePtr].removeAttribute(attr);
  },
  'setAttribute': function setAttribute(nodePtr, attr, value) {
    // xChar = 120
    // colonChar = 58
    if (attr.charCodeAt(0) !== 120) {
      nodes[nodePtr].setAttribute(attr, value);
    } else if (attr.charCodeAt(3) === 58) {
      // Assume xml namespace
      nodes[nodePtr].setAttributeNS('http://www.w3.org/XML/1998/namespace', attr, value);
    } else if (attr.charCodeAt(5) === 58) {
      // Assume xlink namespace
      nodes[nodePtr].setAttributeNS('http://www.w3.org/1999/xlink', attr, value);
    } else {
      nodes[nodePtr].setAttribute(attr, value);
    }
  },
  // eslint-disable-next-line
  'parentNode': function parentNode(nodePtr) {
    var node = nodes[nodePtr];
    return node !== null && node !== undefined && node.parentNode !== null ? node.parentNode.asmDomPtr : 0;
  },
  // eslint-disable-next-line
  'nextSibling': function nextSibling(nodePtr) {
    var node = nodes[nodePtr];
    return node !== null && node !== undefined && node.nextSibling !== null ? node.nextSibling.asmDomPtr : 0;
  },
  'setNodeValue': function setNodeValue(nodePtr, text) {
    nodes[nodePtr].nodeValue = text;
  }
};

window.asmDomHelpers = {};
window.asmDomHelpers.domApi = _domApi;
window.asmDomHelpers.nodes = nodes;
