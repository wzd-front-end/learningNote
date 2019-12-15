//二叉查找树是一种特殊的二叉树，相对较小的值放在左节点，相对较大的值放在右节点，这一特性使得查找效率非常高
function Node(data, left, right) {
  this.data = data
  this.left = left
  this.right = right
  this.show = show
}

function show() {
  return this.data
}

function BST() {
  this.root = null
  this.count = 0
  this.insert = insert
  this.getEdge = getEdge
  this.getMax = getMax
  this.getMin = getMin
  this.find = find
  this.remove = remove

  function insert(data) {
    var n = new Node(data, null, null)
    if (this.root === null) {
      this.root = n
    } else {
      var current = this.root
      var parent;
      while (true) {
        parent = current
        if (data < current.data) {
          current = current.left
          if (current === null) {
            parent.left = n
            break
          }
        } else {
          current = current.right
          if (current === null) {
            parent.right = n
            break
          }
        }
      }
    }
    this.count++
  }

  function getEdge() {
    return (this.count - 1)
  }

  function getMin() {
    var current = this.root
    while (!(current.left === null)) {
      current = current.left
    }
    return current.data
  }

  function getMax() {
    var current = this.root
    while (!(current.right === null)) {
      current = current.right
    }
    return current.data
  }

  function find(data) {
    var current = this.root
    while (current !== null) {
      if (current.data === data) {
        return current
      } else if (data < current.data) {
        current = current.left
      } else if (data > current.data) {
        current = current.right
      }
    }
    return null
  }

  function getSmallest(node) {
    var current = node
    while (!(current.left === null)) {
      current = current.left
    }
    return current
  }

  function remove(data) {
    this.root = removeNode(this.root, data)
    this.count--
  }

  function removeNode(node, data) {
    if (node === null) {
      return null
    }
    if (data === node.data) {
      if (node.left === null && node.right === null) {
        return null
      }
      if (node.left === null) {
        return node.right
      }
      if (node.right === null) {
        return node.left
      }

      var tempNode = getSmallest(node.right)
      node.data = tempNode.data
      node.right = removeNode(node.right, tempNode.data)
      return node

    } else if (data < node.data) {
      node.left = removeNode(node.left, data)
      return node
    } else if (data > node.data) {
      node.right = removeNode(node.right, data)
      return node
    }
  }
}
function inOrder(node) {
  if (!(node === null)) {
    inOrder(node.left)
    console.log(node.show())
    inOrder(node.right)
  }
}

function postOrder(node) {
  if (!(node === null)) {
    postOrder(node.left)
    postOrder(node.right)
    console.log(node.show())
  }
}

function preOrder(node) {
  if (!(node === null)) {
    console.log(node.show())
    preOrder(node.left)
    preOrder(node.right)
  }
}

var nums = new BST();
nums.insert(23);
nums.insert(45);
nums.insert(16);
nums.insert(37);
nums.insert(3);
nums.insert(99);
nums.insert(22);
console.log(nums.count)
console.log(nums.getEdge())
nums.remove(45)
console.log(nums.count)
console.log(nums.getEdge())



