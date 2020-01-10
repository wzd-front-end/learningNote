/**
 * 合并区间
 *[mergeInterval 合并区间]
 * @param  {[array]} interval [需要合并的区间，该值为一个二维数组]
 * @return {[array]}      [合并后的结果，该值为一个二维数组]
 * 附：另外的一种解题思路，可用栈的思想来解决，通过比较栈顶来做出入栈
 */
function mergeInterval(interval) {
  if (!interval instanceof Array) {
    return
  }
  // 对传入二维数组按照第一个元素进行排序，即区间的左边界
  interval.sort(function (a, b) {
    return a[0] - b[0]
  })
  var previous = null, result = []
  console.log('初始值：',interval)
  interval.forEach(function (current) {
    if (previous === null) {
      previous = current
    } else if (current[0] > previous[1]) {
      result.push(previous)
      previous = current
    } else if (current[0] <= previous[1]) {
      previous[1] = Math.max(previous[1], current[1])
    }
  })
  result.push(previous)
  console.log('合并值：',result)
}
// 合并区间测试案例
mergeInterval([[2, 6], [1, 5], [1, 3], [15, 18], [8, 19]])
















