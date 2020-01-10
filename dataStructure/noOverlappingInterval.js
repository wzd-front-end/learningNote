/**
 * 给定⼀一个区间的集合，找到需要移除区间的最⼩小数量量，使剩余区间互不不重叠。
 *[noOverlappingInterval 无重复区间]
 * @param  {[array]} interval [需要去除重叠的区间，该值为一个二维数组]
 * @return {[array]}      [合并后的结果，该值为一个二维数组]
 */
function eraseOverlappingInterval(intervals) {
  if (intervals.length === 0) {
    return 0
  }
  // 对传入二维数组按照第一个元素进行排序，即区间的左边界
  intervals.sort(function (a, b) {
    return a[0] - b[0]
  })

  var end = intervals[0][1], count = 0
  for (var i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      end = Math.min(end, intervals[i][1])
      count++
    } else {
      end = intervals[i][1];
    }
  }

  return count
}

console.log(eraseOverlappingInterval([[1, 2], [2, 3], [3, 4], [1, 3]]))
