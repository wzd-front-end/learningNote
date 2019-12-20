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
 * @param  {[type]} num   [获取第n个数]
 * @return {[type]} num     [返回对应的数值]
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
 * @param  {[type]} num   [获取第n个数]
 * @return {[type]} num     [返回对应的数值]
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
