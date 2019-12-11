//阿拉伯数字转换为简写汉字
export function Arabia_To_zhDigit(Num) {
    for (var i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", "")//替换Num中的“,”
        Num = Num.replace(" ", "")//替换Num中的空格
    }    
    if (isNaN(Num)) { //验证输入的字符是否为数字
        //alert("请检查小写金额是否正确");
        return;
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    var part = String(Num).split(".");
    var newchar = "";
    //小数点前进行转化
    for (var i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
            //alert("位数过大，无法计算");
            return "";
        }//若数量超过拾亿单位，提示
        var tmpnewchar = ""
        var perchar = part[0].charAt(i);
        switch (perchar) {
            case "0":  tmpnewchar = "零" + tmpnewchar;break;
            case "1": tmpnewchar = "一" + tmpnewchar; break;
            case "2": tmpnewchar = "二" + tmpnewchar; break;
            case "3": tmpnewchar = "三" + tmpnewchar; break;
            case "4": tmpnewchar = "四" + tmpnewchar; break;
            case "5": tmpnewchar = "五" + tmpnewchar; break;
            case "6": tmpnewchar = "六" + tmpnewchar; break;
            case "7": tmpnewchar = "七" + tmpnewchar; break;
            case "8": tmpnewchar = "八" + tmpnewchar; break;
            case "9": tmpnewchar = "九" + tmpnewchar; break;
        }
        switch (part[0].length - i - 1) {
            case 0: tmpnewchar = tmpnewchar; break;
            case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 4: tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 8: tmpnewchar = tmpnewchar + "亿"; break;
            case 9: tmpnewchar = tmpnewchar + "十"; break;
        }
        newchar = tmpnewchar + newchar;
    }   
    //替换所有无用汉字，直到没有此类无用的数字为止
    while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零零", "零");      
    }
    //替换以“一十”开头的，为“十”
    if (newchar.indexOf("一十") == 0) {
        newchar = newchar.substr(1);
    }
    //替换以“零”结尾的，为“”
    if (newchar.lastIndexOf("零") == newchar.length - 1) {
        newchar = newchar.substr(0, newchar.length - 1);
    }
    return newchar;
}
// 汉子转化为阿拉伯数字
export function zhDigit_To_Arabic(digit) {
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九','十'];
    const unit = ['千', '百', '十'];
    const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
    let result = 0, quotFlag;
  
    for (let i = digit.length - 1; i >= 0; i--) {
      if (zh.indexOf(digit[i]) > -1) { // 数字
        if (quotFlag) {
          result += quotFlag * getNumber(digit[i]);
        } else {
          result += getNumber(digit[i]);
        }
      } else if (unit.indexOf(digit[i]) > -1) { // 十分位
        if (quotFlag) {
          result += quotFlag * getUnit(digit[i]) * getNumber(digit[i - 1]);
        } else {
          result += getUnit(digit[i]) * getNumber(digit[i - 1]);
        }
        --i;
      } else if (quot.indexOf(digit[i]) > -1) { // 万分位
        if (unit.indexOf(digit[i - 1]) > -1) {
          if (getNumber(digit[i - 1])) {
            result += getQuot(digit[i]) * getNumber(digit[i - 1]);
          } else {
            result += getQuot(digit[i]) * getUnit(digit[i - 1]) * getNumber(digit[i - 2]);
            quotFlag = getQuot(digit[i]);
            --i;
          }
        } else {
          result += getQuot(digit[i]) * getNumber(digit[i - 1]);
          quotFlag = getQuot(digit[i]);
        }
        --i;
      }
    }
  
    return result;
  
    // 返回中文大写数字对应的阿拉伯数字
    function getNumber(num) {
      for (let i = 0; i < zh.length; i++) {
        if (zh[i] == num) {
          return i;
        }
      }
    }
  
    // 取单位
    function getUnit(num) {
      for (let i = unit.length; i > 0; i--) {
        if (num == unit[i - 1]) {
          return Math.pow(10, 4 - i);
        }
      }
    }
  
    // 取分段
    function getQuot(q) {
      for (var i = 0; i < quot.length; i++) {
        if (q == quot[i]) {
          return Math.pow(10, (i + 1) * 4);
        }
      }
    }
  }