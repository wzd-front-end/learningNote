/**
 * 无重复最长子字符串
 * 给定⼀一个字符串串，请你找出其中不不含有重复字符的 最⻓长⼦子串串 的⻓长度。
 * 示例例 1：
 * 输⼊入：“abcabcbb”
 * 输出：3
 * 解释：因为⽆无重复字符的最⻓长⼦子串串是 ”abc”，其⻓长度为 3。
 * 示例例 3：
 * 输⼊入：“pwwkew”
 * 输出：3
 * 解释：因为⽆无重复字符的最⻓长⼦子串串是"wke"，其⻓长度为 3。请注意，你的答案必须是 ⼦子串串 的⻓长度，"pwke" 是⼀一个⼦子序列列，不不是⼦子串串。
 * */

// 方法一: 使用数组作为哈希表
function HashTable() {
  this.table = new Array(137);
  this.length = 0
  this.betterHash = betterHash;
  this.put = put;
  this.get = get;
  this.remove = remove;
  this.size = size;

  function betterHash(string) {
    const H = 37;
    var total = 0;
    for (var i = 0; i < string.length; ++i) {
      total += H * total + string.charCodeAt(i);
    }
    total = total % this.table.length;
    return parseInt(total);
  }

  function put(data) {
    var pos = this.betterHash(data);
    this.table[pos] = data;
    this.length++
  }

  function get(key) {
    var pos = this.betterHash(key);
    return this.table[pos]
  }

  function remove(key) {
    var pos = this.betterHash(key);
    this.table[pos] = undefined;
    this.length--
  }

  function size() {
    return this.length
  }
}

// 方法二：使用对象作为哈希表
function HashSet() {
  this.table = {}
  this.put = put;
  this.get = get;
  this.remove = remove;

  function put(key, data) {
    // if(!this.table[key]){
    this.table[key] = data
    // }
  }

  function get(key) {
    return this.table[key]
  }

  function remove(key) {
    return delete this.table[key]
  }
}

function lengthOfLongestSubstring(str) {
  if (typeof str !== "string") {
    return
  }
  var set = new HashTable();
  var max = 0;
  for (var i = 0, j = 0; j < str.length; j++) {
    while (set.get(str[j])) {
      set.remove(str[i])
      i++
    }
    set.put(str[j])
    max = Math.max(max, set.size())
  }
  return max
}

function lengthOfLongestSubstringOptimization(str) {
  if (typeof str !== "string") {
    return
  }
  var set = new HashSet();
  var max = 0, resultStr = '', tempStr = '';
  for (var i = 0, j = 0; j < str.length; j++) {
    if (set.get(str[j])) {
      i = Math.max(i, set.get(str[j]) + 1)
      tempStr = tempStr.substring(tempStr.indexOf(str[j]) + 1)
    }

    set.put(str[j], j);
    tempStr += str[j]
    if (max < (j - i + 1)) {
      max = j - i + 1
      resultStr = tempStr
    }
  }
  return resultStr
}

// console.time()
// lengthOfLongestSubstring('pwwkew')
// console.timeEnd()

console.time()
lengthOfLongestSubstringOptimization('deabcafghi')
console.timeEnd()
