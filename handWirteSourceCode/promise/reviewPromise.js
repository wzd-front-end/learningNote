function Promise(executor) {
  let self = this
  self.status = 'pending'
  self.value = null
  self.reason = null
  self.onFulfilledCallbacks = []
  self.onRejectedCallbacks = []

  function resovle(value) {
    self.status = 'resolved'
    self.value = value
    self.onFulfilledCallbacks.forEach(fn => {
      fn()
    })
  }

  function reject(reason) {
    self.status = 'rejected'
    self.reason = reason
    self.onRejectedCallbacks.forEach(fn => {
      fn()
    })
  }

  executor(resovle, reject)
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new Error('循环引用'))
  }

  let called

  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    try {
      let then = x.then

      if (typeof then === 'function') {
        then.call(x, (y) => {
              if (called) return
              called = true
              resolvePromise(promise, y, resolve, reject)
            },
            (e) => {
              if (called) return
              called = true
              reject(e)
            })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
  onRejected = typeof onRejected === 'function' ? onRejected : err => {
    throw err
  }
  let self = this
  let promise = new Promise((resolve, reject) => {
    switch (self.status) {
      case "resolved":
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
        break
      case "rejected":
        setTimeout(() => {
          try {
            let x = onRejected(self.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
        break
      case "pending":
        self.onFulfilledCallbacks.push(function () {
          setTimeout(() => {
            try {
              let x = onFulfilled(self.value)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        self.onRejectedCallbacks.push(function () {
          setTimeout(() => {
            try {
              let x = onRejected(self.reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }, 0)
        break
    }

  })

  return promise
}

Promise.prototype.catch = function (errFn) {
  return this.then(null, errFn)
}

Promise.prototype.finally = function (fn) {
  this.then(
      () => {
        fn()
      },
      () => {
        fn()
      }
  )
}

Promise.prototype.race = function (promises) {
  return new Promise((resolve, reject) => {
    function checkPromise(curr) {
      if (curr && curr.then && typeof curr.then === 'function') {
        curr.then(
            data => {
              checkPromise(data)
            },
            reject
        )
      }

    }

    for (let i = 0; i < promises.length; i++) {
      let current = promises[i]
      checkPromise(current)
    }
  })
}

Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    let length = promises.length === undefined ? Object.keys(promises).length : promises.length
    if (length === 0) {
      reject(new Error('参数为空'))
      return
    }
    let results = promises.length === undefined ? {} : []
    let index = 0

    function processData(key, data) {
      results[key] = data
      index++
      if (index === length) {
        resolve(results)
      }
    }

    function checkPromise(i, curr) {
      if (curr && curr.then && typeof curr.then === 'undefined') {
        curr.then(
            data => {
              checkPromise(data)
            },
            reject
        )
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

Promise.resolve = function (value) {
  if (value instanceof Promise) {
    return Promise
  } else if (value && value.then && (typeof value.then === 'function')) {
    return new Promise((resolve, reject) => {
      value.then(resolve, reject)
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}


module.exports = Promise
