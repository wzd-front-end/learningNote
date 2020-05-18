class Vue {
  constructor(options) {
    this.$options = options || {}
    this._data = this.$options.data

    let data = this.$options.data
    Object.keys(data).forEach(key => {
      this._proxyData(key)
    })
    this.observe(data)
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

  observe(value) {
    if (!value || typeof value !== 'object') return
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key])
    })
  }
  defineReactive(data, key, val) {
    this.observe(val)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        return val
      },
      set: (newVal) => {
        if(val === newVal) return
        val = newVal
        this.observe(newVal)
      }
    })
  }

}