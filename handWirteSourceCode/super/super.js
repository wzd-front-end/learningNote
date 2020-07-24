Object.prototype.mySuper = function () {
  var caller = arguments.callee.caller, name
  // 找出父类构造方法
  for(var i in this){
    if(this[i] === caller){
      name = i
      break
    }
  }
  var __proto = this.__proto__ || this.constructor.prototype
  try{
    return __proto[name].apply(this, arguments)
  } catch (e) {
    alert(name + ' is undefined.');
  }
}
