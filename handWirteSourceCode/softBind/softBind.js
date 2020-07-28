// 软绑定的关键点在于，如果this存在，则说明其同过其他方式调用，包括隐式调用和显式调用
if(!Function.prototype.softBind){
  Function.prototype.softBind = function (obj) {
    var fn = this
    var args = Array.prototype.slice.call(arguments, 1)

    var bound = function () {
      return fn.apply(
        (!this || this === (window || global)) ? obj : this,
        args.concat.apply(args, arguments)
      )
    }
    bound.prototype = Object.create(fn.prototype)
    return bound
  }
}
