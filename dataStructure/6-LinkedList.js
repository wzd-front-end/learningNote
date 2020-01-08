//基于对象的链表
//Node类表示节点，包含节点的信息
//LinkedList类提供插入节点、删除节点、显示列表元素的方法

//Node类
function Node(element) {
  this.element = element;
  this.next = null;
  this.previous = null;//修改完双向链表
}

//LinkedList类
function LList() {
  this.head = new Node("head");
  this.find = find;
  this.findLast = findLast;
  this.insert = insert;
  this.findPrevious = findPrevious;
  this.remove = remove;
  this.display = display;
  this.dispReverse = dispReverse;

  function find(item) {
    var currNode = this.head;

    while (currNode.element != item) {
      currNode = currNode.next;
    }

    return currNode;
  }

  function insert(newElement, item) {
    var newNode = new Node(newElement);
    var current = this.find(item);

    newNode.next = current.next;
    newNode.previous = current;//双向链表元素前置值设置
    current.next = newNode;
  }

  function display() {
    var currNode = this.head;
    while (!(currNode.next == null)) {
      console.log(currNode.next.element);
      currNode = currNode.next;
    }
  }

  function findPrevious(item) {
    var currNode = this.head;
    while (!(currNode.next == null) && (currNode.next.element != item)) {
      currNode = currNode.next;
    }
    return currNode;
  }

  function remove(element) {
    // var prevNode = this.findPrevious(element);//该句用于解决单向链表删除值得方法
    var currentNode = this.find(element);

    if (!(currentNode == null)) {
      currentNode.previous.next = currentNode.next;
      currentNode.next.previous = currentNode.previous;
      currentNode.next = null;
      currentNode.previous = null;
    }
    // if(!(prevNode.next == null)){
    //     prevNode.next = prevNode.next.next;//该句用于解决单向链表删除值得方法
    // }
  }

  function findLast() {
    var currNode = this.head;
    while (!(currNode.next == null)) {
      currNode = currNode.next;
    }
    return currNode;
  }

  function dispReverse() {
    var currNode = this.findLast();
    while (!(currNode.previous == null)) {
      console.log(currNode.element)
      currNode = currNode.previous;
    }
  }

}

var cities = new LList();
cities.insert("Conway", "head");
cities.insert("Russellvielle", "Conway");
cities.insert("test", "Russellvielle")
cities.insert("Alma", "test");

console.log("删除前链表")
cities.display();
cities.remove("test");
console.log("删除后链表");
cities.display();
console.log("链表反向打印");
cities.dispReverse();

//循环链表，实际是将head一直传递下去，使得最后一项的next 指向head









