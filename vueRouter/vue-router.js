let Vue;

class VueRouter {
  constructor(options) {
    this.$options = options
    this.routeMap = {}
    this.app = new Vue({
      data: {
        current: '/'
      }
    })
  }

  init() {
    this.bindEvents()
    this.createRouteMap(this.$options)
    this.initComponent()
  }

  bindEvents() {
    window.addEventListener("load", this.onHashChange.bind(this), false)
    window.addEventListener("hashchange", this.onHashChange.bind(this), false)
  }

  onHashChange() {
    this.app.current = window.location.hash.slice(1) || '/'
  }

  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item
    })
  }

  initComponent() {
    Vue.component("router-link", {
      props: {
        to: String
      },
      render(h) {
        return h('a', {
          attrs: {
            href: '#' + this.to
          }
        }, [
          this.$slots.default
        ])
      }
    })
    Vue.component("router-view", {
      // 改为箭头函数是为了获取外部的routeMap
      render: h => {
        var component = this.routeMap[this.app.current].component
        return h(component)
      }
    })
  }

}
VueRouter.install = function (_Vue, options) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate(){
      if(this.$options.router){
        Vue.prototype.$router = this.$options.router
        this.$options.router.init()
      }
    }
  })
}
