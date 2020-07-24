function myExtends(sourceObj, targetObj) {
  for(let key in sourceObj){
    if(!(key in targetObj)){
      targetObj[key] = sourceObj[key]
    }
  }
  return targetObj
}
