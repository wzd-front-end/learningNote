function Promise(executor) {
  let self = this
  // promise 状态，三种：pending(等待)，resolved(完成)，reject(拒绝)
  self.status = 'pending'
  self.value = null
  self.reason = null
  // 成功回调函数
  self.onFulfilledCallbacks = []
  // 失败回调函数
  self.onRejectedCallbacks = []

  // 调用时将状态改为resolved并将传入值赋值给this.value，遍历执行成功回调数组里面的函数
  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.value = value
      self.onFulfilledCallbacks.forEach(fn => {
        fn()
      })
    }
  }

  // 调用时将状态改为rejected并将传入原因赋值给reason，遍历执行拒绝数组里面的函数
  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.reason = reason
      self.onRejectedCallbacks.forEach(fn => {
        fn()
      })
    }
  }

  executor(resolve, reject)
}

function resolvePromise(promise2, x, resolve, reject) {
  // 确保因为传值错误导致的死循环
  if (promise2 === x) {
    return reject(new TypeError('循环引用'))
  }
  // 确保只走其中某一个分支
  let called
  // 如果x是一个对象，则需要再验证，否则，直接调用传入的resolve返回x值，这样then后面可以再接一个then
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // 获取x上的then方法，如果存在该方法，可将其当作一个promise对象来处理
      let then = x.then
      if (typeof then === 'function') {

        then.call(x, (y) => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, (e) => {
          if (called) return
          called = true
          reject(e)
        })
      } else {
        // 不存在then方法，说明他是一个普通的对象和方法，则直接调用返回promise2的resolve
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // promise2对象的resolve，用于实现链式调用
    resolve(x)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
  onRejected = typeof onRejected === 'function' ? onRejected : err => {
    throw err
  }
  let self = this
  let promise2 = new Promise((resolve, reject) => {
    switch (self.status) {
      case 'resolved':
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
        break
      case 'rejected':
        setTimeout(() => {
          try {
            let x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
        break
      case 'pending':
        self.onFulfilledCallbacks.push(function () {
          setTimeout(() => {
            try {
              let x = onFulfilled(self.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        self.onRejectedCallbacks.push(function () {
          setTimeout(() => {
            try {
              let x = onRejected(self.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        break
    }
  })
  return promise2
}
// catch方法
Promise.prototype.catch = function (errFn) {
  return this.then(null, errFn)
}
// finally方法
Promise.prototype.finally = function (fn) {
  this.then(
    () => {
      fn()
    },
    () => {
      fn()
    }
  )
  return this
}
// all方法
Promise.all = function (promises) {
  // all方法执行后紧跟着then接收参数，所以其实也是一个promise
  return new Promise((resolve, reject) => {
    let length = promises.length === undefined ? Object.keys(promises).length : promises.length
    if (length === 0) {
      reject(new Error('参数为空'))
      return
    }
    let results = promises.length === undefined ? {} : [];
    let index = 0

    function processData(key, data) {
      results[key] = data;
      index++
      if (index === length) {
        resolve(results)
      }
    }

    function checkPromise(i, curr) {
      if (curr && curr.then && (typeof curr.then === 'function')) {
        curr.then(data => {
          return checkPromise(i, data)
        }, reject)
      } else {
        processData(i, curr)
        return
      }
    }

    for (let key in promises) {
      let current = promises[key]
      checkPromise(key, current)
    }
  })
}
// race 方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    function checkPromise(curr) {
      if (curr && curr.then && (typeof curr.then === 'function')) {
        curr.then(data => {
          checkPromise(data)
        }, reject)
      } else {
        resolve(curr)
      }
    }

    for (let i = 0; i < promises.length; i++) {
      let current = promises[i]
      checkPromise(current)
    }
  })
}
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}
Promise.resolve = function (value) {
  if (value instanceof Promise) {
    return value
  } else if (value && value.then && (typeof value.then === 'function')) {
    return new Promise((resolve, reject) => {
      value.then(resolve, reject);
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(value);
    })
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise
