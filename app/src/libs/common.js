/* eslint-disable */
import * as math from 'mathjs'
math.config({
  number: 'Fraction'
})

export function multiply(a, b) {
  return math.number(math.multiply(a, b))
}

export function divide(a, b) {
  if (b === 0) {
    return 0
  } else {
    return math.number(math.divide(a, b))
  }
}

/**
 * @description 随机打乱数组中的元素
 * @export
 * @param {*} array
 */
export function randomSort(array) {
  let rArray = array.slice(0)
  console.log(rArray)
  return rArray.sort(() => Math.random() - 0.5)
}

export function isObject(obj) {
  return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]'
}

/**
 * @description 给数组的所有元素添加新属性
 * @export
 * @param {*} array 目标数组
 * @param {*} prop  属性
 * @param {*} [defaultVal=undefined] 默认值
 * @returns {Array} 处理后的数组
 */
export function addPropToArrElem(array, prop, defaultVal = undefined) {
  for (let i = 0; i < array.length; i++) {
    if (typeof prop === 'string' && typeof array[i][prop] === 'undefined') {
      // if elem isn't object set its value into 'value' property
      if (!isObject(array[i])) {
        array[i] = {
          value: array[i]
        }
      }
      array[i][prop] = defaultVal
    }
  }
  return array
}

export function changeArrElemProp(array, index, prop, val) {
  array.splice(index, 1, {
    ...array[index],
    [prop]: val
  })
}


/**
 * @description 比较两个不包含函数的对象值是否相等
 * @export
 * @param {*} a
 * @param {*} b
 * @returns
 */
export function lightCompare(a, b) {
  // Create arrays of property names
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true;
}

export function timeFormat(dateRoTimestamp, fmt) {
  let date = {}
  if (typeof dateRoTimestamp === 'object' && dateRoTimestamp.constructor === Date) {
    date = dateRoTimestamp
  } else {
    date = new Date(dateRoTimestamp ? (parseInt(dateRoTimestamp) * 1000) : new Date().getTime());
  }

  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * @description 向左补零
 * @export
 * @param {*} num 要补零的数
 * @param {*} n 需要的位数
 * @returns 补零后的字符串
 */
export function pad(num, n) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export function timeout(ms) {
  return new Promise(resolve => setTimeout(() => {
    resolve()
  }, ms));
}

/**
 * @description 返回系统语言中文或英文
 * @export
 */
// export function getLocalLang(returnString = false) {
//   let userLang = navigator.language || navigator.userLanguage
//   if (/^zh/.test(userLang)) {
//     userLang = returnString ? 'zh' : 1
//   } else {
//     userLang = returnString ? 'en' : 0
//   }
//   return userLang
// }

