function create() {
  // 创建一个空对象
  let obj = Object.create(null)
  // 获取构造函数
  let Con = [].shift.call(arguments)
  // 链接到原型
  obj.__proto__ = Con.prototype
  // 绑定this，执行构造函数
  let result = Con.apply(obj, arguments)

  return typeof result === 'object' ? result : obj
}
