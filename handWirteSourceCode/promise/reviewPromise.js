function Promise(executor) {
  const self = this

  this.status = 'pending'
  this.value = null
  this.reason = null

  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  function resolve(value) {
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

  executor(resolve, reject)
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new Error('循环引用'))
  }

  let called
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then

      if (typeof then === 'function') {
        then.call(x,
          (y) => {
            if (called) return
            called = true
            resolve(promise, y, resolve, reject)
          },
          (e) => {
            if (called) return
            called = true
            reject(e)
          }
        )
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
  onFulfilled = (typeof onFulfilled === 'function') ? onFulfilled : val => val
  onRejected = (typeof onRejected === 'function') ? onRejected : error => {
    throw error
  }

  let self = this
  let promise = new Promise((resolve, reject) => {
    switch (self.status) {
      case "pending":
        self.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(self.value)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })

        self.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(self.reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        break
      case "rejected":
        try {
          setTimeout(() => {
            let x = onRejected(self.reason)
            resolvePromise(promise, x, resolve, reject)
          }, 0)
        } catch (e) {
          reject(e)
        }
        break
      case "resolved":
        try {
          setTimeout(() => {
            let x = onFulfilled(self.value)
            resolvePromise(promise, x, resolve, reject)
          }, 0)
        } catch (e) {
          reject(e)
        }
        break
    }
  })
  return promise
}

Promise.prototype.catch = function (errFn) {
  return this.then(null, errFn)
}

Promise.prototype.finally = function (fn) {
  return this.then(() => {
      fn()
    },
    () => {
      fn()
    })
}

Promise.resolve = function (value) {
  if (value instanceof Promise) {
    return value
  } else if (value && value.then && typeof value.then === 'function') {
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

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    if (typeof promises !== 'object') {
      reject(new Error("参数类型必须为数组或对象!"))
      return
    }
    let length = promises.length === undefined ? Object.keys(promises).length : promises.length
    if (length === 0) {
      reject(new Error('参数为空'))
      return
    }
    let results = promises.length === undefined ? {} : [];
    let index = 0

    function processData(key, data) {
      results[key] = data
      index++
      if (index === length) {
        resolve(results)
      }
    }

    function checkPromise(curr, key) {
      if (curr && curr.then && typeof curr.then === 'function') {
        try {
          curr.then(data => {
            checkPromise(data, key)
          }, reject)
        } catch (e) {
          reject(e)
        }
      } else {
        processData(key, curr)
      }
    }

    for (let i = 0; i < length; i++) {
      checkPromise(promises[i], i)
    }
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    function checkPromise(curr) {
      if (curr && curr.then && typeof curr.then === 'function') {
        curr.then(data => {
          checkPromise(data)
        }, reject)
      } else {
        resolve(curr)
      }
    }

    for (let i = 0; i < promises.length; i++) {
      checkPromise(promises[i])
    }
  })
}
