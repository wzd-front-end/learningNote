let Vue

class Store {
  constructor(options = {}) {
    this.state = new Vue({
      data: options.state
    })
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}
    options.getters && this.handleGetters(options.getters)
  }

  // 注意这⾥里里⽤用箭头函数形式，后⾯面actions实现时会有作⽤用
  commit = (type, args) => {
    this.mutations[type](this.state, args)
  }

  dispatch = (type, args) => {
    this.actions[type](
      {
        commit: this.commit,
        state: this.state
      },
      args
    )
  }

  handleGetters(getters) {
    this.getters = {}
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state)
        }
      })
    })
  }
}

function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
