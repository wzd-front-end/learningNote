class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    this.getter = this.parseGetter(key.trim())

    // 缓存该值是为了对比是否变化以决定是否实行更新操作
    this.value = this.executeGet()
  }

  executeGet() {
    Dep.target = this
    // 触发对应key的get属性，触发对应的依赖收集
    let value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  update() {
    let value = this.executeGet()
    let oldValue = this.value
    if (value !== oldValue) {
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  }

  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) {
      return
    }
    let exps = exp.split('.')
    return function (obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return
        obj = obj[exps[i]];
      }
      return obj;
    }
  }
}
