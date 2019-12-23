/**
 * 动态规划
 * 所谓动态规划，其实是和递归相反的思路，递归我们一般实现是从上往下递归，从顶部开始将问题分解，通过解决掉所有分解出小问题的方式，来解决整个问题，
 * 这过程中会产生很多浪费，比如说：斐波那契数列，存在很多重复几过的过程，recurFib(4) = recurFib (3) + recurFib(2) = recurFib(2) + (1) + recurFib(2)
 * 这个过程中，recurFib是被重复执行两次的，这就是递归效率低的原因；
 * 而使用动态规划，他是自底向上的思路，从底部开始解决问题，将所有小问题解决掉，然后合并成一个整体解决方案，从而解决掉整个大问题。
 * 动态规划方案通常会使用一个数组来建立一张表，用于存放被分解成众多子问题的
 * 下面以斐波那契数列作为例子分析
 */

/**
 * [recurFib description] 斐波那契数列，递归实现
 * @param  {[num]}  n  [获取第n个数]
 * @return {[num]}     [返回对应的数值]
 */
function recurFib(n) {
  if (n === 1) {
    return 0
  } else if (n === 2) {
    return 1
  } else {
    return recurFib(n - 1) + recurFib(n - 2)
  }
}

// console.time()
// recurFib(45)
// console.timeEnd()
// 测试案例：default: 7373.518ms


/**
 * [recurFib description] 斐波那契数列，动态规划
 * @param  {[num]}  n  [获取第n个数]
 * @return {[num]}     [返回对应的数值]
 */
function dynFib(n) {
  var val = []
  for (var i = 0; i <= n; i++) {
    val[i] = 0;
  }
  if (n === 1) {
    return 0
  } else if (n === 2) {
    return 1
  } else {
    val[1] = 0
    val[2] = 1
    for (var i = 3; i <= n; i++) {
      val[i] = val[i - 1] + val[i - 2]
    }
    return val[n]
  }
}

// console.time()
// dynFib(45)
// console.timeEnd()
// 测试案例：default: 0.066ms

/**
 * [lcs description] 寻找最长公共子串，动态规划
 * @param  {[str]} word1  [单词1]
 * @param  {[str]} word2  [单词2]
 * @return {[str]}        [返回最长公共字符串]
 */

function lcs(word1, word2) {
  var max = 0
  var index = 0
  var lcsarr = new Array(word1.length + 1)
  for (var i = 0; i < word1.length + 1; i++) {
    lcsarr[i] = new Array(word2.length + 1)
    for (var j = 0; j < word2.length + 1; j++) {
      lcsarr[i][j] = 0
    }
  }
  for (var i = 0; i <= word1.length; i++) {
    for (var j = 0; j <= word2.length; j++) {
      if (i === 0 || j === 0) {
        lcsarr[i][j] = 0
      } else {
        if (word1[i - 1] === word2[j - 1]) {
          lcsarr[i][j] = lcsarr[i - 1][j - 1] + 1
        } else {
          lcsarr[i][j] = 0
        }
      }
      if (max < lcsarr[i][j]) {
        max = lcsarr[i][j]
        index = i
      }
    }
  }

  var str = ''
  console.log(index)
  console.log(max)
  if (max === 0) {
    return str
  } else {
    for (var i = index - max; i < index; i++) {
      str += word1[i]
    }
    return str
  }
}

// console.log(lcs('测试公共字符串', '我测不测还不知道，现实是前半部分，现在可以测试公共字符串，测试完毕'))

function max(a, b) {
  return (a > b) ? a : b;
}

function dKnapsack(capacity, size, value, n) {
  var K = [];
  for (var i = 0; i <= n; i++) {
    K[i] = [];
  }
  for (var i = 0; i <= n; i++) {
    for (var w = 0; w <= capacity; w++) {
      if (i == 0 || w == 0) {
        K[i][w] = 0;
      } else if (size[i - 1] <= w) {
        K[i][w] = max(value[i - 1] + K[i - 1][w - size[i - 1]], K[i - 1][w]);
      } else {
        K[i][w] = K[i - 1][w];
      }
    }
  }
  console.log(K);
  return K[n][capacity];
}

var value = [4, 5, 10, 11, 13];
var size = [3, 4, 7, 8, 9];
var capacity = 16;
var n = 5;
console.log(dKnapsack(capacity, size, value, n));

