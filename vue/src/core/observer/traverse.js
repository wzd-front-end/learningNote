/* @flow */

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 * 递归地遍历一个对象以调用所有转换的getter，以便将对象中的每个嵌套属性收集为“深层”依赖项
 */

export function traverse (val: any) {
  // 递归深度遍历子属性
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  // 如果子属性不是数组也不是对象，或者子属性被冻结，或者是虚拟节点类型，直接返回
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  // 判断属性是否做过依赖收集
  if (val.__ob__) {
    // 如果做个依赖的收集，获取该值的观察者obverser中dep的id,
    const depId = val.__ob__.dep.id
    // 防止重复收集
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  // 数组的话遍历，触发子属性的getter，深度监听
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    // 对象遍历，触发子属性的getter，深度监听
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
