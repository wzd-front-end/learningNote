function List() {
    this.listSize = 0;
    this.pos = 0;
    this.dataStore = [];
    this.clear = clear;
    this.find = find;
    this.toString = toString();
    this.insert = insert;
    this.append = append;
    this.remove = remove;
    this.front = front;
    this.end = end;
    this.prev = prev;
    this.next = next;
    this.length = length;
    this.currPos = currPos;
    this.moveTo = moveTo;
    this.getElement = getElement;
    this.length = length;
    this.contains = contains;

    //队列的末尾追加一个元素
    function append(element) {
        this.dataStore[this.listSize++] = element;
    }

    //删除队列中指定索引元素
    function remove(element) {
        var foundAt = this.find(element);
        if (foundAt > -1) {
            this.dataStore.splice(foundAt, 1);
            this.listSize--;
            return true;
        }
        return false;
    }

    //查找某一项元素的索引
    function find(element) {
        for (var i = 0; i < this.dataStore.length; i++) {
            if (this.dataStore[i] === element) {
                return i;
            }
        }
        ;
        return -1;
    }

    //返回队列的长度
    function length() {
        return this.listSize;
    }

    //
    function toString() {

    }

    //向列表中插入一个元素
    function insert(element, after) {
        var insertPos = this.find(after);
        if (insertPos > -1) {
            this.dataStore.splice(insertPos + 1, 0, element);
            ++this.listSize;
            return true;
        }
        return false;
    }

    //清空列表所有的元素
    function clear() {
        delete this.dataStore;
        this.dataStore = [];
        this.listSize = this.pos = 0;
    }

    //判断给定的值是否在列表中
    function contains(element) {
        for (var i = 0; i < this.dataStore.length; i++) {
            if (this.dataStore[i] == element) {
                return true;
            }
        }
        return false;
    }

    function front() {
        this.pos = 0;
    }

    function end() {
        this.pos = this.listSize - 1;
    }

    function prev() {
        if (this.pos > 0) {
            this.pos--;
        }
    }

    function next() {
        if (this.pos < this.listSize - 1) {
            ++this.pos;
        }
    }

    function currPos() {
        return this.pos;
    }

    function moveTo(position) {
        this.pos = position;
    }

    function getElement() {
        return this.dataStore[this.pos];
    }
}






















