/* @flow */

import config from '../config'
import Watcher from '../observer/watcher'
import Dep, {pushTarget, popTarget} from '../observer/dep'
import {isUpdatingChildComponent} from './lifecycle'

import {
  set,
  del,
  observe,
  defineReactive,
  toggleObserving
} from '../observer/index'

import {
  warn,
  bind,
  noop,
  hasOwn,
  hyphenate,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isServerRendering,
  isReservedAttribute
} from '../util/index'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initState(vm: Component) {
  // 首先在vm上初始化一个_watchers数组，缓存这个vm上的所有watcher
  vm._watchers = []
  // 获取options,包括在new Vue传入的，同时还包括了Vue所继承的options
  const opts = vm.$options
  // 初始化props属性
  if (opts.props) initProps(vm, opts.props)
  // 初始化methods属性
  if (opts.methods) initMethods(vm, opts.methods)
  // 初始化data属性
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // 初始化computed属性
  if (opts.computed) initComputed(vm, opts.computed)
  // 初始化watch属性
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

function initProps(vm: Component, propsOptions: Object) {
  // propsData用于验证传入参数的类型
  const propsData = vm.$options.propsData || {}
  // 新建_props对象，可以通过vue实例去访问
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  // 新建_propKeys缓存prop的key
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  // 遍历props中所有的key
  for (const key in propsOptions) {
    // 将key值缓存进vm.$options._propKeys
    keys.push(key)
    // 注意这个validateProp方法，不仅完成了prop属性类型验证的，同时将prop的值都转化为了getter/setter
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      // 将这个key对应的值转化为getter/setter
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      // 将data的值代理向_props
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}

function initData(vm: Component) {
  // 获取创建vue传入配置的data属性
  let data = vm.$options.data
  // 判断data类型是否为function，如果是函数，执行函数，并返回结果
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

  // 判断是否为一个对象，否的话就初始为{}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  // 名称重复检测
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 将data的值代理向_data
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  // 创建观察者，做依赖收集，之后的逻辑跟props类似
  observe(data, true /* asRootData */)
}

export function getData(data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  // 传入空的依赖，调用数据获取程序时禁用dep收集
  pushTarget()
  try {
    // 执行data方法并返回结果对象
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}

const computedWatcherOptions = {lazy: true}

function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  // 初始化为一个空对象，并将计算属性的watcher挂载到_computedWatchers
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  // 遍历computed属性
  for (const key in computed) {
    const userDef = computed[key]
    // 判断类型，如果为函数，曾将其当作getter函数处理，如果不是则需要自行定义setter/getter函数
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      // 为计算属性创建内部watcher
      // lazy属性为true
      // 注意这个地方传入得getter函数，实例化的过程中不会去完成依赖收集工作
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    // 已在组件原型上定义组件定义的计算属性。我们只需要在这里定义实例化时定义的计算属性。
    // 检查是否出现过同名属性
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}

export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 不是服务端渲染的情况，需要缓存
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (process.env.NODE_ENV !== 'production' &&
    sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  // 生成计算属性的getter
  return function computedGetter() {
    // 获取对应计算属性的watcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      /**
       * 在watcher存在的情况下，通过watcher判断是否需要重新计算，dirty默认值是this.lazy，
       * 在上一轮的依赖收集的过程中，观察者已经将watcher添加到依赖数组中了，如果观察者发生变化，会触发dep.notify，
       * 通知所有的watcher，斤而触发watcher 的update函数，会将watcher.dirty变为true表明观察者发生变化；
       * 当再次调用computed属性的getter函数的时候便会重新计算，否则还是使用之前缓存的值。
       * 因为我们上面初始化computed的时候，传入的lazy是true，所以其不会触发get()函数进行依赖收集，故初始化下下面的evaluate()会被触发
       * */
      if (watcher.dirty) {
        // 重新调用watcher内部的get函数，并将dirty变为false
        watcher.evaluate()
      }
      // 这里会触发该watcher下所有的dep进行依赖收集
      if (Dep.target) {
        watcher.depend()
      }
      // 返回值
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this)
  }
}

function initMethods(vm: Component, methods: Object) {
  // 初始化方法，主要是检查是否是函数，以及是否重名
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}

function initWatch(vm: Component, watch: Object) {
  // 遍历配置在$options上的watch属性
  for (const key in watch) {
    const handler = watch[key]
    // 判断是否为数组，数组的话需要进行一个遍历
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      // 创建一个watcher依赖
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 判断handler是否为对象，如果为对象，则进行如下操作
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  // 如果类型为string，则其处理函数为methods上的同名函数
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  // 调用vm.$watch创建依赖
  return vm.$watch(expOrFn, handler, options)
}

export function stateMixin(Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {}
  dataDef.get = function () {
    return this._data
  }
  const propsDef = {}
  propsDef.get = function () {
    return this._props
  }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    // 判断cb的类似是否为对象
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    // 创建一个watcher依赖
    const watcher = new Watcher(vm, expOrFn, cb, options)
    // 如果immediate为true，则立刻执行，需要等wacther触发
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn() {
      watcher.teardown()
    }
  }
}
