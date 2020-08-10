class Vue {
  constructor(options) {
    this.$options = options || {}
    let data = this._data = this.$options

    // 将属性绑定到对象上
    Object.keys(data).forEach(key => {
      this._proxyData(key)
    })
    // 监听属性
    observer(data)
    this.$compiler = new Compiler(this.$options.el || document.body, this)
  }

  _proxyData(key) {

  }
}

function observer(value) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)

}

class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.convert(key, data[key])
    })
  }

  convert(key, value) {
    this.defineReactive(this.data, key, value)
  }

  defineReactive(data, key, value) {
    // 新建依赖收集器
    let dep = new Dep()
    // 递归进行数据监听
    let childObj = observer(value)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get() {
        if (dep.target) {
          dep.depend()
        }
        return value
      },
      set(newVal) {
        if (newVal !== value) {
          value = newVal
          childObj = observer(newVal)
          dep.notify()
        }
      }
    })
  }
}
let uid = 0

class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }
  depend() {
    Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

Dep.target = null

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.depIds = {}

    this.getter = typeof expOrFn === 'function' ? expOrFn : this.parserGetter(expOrFn.trim())
    this.value = this.get()
  }
  get() {
    Dep.target = this
    let value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  run() {
    let value = this.get()
    let oldValue = this.value
    if (value !== oldValue) {
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  }

  addDep(dep) {
    if (!this.depIds[dep.id]) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }

  upadte() {
    this.run()
  }

  parserGetter(exp) {
    if (/[^\w$]/.test(exp)) return

    let exps = exp.split(".")

    return function (obj) {
      for (let i = 0; i < exps.length; i++) {
        if (obj === null || obj === undefined) return
        obj = obj[exps[i]]
      }
      return obj
    }
  }
}

class Compiler {
  constructor(el, vm) {
    this.vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }
  node2Fragment(el) {
    let fragment = document.createDocumentFragment, child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

  init() {
    this.compile(this.$fragment)
  }

  compile(el) {
    let childNodes = el.childNodes
    let self = this
    Array.prototype.slice.call(childNodes).forEach(node => {
      let text = node.textContent
      let reg = /\{\{(.*)\}\}/

      if (self.isElementNode(node)) {
        self.compileElement(node)
      } else if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, RegExp.$1)
      }

      if (node && node.childNodes && node.childNodes.length) {
        self.Compiler(node)
      }
    })
  }

  compileElement(node) {
    let nodeAttrs = node.attributes, self = this;

    [].slice.call(nodeAttrs).forEach(attr => {
      let attrName = attr.name
      if (self.isDirective(attrName)) {
        var exp = attr.value
        var dir = attrName.substring(2)
        if (self.isEventDirective(dir)) {
          compileUtil.eventHandle(node, self.vm, dir, exp)
        } else {
          compileUtil[dir] && compileUtil[dir](node, self.vm, exp)
        }

        node.removeAttribute(attrName)
      }
    })
  }

  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp)
  }

  isDirective(attr) {
    return attr.indexOf('v-') === 0;
  }

  isEventDirective(attr) {
    return attr.indexOf("on") === 0
  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isTextNode(node) {
    return node.nodeType === 3
  }
}
let compileUtil = {
  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },

  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },

  class(node, vm, exp) {
    this.bind(node, vm, exp, 'class');
  },

  bind(node, vm, exp, dir) {
    var updaterFn = updater[dir + 'Updater'];

    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    new Watcher(vm, exp, function(value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },

  eventHandle(node, vm, dir, exp) {
    let eventType = dir.split(":")[1]
    let fn = vm.$options.methods && vm.$options.methods[exp]
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },

  _getVMVal(vm, exp) {
    let val = vm
    exp = exp.split(".")
    for(let i = 0; i < exp.length; i++) {
      val = val[exp[i]]
    }
    return val
  },

  model(node, vm, exp) {
    let self = this
    let val = this._getVMVal(vm, exp)

    self.bind(node, vm, exp, 'model')

    node.addEventListener('input', function (e) { 
      let newValue = e.target.value
      if(val === newValue){
        return;
      }
      self._setVMVal(vm, exp, newValue);
      val = newValue;
     })
  },
  _setVMVal(vm, exp, value) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function (k, i) {
        if(i < exp.length - 1){
            val=val[k];

        }else {
            val[k] = value;
        }
    });
  }
}
var updater = {
  textUpdater: function (node, value) {
      node.textContent = typeof value == 'undefined' ? '' : value;
  },

  htmlUpdater: function (node, value) {
      node.innerHTML = typeof value == 'undefined' ? '' : value;
  },
  
  classUpdater: function (node, value, oldValue) {
      var className =node.className;
      className = className.replace(oldValue,'').replace(/\s$/,'');

      var space = className && String(value) ? ' ' : '';
      node.className = className + space + value;
  },

  modelUpdater: function (node, value, oldValue) {
      node.value = typeof value == 'undefined' ? '' : value;
  }
}