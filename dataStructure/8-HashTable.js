// 散列方式：除留余数法

function HashTable() {
  this.table = new Array(137);
  this.simpleHash = simpleHash;
  this.betterHash = betterHash;
  this.showDistro = showDistro;
  this.put = put;

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
    total = total % arr.length;
    return parseInt(total);
  }

  function showDistro() {
    var n = 0;
    for (var i = 0; i < this.table.length; ++i) {
      if (this.table[i] != undefined) {
        print(i + ": " + this.table[i]);
      }
    }
  }

  function put(data) {
    var pos = this.simpleHash(data);
    this.table[pos] = data
  }

}
