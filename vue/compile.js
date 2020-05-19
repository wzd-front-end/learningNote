var updater = {
  textUpdater(node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },

  htmlUpdater(node, value) {
    node.innerHTML = typeof value == 'undefined' ? '' : value;
  },

  classUpdater: function (node, value, oldValue) {
    var className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');

    var space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  },

  modelUpdater(node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  }
}

let compileUtil = {
  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },

  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },

  class(node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  bind(node, vm, exp, dir) {
    // 此处是初始化所作，后续的响应式通过添加watcher实例对象添加为Vue对应key值得依赖
    let updaterFn = updater[dir + 'Updater'];
    updaterFn && updaterFn(node, this._getVMVal(vm, exp));
    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },

  model(node, vm, exp) {
    var me = this, val = this._getVMVal(vm, exp);
    me.bind(node, vm, exp, 'model');

    // node.addEventListener('input', e => {
    //   let newValue = e.target.value
    //   if (val === newValue) {
    //     return
    //   }
    //   me._setVMVal(vm, exp, newValue)
    //   val = newValue
    // })
  },
  _getVMVal(vm, exp) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function (k) {
      val = val[k];
    })

    return val;
  },
  _setVMVal(vm, exp, value) {
    let val = vm
    exp = exp.split('.')
    exp.forEach((k, i) => {
      if (i < exp.length - 1) {
        val = val[k];

      } else {
        val[k] = value;
      }
    })
  },
  eventHandler(node, vm, exp, dir) {
    let eventType = dir.split(':')[1]
    let fn = vm.$options.methods && vm.$options.methods[exp]
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment(el) {
    let fragment = document.createDocumentFragment()
    let child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

  init() {
    this.compileElement(this.$fragment)
  }

  compileElement(el) {
    let childNodes = el.childNodes
    let me = this
    Array.prototype.slice.call(childNodes).forEach(node => {
      let text = node.textContent
      let reg = /\{\{(.*)\}\}/

      if (me.isElementNode(node)) {
        this.compile(node)
      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1)
      }
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node)
      }
    })
  }

  compile(node) {
    let nodeAttrs = node.attributes
    let me = this

    Array.prototype.slice.call(nodeAttrs).forEach(attr => {
      let attrName = attr.nodeName
      if (me.isDirective(attrName)) {
        let exp = attr.nodeValue
        let dir = attrName.substring(2)

        // 判断是否是事件指令
        if (me.isEventDirective(dir)) {
          compileUtil.eventHandler(node, me.$vm, exp, dir)
        } else {
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp)
        }
        node.removeAttribute(attrName);
      }
    })
  }

  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp)
  }

  // 判断是否是指令
  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }

  // 判断是否是事件指令
  isEventDirective(dir) {
    return dir.indexOf('on') === 0
  }

  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}
