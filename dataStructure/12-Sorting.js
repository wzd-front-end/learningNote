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
* 数据量小于一百的时候，选择选择排序
* 插入是因为内部第二个循环不会像选择和冒泡，按部就班执行循环完毕，而是可能简单比较少数，使得循环次数较少；
* 尽管插入排序最快，但随着数据量增加，效率逐渐变差，测试在数量100以上6000以下效率较满意
* 6000以上的数据量，希尔排序的优势就体现出来了
*
*
* */

function CArray() {
  this.dataStore = [];
  this.pos = 0;
  this.gaps = [5, 3, 1];
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
  this.insertionSort = insertionSort;
  // 希尔排序
  this.setGaps = setGaps;
  this.shellSort = shellSort;
  this.dynamicShellSort = dynamicShellSort;

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


  //希尔排序
  function setGaps(arr) {
    this.gaps = arr;
  }

  function shellSort() {
    for (var g = 0; g < this.gaps.length; ++g) {
      for (var i = this.gaps[g]; i < this.dataStore.length; i++) {
        var temp = this.dataStore[i]
        for (var j = i; j >= this.gaps[g] && this.dataStore[j - this.gaps[g]] > temp; j -= this.gaps[g]) {
          this.dataStore[j] = this.dataStore[j - this.gaps[g]]
        }
        this.dataStore[j] = temp;
      }
    }
  }

  function dynamicShellSort() {
    var N = this.dataStore.length
    var h = 1
    while (h < N / 3) {
      h = 3 * h + 1
    }
    while (h >= 1) {
      for (var i = h; i < N; i++) {
        for (var j = i; j >= h && this.dataStore[j - h] > this.dataStore[j]; j -= h) {
          this.swap(this.dataStore, j, j - h)
        }
      }
      h = (h - 1) / 3
    }
  }

  //归并排序
  function b() {

  }


  //快速排序
  function c() {

  }

  //堆排序
  function d() {

  }
}

var numElements = 100000;
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

// console.log("插入排序：")
// console.time()
// myNums.insertionSort()
// console.timeEnd()

console.log("希尔排序：")
console.time()
myNums.setGaps([701, 301, 132, 57, 23, 10, 4, 1])
myNums.shellSort()
console.timeEnd()

// console.log("动态希尔排序：")
// console.time()
// myNums.dynamicShellSort()
// console.timeEnd()
