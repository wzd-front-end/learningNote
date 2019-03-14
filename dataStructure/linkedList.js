//基于对象的链表
//Node类表示节点，包含节点的信息
//LinkedList类提供插入节点、删除节点、显示列表元素的方法

//Node类
function Node(element) {
    this.element = element;
    this.next =null;
}

//LinkedList类
function LList() {
    this.head = new Node("head");
    this.find = find;
    this.insert = insert;
    this.findPrevious = findPrevious;
    this.remove = remove;
    this.display = display;

    function find(item) {
        var currNode = this.head;
        
        while (currNode.element != item){
            currNode = currNode.next;
        }

        return currNode;
    }
    
    function insert(newElement, item) {
        var newNode = new Node(newElement);
        var  current = this.find(item);

        newNode.next = current.next;
        current.next = newNode;
    }
    
    function display() {
        var currNode = this.head;
        while (!(currNode.next == null)){
            console.log(currNode.next.element);
            currNode = currNode.next;
        }
    }

    function findPrevious(item) {
        var currNode = this.head;
        while (!(currNode.next == null) && (currNode.next.element != item)){
            currNode = currNode.next;
        }
        return currNode;
    }

    function remove(element) {
        var prevNode = this.findPrevious(element);
        if(!(prevNode.next == null)){
            prevNode.next = prevNode.next.next;
        }
    }


}

var cities = new LList();
cities.insert("Conway", "head");
cities.insert("Russellvielle", "Conway");
cities.insert("test","Russellvielle")
cities.insert("Alma", "test");

console.log("删除前链表")
cities.display();
cities.remove("test");
console.log("删除后链表");
cities.display();











