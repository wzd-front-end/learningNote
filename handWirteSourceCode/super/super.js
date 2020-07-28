Object.prototype.mySuper = function () {
  // arguments.callee：返回正在执行得函数本身得引用
  // .caller返回的是调用该函数得函数
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
