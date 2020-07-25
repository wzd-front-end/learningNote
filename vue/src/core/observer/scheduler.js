/* @flow */

import type Watcher from './watcher'
import config from '../config'
import { callHook, activateChildComponent } from '../instance/lifecycle'

import {
  warn,
  nextTick,
  devtools,
  inBrowser,
  isIE
} from '../util/index'

export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
export let currentFlushTimestamp = 0

// Async edge case fix requires storing an event listener's attach timestamp.
let getNow: () => number = Date.now

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  const performance = window.performance
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = () => performance.now()
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  // 获取当前时间戳
  currentFlushTimestamp = getNow()
  // 将刷新状态修改为ture表示正在进行刷新
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // 在刷新前先对队列进行排序
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  //    组件从父级更新到子级。（因为父项总是在子项之前创建）
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  //    一个组件的user watchers 在其render watcher之前被运行，因为user watchers 在render watcher之前被创建
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  //    如果组件在父组件的监视程序运行期间被破坏， 它的观察者可以被跳过。
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    // 会触发组件的beforeUpdate钩子函数
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    // 该watcher已被执行，将调度队列里的对应id置为null
    has[id] = null
    // 执行watcher的run方法，触发watcher的回调函数
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  // 重置调度队列状态
  resetSchedulerState()

  // call component updated and activated hooks
  // 调用组件更新并激活挂钩
  callActivatedHooks(activatedQueue)
  // 触发组件的updated钩子函数
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated')
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent (vm: Component) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  // 在此处将“_inactive”设置为false，以便渲染函数可以依赖于检查它是否在不活动树中
  vm._inactive = false
  activatedChildren.push(vm)
}

function callActivatedHooks (queue) {
  // 遍历队列，将_inactive设置为true，并activateChildComponent激活子组件，内部触发activated钩子函数
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
// 使用nextTick调用flushScheduleQueue，可以将刷新队列的操作变为异步操作
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 防止重复队列
  if (has[id] == null) {
    has[id] = true
    // 如果没有在刷新，则将watcher添加到队列中
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // 如果已经刷新，根据其id拼接watcher
      // if already past its id, it will be run next immediately.
      // 如果已经超过了它的id，它将立即运行。
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      // 触发异步刷新调度队列
      nextTick(flushSchedulerQueue)
    }
  }
}
