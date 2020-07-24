function Promise(executor) {
  var self = this
  self.status = 'pending'
  self.value = ''
  self.reason = ''
  self.onFulfilledCallbacks = []
  self.onRejectedCallbacks = []

  function resolve(value) {
    self.value = value
    self.status = 'resolved'
    self.onFulfilledCallbacks.forEach(fn => {
      fn()
    })
  }

  function reject(reason) {
    self.reason = reason
    self.status = 'rejected'
    self.onRejectedCallbacks.forEach(fn => {
      fn()
    })
  }

  executor(resolve, reject)
}

function resolvePromise(x, promise, resolve, reject) {
  if (x === promise) {
    return reject(throw new Error('循环引用'))
  }

  let called = false
  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, (y) => {
            if (called) return
            called = true
            resolvePromise(y, promise, resolve, reject)
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
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => {
  }
  onRejected = typeof onRejected === 'function' ? onRejected : (e) => {
    throw e
  }
  var self = this
  var promise = new Promise(function (resolve, reject) {
    switch (self.status) {
      case "resolved":
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(x, promise, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        break
      case "rejected":
        setTimeout(() => {
          try {
            let x = onRejected(self.reason)
            resolvePromise(x, promise, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        break
      case "pending":
        self.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(self.value)
              resolvePromise(x, promise, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        self.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(self.reason)
              resolvePromise(x, promise, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        break
    }
  })
  return promise
}
Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    let length = promises.length ? promises.length : Object.keys(promises).length
    if (length === 0) {
      reject(throw new Error("参数为空"))
      return
    }
    let results = promises.length ? [] : {}
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
        curr.then(data => {
          checkPromise(data)
        }, reject)
      } else {
        processData(key, curr)
      }
    }

    for (let key in promises) {
      checkPromise(promises[key], key)
    }
  })
}

Promise.prototype.race = function (promises) {
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
      let curr = promises[i]
      checkPromise(curr)
    }
  })
}
Promise.prototype.all = function () {

}
