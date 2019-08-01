/* eslint-disable */
import * as math from 'mathjs'
math.config({number: 'Fraction'})

// 乘以10的8次方
Number.prototype.multiply = function(value) {
  return math.number(math.eval(`${this} * ${value}`))
}

// 除以10的8次方
Number.prototype.divide = function(value) {
  return math.number(math.eval(`${this} / ${value}`))
}

// 以vue能够监听数组变化的方式改变数组元素
Array.prototype.replaceElem = function (index, val) {
  this.splice(index, 1, val)
}