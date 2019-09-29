以下为Javascript实现的地址生成和校验流程。具体的可以参考开源代码：

# 1.	在工程下安装并导入相关的依赖
> 安装依赖：
```bash
npm install @33cn/chain33-rpc-api –save  
npm install @33cn/wallet-base –save  
npm install bitcoinjs-lib –save  
```  

> 导入依赖：
```bash
import {seed,sign} from '@33cn/wallet-base'
import BtyBaseSdk from '@33cn/chain33-rpc-api'
```

#  2.	生成随机数（助记词：seed）
> 具体方法的路径：  
https://github.com/33cn/btypay/blob/master/app/src/mixins/walletAPI.js

> 使用方法：
seed.newMnemonicInEN()：生成英文助记词
seed.newMnemonicInCN()：生成中文助记词

#  3.	生成公私钥对和地址（public key /private key）
> 具体方法的路径：
https://github.com/33cn/btypay/blob/master/app/src/mixins/walletAPI.js

> 使用方法:
1.	调用seed.newWalletFromMnemonic(seeds)生成钱包对象wallet
2.	调用wallet.newAccount(name)方法，生成公私钥对和地址

#  4.	地址合法性校验
引用用bitcoinjs-lib依赖包下的address.js文件

> 使用方法：
调用fromBase58Check()

# 5.	交易构造
交易构造一般可以通过区块链的rpc接口来实现，具体的可以参考节点接口文档

## 5.1.	将合约名转化成实际地址
调用chain33Sdk.convertExectoAddr(execName,url)方法，返回一个带有实际地址address的promise对象。
'''bash
参数：
params = {
to:address,
execName: execName,
amount:amount
}
'''

## 5.2.	交易构造
'''bash
/**
 * 交易构造
 * @param {CreateRawTransactionParams} params 构造交易参数
 * @param {string} [url=''] 接口地址
 */
'''

调用chain33Sdk.createRawTransaction(params,url)方法，返回一个带有交易结果tx的promise对象。

# 6.	离线签名
'''bash
/**
 * 签名交易
 * @param {string} [tx='']构造的交易
 * @param {string} [privateKey='']私钥
 */
 '''
调用sign.signRawTransaction(tx,privateKey)方法对构造的交易进行签名，返回一个带有已签名交易signedTx的promise对象。

# 7.	解析签名后交易数据
调用chain33Sdk.decodeTransaction(signedTx)方法，返回一个解析后的promise对象

# 8.	广播交易
'''bash
/**
 * 广播交易
 * @param {string} [tx='']签名的交易
 * @param {string} [privateKey='']接口地址
 */
 '''
调用chain33Sdk.sendTransaction(signedTx, url)方法，发送广播交易，返回一个带有hash的promise对象。


