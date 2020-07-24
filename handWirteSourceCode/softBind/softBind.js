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
