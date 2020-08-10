const flatten = function (arr) {
  while (arr.some(item => Array.isArray(item))){
    // arr = Array.prototype.concat.apply([], arr)
    arr = [].concat(...arr)
  }
  return arr
}
