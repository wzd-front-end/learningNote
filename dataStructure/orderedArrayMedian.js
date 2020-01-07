/**
 *切分法实现寻找两个有序数组的中位数
 * 总结：利用有序数组的特点，可以快速得到两个数组对应的中位数，通过比较两位数字的中位数可以求出目标中位数的范围，通过不断缩小中位数的方法可以提高查询效率
 * 如果是无序数组，那就直接将两个数组合并，快速排序求出中位数
 * */
function findMedianSortedArrays(nums1, nums2) {
  var m = nums1.length;
  var n = nums2.length;

  var k = parseInt((m + n) / 2);
  if ((m + n) % 2 == 1) {
    return findKth(nums1, 0, m - 1, nums2, 0, n - 1, k + 1)
  } else {
    return (findKth(nums1, 0, m - 1, nums2, 0, n - 1, k) + findKth(nums1, 0, m - 1, nums2, 0, n - 1, k + 1)) / 2.0
  }
}

function findKth(nums1, l1, h1, nums2, l2, h2, k) {
  var m = h1 - l1 + 1
  var n = h2 - l2 + 1

  if (m > n) {
    return findKth(nums2, l2, h2, nums1, l1, h1, k)
  }

  if (m == 0) {
    return nums2[l2 + k - 1]
  }

  if (k == 1) {
    return Math.min(nums1[l1], nums2[l2])
  }

  var na = Math.min(parseInt(k / 2), m);
  var nb = k - na;
  var va = nums1[l1 + na - 1];
  var vb = nums2[l2 + nb - 1];
  if (va === vb) {
    return va
  } else if (va < vb) {
    return findKth(nums1, l1 + na, h1, nums2, l2, l2 + nb - 1, k - na)
  } else {
    return findKth(nums1, l1, l1 + na - 1, nums2, l2 + nb, h2, k - nb)
  }
}

console.log(findMedianSortedArrays([1, 6], [2, 3, 4, 5, 7, 8, 9]))
