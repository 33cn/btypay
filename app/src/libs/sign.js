// "use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Object.defineProperty(exports, "__esModule", { value: true });
var protobufjs_1 = __importDefault(require("protobufjs"));
var js_sha256_1 = require("js-sha256");
// var bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
import transaction_json_1 from "./transaction.json"
// var bip66 = require('bip66');

import { sign } from '@33cn/wallet-base'

export function signGroupTransaction(tx, account) {
    var root = protobufjs_1.default.Root.fromJSON(transaction_json_1);
    var Transaction = root.lookupType('Transaction');
    var Transactions = root.lookupType('Transactions');
    // decode transaction string
    var buffer = fromHexString(tx);
    console.log(buffer)
    var message = Transaction.decode(buffer);
    var txdata = Transaction.toObject(message);
    // var txgroup = txdata.header
    var data = Transactions.decode(txdata.header);
    var txgroup = Transactions.toObject(data);
    let arr = []
    console.log(txgroup.txs)
    var headtx = txgroup.txs[0];
    var copyTx = JSON.parse(JSON.stringify(headtx));
    copyTx.signature=null;
    copyTx.header=null;
    data = Transaction.encode(copyTx).finish();
    // hash transaction
    var hash = js_sha256_1.sha256(data);
    console.log(hash);
    for (let tg of txgroup.txs) {
        tg.header=hash
        message = Transaction.fromObject(tg);
        let signedTxBuffer = Transaction.encode(message).finish();
        let rawTxHexString = Buffer.from(signedTxBuffer).toString('hex');
        let signedTx = sign.signRawTransaction(rawTxHexString, account)
        let buffer = fromHexString(signedTx);
        let message = Transaction.decode(buffer);
        let txdata = Transaction.toObject(message);
        arr.push(txdata)
    }
    txgroup.txs = arr;
    console.log(txgroup)
    headtx = txgroup.txs[0];
    console.log(headtx)
    var copyTx = JSON.parse(JSON.stringify(headtx));
    data = Transactions.encode(txgroup).finish();
    console.log(data)
    copyTx.header = data;
    console.log(copyTx);
    message = Transaction.fromObject(copyTx);
    var signedTxBuffer = Transaction.encode(message).finish();
    var signedTxHexString = Buffer.from(signedTxBuffer).toString('hex');
    // return encoded transaction hex string
    return signedTxHexString;
}
var fromHexString = function (hexString) {
    hexString = hexString.replace(/^(0x|0X)/, '');
    var matchResult = hexString.match(/.{2}/g);
    if (!matchResult) {
        throw new Error('hexString format error: ' + hexString);
    }
    return Buffer.from(new Uint8Array(matchResult.map(function (byte) { return parseInt(byte, 16); })));
};
//# sourceMappingURL=sign.js.map

var toHexString = function (str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {

        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += "," + str.charCodeAt(i).toString(16);
    }
    return val;
}