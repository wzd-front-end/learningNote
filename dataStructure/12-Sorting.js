/*
* 100个数据排序测试时间结果：
* 冒泡排序：
* default: 0.572ms
* 选择排序：
* default: 0.435ms
* 插入排序：
* default: 0.204ms
*
* 1000个数据排序测试时间结果：
* 冒泡排序：
* default: 4.127ms
* 选择排序：
* default: 3.692ms
* 插入排序：
* default: 0.267ms
*
* 10000个数据排序测试时间结果：
* 冒泡排序：
* default: 129.949ms
* 选择排序：
* default: 64.435ms
* 插入排序：
* default: 21.605ms
*
* 总结：综上所述，基本排序算法中，插入排序最快，次之是选择排序，最慢的是冒泡排序；
* 选择和冒泡的时间复杂度相近，主要产生差异是因为选择是在最后时刻做的交换，而冒泡则需要不断地交换；
* 插入是因为内部第二个循环不会像选择和冒泡，按部就班执行循环完毕，而是可能简单比较少数，使得循环次数较少；
*
* */

function CArray() {
  this.dataStore = [];
  this.pos = 0;
  this.numElements = numElements;
  this.insert = insert;
  this.toString = toString;
  this.clear = clear;
  this.setData = setData;
  this.swap = swap;
  // 冒泡排序
  this.bubbleSort = bubbleSort;
  // 选择排序
  this.selectionSort = selectionSort;
  // 插入排序
  this.insertionSort = insertionSort
  for (var i = 0; i < numElements; ++i) {
    this.dataStore[i] = i;
  }

  function setData() {
    for (var i = 0; i < this.numElements; ++i) {
      this.dataStore[i] = Math.floor(Math.random() * (this.numElements + 1));
    }
  }

  function clear() {
    for (var i = 0; i < this.dataStore.length; ++i) {
      this.dataStore[i] = 0;
    }
  }

  function insert(element) {
    this.dataStore[this.pos++] = element;
  }

  function toString() {
    var retstr = "";
    for (var i = 0; i < this.dataStore.length; ++i) {
      retstr += this.dataStore[i] + " ";
      if (i > 0 & i % 10 == 0) {
        retstr += "\n";
      }
    }
    return retstr;
  }

  function swap(arr, index1, index2) {
    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }

  // 冒泡排序，是最慢得排序算法之一
  function bubbleSort() {
    var numElements = this.dataStore.length
    for (var outer = numElements; outer >= 2; --outer) {
      for (var inner = 0; inner < outer - 1; ++inner) {
        if (this.dataStore[inner] > this.dataStore[inner + 1]) {
          this.swap(this.dataStore, inner, inner + 1)
        }
      }
      // console.log(this.toString())
    }
  }

  // 选择排序
  function selectionSort() {
    var min, numElements = this.dataStore.length
    for (var outer = 0; outer < numElements - 1; ++outer) {
      min = outer
      for (var inner = outer + 1; inner <= numElements - 1; inner++) {
        if (this.dataStore[inner] < this.dataStore[min]) {
          min = inner
        }
      }
      if (min != outer) {
        swap(this.dataStore, outer, min)
      }
      // console.log(this.toString())
    }
  }

  // 插入排序
  function insertionSort() {
    var temp, inner, numElements = this.dataStore.length
    for (var outer = 1; outer <= numElements - 1; outer++) {
      temp = this.dataStore[outer]
      inner = outer
      while (inner > 0 && this.dataStore[inner - 1] >= temp) {
        this.dataStore[inner] = this.dataStore[inner - 1]
        --inner
      }
      this.dataStore[inner] = temp
      // console.log(this.toString())
    }

  }
}

var numElements = 100;
var myNums = new CArray(numElements);
myNums.setData();
// console.log("冒泡排序：")
// console.time()
// myNums.bubbleSort()
// console.timeEnd()

// console.log("选择排序：")
// console.time()
// myNums.selectionSort()
// console.timeEnd()

console.log("插入排序：")
console.time()
myNums.insertionSort()
console.timeEnd()




