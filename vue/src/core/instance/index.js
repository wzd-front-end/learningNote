import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
// 将_init方法挂载到Vue.prototype，在该函数中，主要实现各种初始化，后面的Mixin主要是讲对应的功能进行挂载
initMixin(Vue)
// 将$data,$props,$set,$delete,$watch挂载到Vue.prototype
stateMixin(Vue)
// 实现$emit, $on, $off, $once
eventsMixin(Vue)
// 实现_update, $forceUpdate, $destory
lifecycleMixin(Vue)
// _render, $nextTick
renderMixin(Vue)

export default Vue
