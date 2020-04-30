function instanceofs(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while (true) {
    if (left === null) return false
    if (left === prototype) return true
    left = left.__proto__
  }
}

module.exports = instanceofs

