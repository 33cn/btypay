# BTYPay
BTYPay是BTY主链和平行链的浏览器插件钱包，它能让你收发主链代币（BTY和主链token），平行链代币，以及主链和平行链跨链兑换。开发者可以使用BTYPay插件在浏览器中进行DAPP的开发。

# 钱包下载及安装
插件钱包类型：谷歌Chrome浏览器插件钱包 （Firefox正在研发中 Coming soon）

# 下载安装
## 方式一： 开发者模式
[钱包插件下载地址](https://github.com/33cn/btypay/releases/download/0.1/BTY_Wallet.zip)

1. 解压压缩包，得到BTY Wallet文件夹
2. 打开chrome在地址栏输入 chrome://extensions 来到拓展程序管理页
3. 切换至开发者模式
4. 点击"加载已解压的扩展程序"
5. 选择当前项目的BTY Wallet目录
6. 点击确认

## 方式二： 谷歌应用市场
上线谷歌应用市场中，敬请期待

# 编译安装
##### 构建打包代码
```
cd app
npm install
npm run build
```
##### 编译安装注意事项  
问题原因： 
JS 遵循 IEEE 754 规范，采用双精度存储（double precision），占用 64 bit。 
1位用来表示符号位 
11位用来表示指数  
52位表示尾数 
尾数位最大是 52 位，因此 JS 中能精准表示的最大整数是 Math.pow(2, 53)，十进制即 9007199254740992,大于 9007199254740992 的可能会丢失精度。 

而我们交易中的随机数（nonce值）远大于这个数，所以导致构造好的交易通过JS decode后nonce值发生变化，进而导致交易hash和之前不一致。 

规避办法： 
npm install后，在文件夹目录node_modules/protobufjs/src/util/minimal.js文件中修改。 
1. 在头部增加定义：var LLong = require("long") 
2. 在util.Long赋值中增加 LLong 
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long 
         || /* istanbul ignore next */ util.global.Long 
         || util.inquire("long") || LLong; 
