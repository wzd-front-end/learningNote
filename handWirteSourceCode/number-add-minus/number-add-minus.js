// 首先获得数字的最大长度减去两位，一位为小数点，一位为个数位
Number.Max_SAFE_DIGITS = Number.MAX_SAFE_INTEGER.toString().length - 2

Number.digits = function () {
  let result = (this.valueOf().toString().split('.')[1] || '').length
  return result > Number.Max_SAFE_DIGITS ? Number.Max_SAFE_DIGITS : result
}

Number.prototype.add = function (i = 0) {
  if (typeof i !== 'number') {
    throw new Error('请输入正确的数字')
  }

  const v = this.valueOf()
  const thisDigits = this.digits()
  const iDigits = i.digits()
  const baseNum = Math.pow(10, Math.max(thisDigits, iDigits))
  const result = (v * baseNum + i * baseNum) / baseNum
  if (result > 0) {
    return result > Number.Max_SAFE_DIGITS ? Number.Max_SAFE_DIGITS : result
  } else {
    return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result
  }
}

Number.prototype.minus = function (i = 0) {
  if(typeof i !== 'number'){
    throw new Error('请输入正确的数字')
  }
  const v = this.valueOf()
  const thisDigits = this.digits()
  const iDigits = i.digits()
  const baseNum = Math.pow(10, Math.max(thisDigits, iDigits))

  const result = (v * baseNum - i * baseNum) / baseNum
  if (result > 0) {
    return result > Number.Max_SAFE_DIGITS ? Number.Max_SAFE_DIGITS : result
  } else {
    return result < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : result
  }
}
