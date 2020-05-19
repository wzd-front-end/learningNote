class Vue {
  constructor(options) {
    this.$options = options || {}
    this._data = this.$options.data

    let data = this.$options.data
    Object.keys(data).forEach(key => {
      this._proxyData(key)
    })
    this._initComputed()
    // 订阅者
    this.observe(data)

    // 编译
    this.$compile = new Compile(options.el || document.body, this)

  }

  _proxyData(key) {
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get: () => {
        return this._data[key]
      },
      set: (newVal) => {
        this._data[key] = newVal
      }
    })
  }

  _initComputed() {
    let me = this
    let computed = this.$options.computed

    if (typeof computed === 'object') {
      Object.keys(computed).forEach(key => {
        Object.defineProperty(me, key, {
          configurable: false,
          enumerable: true,
          get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
          set: typeof computed[key] === 'object' ? computed[key].set : () => {
          }
        })
      })
    }
  }

  observe(value) {
    if (!value || typeof value !== 'object') return
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key])
    })
  }

  defineReactive(data, key, val) {
    this.observe(val)
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set: (newVal) => {
        if (val === newVal) return
        val = newVal
        this.observe(newVal)
        dep.notify()
      }
    })
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  // 优化移除不需要监听的依赖，防止已经移除的变量继续被更新
  removeDep(dep) {
    let index = this.deps.indexOf(dep)
    if (index !== -1) {
      this.deps.splice(index, 1)
    }
  }

  notify() {
    this.deps.forEach(dep => {
      dep.update()
    })
  }
}
