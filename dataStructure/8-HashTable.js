// 散列方式：除留余数法

function HashTable() {
  this.table = new Array(137);
  this.simpleHash = simpleHash;
  this.betterHash = betterHash;
  this.showDistro = showDistro;
  this.buildChains = buildChains;
  this.put = put;
  this.get = get;

  this.buildChains()

  function simpleHash(data) {
    var total = 0;
    for (var i = 0; i < data.length; ++i) {
      total += data.charCodeAt(i);
    }
    return total % this.table.length;
  }

  function betterHash(string) {
    const H = 37;
    var total = 0;
    for (var i = 0; i < string.length; ++i) {
      total += H * total + string.charCodeAt(i);
    }
    total = total % this.table.length;
    return parseInt(total);
  }

  function showDistro() {
    var n = 0;
    for (var i = 0; i < this.table.length; ++i) {
      if (this.table[i][0] != undefined) {
        console.log(i + ": " + this.table[i]);
      }
    }
  }

  function buildChains() {
    for (var i = 0; i < this.table.length; ++i) {
      this.table[i] = new Array();
    }
  }

  // 开链法解决冲突
  function put(key, data) {
    var pos = this.betterHash(key);

    var index = 0;
    while (this.table[pos][index] !== undefined) {
      index++
    }
    this.table[pos][index] = key
    this.table[pos][++index] = data
  }

  function get(key) {
    var pos = this.betterHash(key)
    var index = 0
    var len = this.table[pos].length
    if (len > 0) {
      while (this.table[pos][index] !== key && index <= (len - 1)) {
        index += 2
      }
      if (index >= (len - 1)) {
        return undefined
      }
      return this.table[pos][index + 1]
    } else {
      return undefined
    }
  }

  // 线性探测法，也叫开方寻址散列，遇到冲突找下一项存储，下一项有值，再找下一项，以此类推
  // 有个公式，当存储数据长度了数据的1.5倍的时候，使用开链法，但是两倍或者两倍以上的时候，使用线性探测法
}

var hTable = new HashTable();

var someNames = [
  {name: 'mike', tel: 15914705367},
  {name: 'chenjie', tel: 15521063830},
  {name: 'lilee', tel: 13286823223},
]
for (var i = 0; i < someNames.length; i++) {
  hTable.put(someNames[i].name, someNames[i].tel)
}
hTable.showDistro()
console.log(hTable.get('mike'))
