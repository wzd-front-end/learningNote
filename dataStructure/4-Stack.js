function 3() {
    this.dataStore = [];
    this.top = 0;
    this.push = push;
    this.pop = pop;
    this.peek = peek;
    this.clear = clear;
    this.length = length;

    function push(element) {
        return this.dataStore[this.top++] = element;
    }

    function pop() {
        return this.dataStore[--this.top];
    }

    function peek() {
        return this.dataStore[this.top-1]
    }

    function length() {
        return this.top;
    }

    function clear() {
        this.dataStore = [];
        this.top = 0;
    }
}

