Function.prototype.binds = function (context) {
  if (typeof this !== 'function') {
    return new TypeError('Error')
  }

  var _this = this
  var args = [...arguments].splice(1)

  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    } else {
      return _this.call(context, ...args, ...arguments)
    }
  }
}
