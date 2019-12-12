//集合Set结构的特点，无序，且不重复，但彼此之间又有一定相关性的成员构成的；在数学上集合是用一个大括号括起来的
// 下面是一些使用集合时必须了解的定义。
// • 不包含任何成员的集合称为空集，全集则是包含一切可能成员的集合。
// • 如果两个集合的成员完全相同，则称两个集合相等。
// • 如果一个集合中所有的成员都属于另外一个集合，则前一集合称为后一集合的子集。
// 对集合的操作：并集，交集，补集

function Set() {
  this.dataStore = [];
  this.add = add;
  this.remove = remove;
  this.size = size;
  this.union = union;
  this.intersect = intersect;
  this.subset = subset;
  this.difference = difference;
  this.show = show;

  function add(data) {
    if (this.dataStore.indexOf(data) < 0) {
      this.dataStore.push(data)
      return true
    } else {
      return false
    }
  }

  function remove(data) {
    var pos = this.dataStore.indexOf(data)
    if (pos > -1) {
      this.dataStore.splice(pos, 1)
      return true
    } else {
      return false
    }
  }

  function show() {
    return this.dataStore
  }

  function contains(data) {
    if (this.dataStore.indexOf(data) > -1) {
      return true
    } else {
      return false
    }
  }

  function union(set) {
    var tempSet = new Set();
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
      tempSet.add(this.dataStore[i])
    }
    for (var i = 0, len = set.length; i < len; i++) {
      if (!tempSet.contains(set.dataStore[i])) {
        tempSet.add(set.dataStore[i])
      }
    }
    return tempSet
  }

  function intersect(set) {
    var tempSet = new Set();
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
      if (set.contains(this.dataStore[i])) {
        tempSet.add(this.dataStore[i])
      }
    }
    return tempSet
  }

  function subset(set) {

  }
}
