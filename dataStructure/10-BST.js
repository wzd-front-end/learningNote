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
  this.insert = insert

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
  if(!(node === null)){
    postOrder(node.left)
    postOrder(node.right)
    console.log(node.show())
  }
}

function preOrder(node) {
  if (!(node === null)){
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

postOrder(nums.root)


