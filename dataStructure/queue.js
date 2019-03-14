function Queue() {
    this.dataStore = [];
    this.enqueue = enqueue;
    this.dequeue = dequeue;
    this.front = front;
    this.back = back;
    this.toString = toString;
    this.empty = empty;

    function enqueue(element) {
        this.dataStore.push(element)
    }
    
    function dequeue() {
        //如果是优先队列，此处需要修改为根据dataStore中元素的值的高低来判断优先级，如果优先级相同，就根据先后顺序输出
       return this.dataStore.shift()
    }

    function front() {
        return this.dataStore[0];
    }

    function back() {
        return this.dataStore[this.dataStore.length - 1];
    }

    function toString() {
        var retStr = '';
        for (var i = 0;i<this.dataStore.length; i++){
            retStr +=this.dataStore[i] + "\n";
        }
        return retStr;
    }
    
    function empty() {
        if(this.dataStore.length == 0){
            return true;
        }else {
            return false
        }
    }
}

module.exports = {
    Queue
}