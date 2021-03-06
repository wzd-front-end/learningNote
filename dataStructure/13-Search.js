// 自组织数据是对顺序检索的优化，根据“80-20 原则”，即我们80%的搜索都是在搜索20%的数据，
// 因此，为了让我们的目标数据更快被检索到，我们可以常用的数据放在前20%，这里需要用到交换的原则
// 数据量小的时候因为做数据位置交换会产生时间损耗，当但数据量大的时候，会有明显的优化查询时间
// 请注意，seqSearch() 函数的执行速度比内置的Array.indexof() 方法慢

function seqSearch(arr, data) {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] == data) {
      if (i > Math.floor(arr.length * 0.2)) {
        swap(arr, i, i - Math.floor(arr.length * 0.2));
      }
      return true;
    }
  }
  return false;
}

function swap(arr, index, index1) {
  var temp = arr[index];
  arr[index] = arr[index1];
  arr[index1] = temp;
}

// 二分查找算法，条件是有序的
function binSearch(arr, data) {
  var upperBound = arr.length - 1;
  var lowerBound = 0;
  while (lowerBound <= upperBound) {
    var mid = Math.floor((lowerBound + upperBound) / 2)
    if (arr[mid] > data) {
      upperBound = mid - 1
    } else if (arr[mid] < data) {
      lowerBound = mid + 1
    } else {
      return mid
    }
  }
  return -1
}

// 统计重复次数
function count(arr, data) {
  var count = 0
  var position = binSearch(arr, data)
  if (position > -1) {
    ++count
    for (var i = position - 1; i > 0; i--) {
      if (arr[i] === data) {
        ++count
      } else {
        break
      }
    }
    for (var i = position + 1; i < arr.length; i++) {
      if (arr[i] === data) {
        ++count
      } else {
        break
      }
    }
  }
  return count
}

var numbers = [5, 1, 7, 4, 2, 10, 9, 3, 6, 8];
// console.log(numbers);
console.time()
for (var i = 1; i < 1000; i++) {
  seqSearch(numbers, 8);
  // console.log(numbers);
}
console.timeEnd()
