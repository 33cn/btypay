# 比特元轻钱包
一个实现了生成助记词、公私钥对、地址、构造交易、交易签名、跨链兑换的浏览器插件。

## 注意事项
在manifest.json的externally_connectable配置中为了避免出现
```
Wildcard domain patterns such as "<all_urls>" are not allowed
```
警告，externally_connectable.matches只配置了以下url,也就是说插件只能在能够匹配以下的url中注入js脚本。若要匹配其它的脚本需要在matches中添加。

```
"http://47.74.190.154:*/*",
"https://*.biqianbao.net/*",
"http://localhost:*/*",
"http://127.0.0.1:*/*"
```

## 开始使用
##### 构建打包代码
```
cd app
npm install
npm run build
```
##### 在chrome中以开发者模式加载程序
1. 打开chrome在地址栏输入 chrome://extensions 来到拓展程序管理页
2. 切换至开发者模式
3. 点击"加载已解压的扩展程序"
4. 选择当前项目的BTY Wallet目录
5. 点击确认
##### 调用钱包注入方法
插件会在每个tab 页注入一个全局对象 btyExtensionProvider ，btyExtensionProvider提供了
<br>
转账

```
    /**
     * @description 比特元转账
     * @param {*} payload {to: 接收地址, amount: 金额, note: 备注}
     * @returns {Promise<any>}
     */
    sendToAddr(payload) {
      ...
    }
```
交易签名

```
/**
 * @description 交易签名
 * @param {*} payload {tx: 未签名的交易字符串}
 * @returns {Promise<any>}
 */
signTx(payload) {
  ...
}
```
获取当前地址

```
/**
 * @description 获取当前地址
 * @returns {Promise<any>}
 */
getCurrentAccount() {
  ...
}
```


