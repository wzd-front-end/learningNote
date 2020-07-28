function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'function' || typeof o === 'object') && o !== null
  }

  let isArray = Array.isArray(obj)
  let newObj = isArray ? [...obj] : [...obj]
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(newObj[key]) ? deepClone(newObj[key]) : newObj[key]
  })
  return newObj
}
