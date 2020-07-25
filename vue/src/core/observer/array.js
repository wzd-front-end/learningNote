/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'
// 获取数组原型方法
const arrayProto = Array.prototype
// 创建空对象，作为增加拦截后的结果
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 缓存数组原型上的方法
  const original = arrayProto[method]
  // 使用defineProperty重新定义同名方法
  def(arrayMethods, method, function mutator (...args) {
    // 执行数组默认原型上的方法，缓存返回值
    const result = original.apply(this, args)
    // 获取数组上的观察者Observer
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 新增项增加Observer观察者监听
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 触发更新
    ob.dep.notify()
    return result
  })
})
