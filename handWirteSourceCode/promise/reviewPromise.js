function Promise(executor) {
  let self = this
  self.value = null
  self.reason = null
  self.currState = 'pending'
  self.onFulfilledCallbacks = []
  self.onRejectedCallbacks = []

  function resolve(value) {
    self.value = value
    self.currState = 'resolved'
    self.onFulfilledCallbacks.forEach(fn => {
      fn()
    })
  }

  function reject(reason) {
    self.reason = reason
    self.currState = 'rejected'
    self.onRejectedCallbacks.forEach(fn => {
      fn()
    })
  }

  executor(resolve, reject)
}
function resolvePromise(promise, x, resolve, reject) {
  if(promise === x){
    return reject(new TypeError('循环引用'))
  }

  let called = false
  if(x !== null && (typeof x === 'object' || typeof x === 'function')){
    try{
      let then = x.then
      if(typeof then === 'function'){
        then.call(x, (y) => {
          if(called) return
          called = true
          resolvePromise(promise, y, resolve, reject)
        }, (e) => {
          if(called) return
          called = true
          reject(e)
        })
      }else {
        resolve(x)
      }
    }catch (e) {
      if(called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.prototype.then = function(onFulfilled, onRejected){
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
  onRejected = typeof  onRejected === 'function' ? onRejected : err => throw err
  let self = this
  let promise = new Promise((resolve, reject) => {
    switch (self.currState) {
      case "resolved":
        setTimeout(() => {
          try{
            let x = onFulfilled(self.value)
            resolvePromise(promise, x, resolve, reject)
          }catch (e) {
            reject(e)
          }
        }, 0)
        break
      case "rejected":
        setTimeout(() => {
          try{
            let x = onRejected(self.reason)
            resolvePromise(promise, x, resolve, reject)
          }catch (e) {
            reject(e)
          }
        }, 0)
        break
      case "pending":
        self.onFulfilledCallbacks.push(function () {
          setTimeout(() => {
            try{
              let x = onFulfilled(self.value)
              resolvePromise(promise, x, resolve, reject)
            }catch (e) {
              reject(e)
            }
          }, 0)
        })
        self.onRejectedCallbacks.push(function () {
          setTimeout(() => {
            try{
              let x = onRejected(self.reason)
              resolvePromise(promise, x, resolve, reject)
            }catch (e) {
              reject(e)
            }
          }, 0)
        })
        break
    }
  })


}
module.exports = Promise
