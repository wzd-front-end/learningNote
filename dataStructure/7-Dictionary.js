
function 7() {
    this.dataStore = new Array();
    this.add = add;
    this.find = find;
    this.remove = remove;
    this.showAll =showAll;
    this.count = count;
    this.clear = clear;



    function add(key, value) {
        this.dataStore[key] = value;
    }

    function find(key) {
        return this.dataStore[key];
    }

    function remove(key) {
        delete this.dataStore[key]
    }

    function showAll() {

        for(var key of Object.keys(this.dataStore).sort()){
            console.log(key + "->" + this.dataStore[key]);
        }
    }

    function count() {
        var n = 0;
        for(var key in Object.keys(this.dataStore)){
            ++n;
        }
        return n;
    }

    function clear() {
        var keys = Object.keys(this.dataStore);
        for(var key of keys){
            delete this.dataStore[key];
        }
    }

}
var pbook = new 7();
pbook.add("Mike","123");
pbook.add("David", "345");
pbook.add("Cynthia", "456");
console.log("David's extension: " + pbook.find("David"));
pbook.remove("David");
pbook.showAll();
console.log(pbook.count());
pbook.clear();
pbook.showAll();
