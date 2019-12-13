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
  this.contains = contains;
  this.union = union;
  this.intersect = intersect;
  this.subset = subset;
  this.difference = difference;
  this.higher = higher;
  this.lower = lower;
  this.show = show;

  function add(data) {
    if (this.dataStore.indexOf(data) < 0) {
      // 增加排序算法
      var len = this.size()
      if (len <= 0) {
        this.dataStore.unshift(data)
      } else {
        for (var i = 0; i < len; i++) {
          if (i === (len - 1)) {
            if (data > this.dataStore[i]) {
              this.dataStore.push(data)
            } else {
              this.dataStore.splice(i, 0, data)
            }
            return true
          } else {
            if (this.dataStore[i] > data) {
              this.dataStore.splice(i, 0, data)
              return true
            } else {
              continue
            }
          }
        }
      }
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

  function contains(data) {
    if (this.dataStore.indexOf(data) > -1) {
      return true
    } else {
      return false
    }
  }

  function show() {
    return this.dataStore
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
    if (this.size() > set.size()) {
      return false
    } else {
      for (var i = 0, len = this.dataStore.length; i < len; i++) {
        if (!set.contains(this.dataStore[i])) {
          return false
        }
      }
    }
    return true
  }

  function difference(set) {
    var tempSet = new Set()
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
      if (!set.contains(this.dataStore[i])) {
        tempSet.add(this.dataStore[i])
      }
    }
    return tempSet
  }

  function size() {
    return this.dataStore.length
  }

  function higher(element) {
    if (element >= this.dataStore[(this.dataStore.length - 1)]) {
      return false
    }
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
      if (this.dataStore[i].toLocaleUpperCase() > element.toLocaleUpperCase()) {
        return this.dataStore[i]
      }
    }
  }

  function lower(element) {
    if (element <= this.dataStore[0]) {
      return false
    }
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
      if (this.dataStore[i].toLocaleUpperCase() >= element.toLocaleUpperCase()) {
        return this.dataStore[i - 1]
      }
    }
  }
}

var it = new Set();

it.add("Jennifer");
it.add("Danny");
it.add("Jonathan");
it.add("Terrill");
it.add("Raymond");
it.add("Mike");
it.add("Cynthia");
it.add("Clayton");


console.log(it.lower('N'))

