# 比特元轻钱包
一个实现了生成助记词、HDWallet、构造交易、交易签名的chrome插件。

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

- 2019/7/9 
    - 曾经上架过chrome网上应用商店，不过目前已经被下架。不过签名、创建钱包等功能还能正常使用，可作为开发Dapp的开发工具
    - 签名功能只能签名单笔普通交易，不能对交易组签名

## 开始使用
##### 构建代码
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
![install extension](https://gitlab.33.cn/bityuan/wallet-in-chrome/raw/develop/extension-install.png)
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


# 开始开发

- 官方文档 https://developer.chrome.com/webstore/get_started_simple
- 开发者账号 fuzamedev@gmail.com 密码 33fuzamei123 [其它账户信息](./account-info.png)
- chrome 应用商店上传应用地址 https://chrome.google.com/webstore/developer/dashboard?pli=1&authuser=1
