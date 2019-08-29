// "use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Object.defineProperty(exports, "__esModule", { value: true });
// var protobufjs = __importDefault(require("protobufjs"));
var protobufjs = require('protobufjs');
var sha256js = require("js-sha256");
// var bitcoinjs = __importDefault(require("bitcoinjs-lib"));
var transaction_json_1 = require("./transaction.json")
var crypto = require("crypto")
// var bip66 = require('bip66');
// import { sign } from '@33cn/wallet-base'

// var root = protobufjs.default.Root.fromJSON(transaction_json_1);
// var Transaction = root.lookupType('Transaction');
// var Transactions = root.lookupType('Transactions');

export function signGroupTransaction(tx, account) {
    // // decode transaction string
    // var buffer = fromHexString(tx);
    // var message = Transaction.decode(buffer);
    // var txdata = Transaction.toObject(message);
    // var data = Transactions.decode(txdata.header);
    // var txgroup = Transactions.toObject(data);
    // console.log(txgroup)
    // let arr = []
    // //先填next hash
    // // for (let i = txgroup.length - 1; i >= 0; i--) {
    // //     let tg = txgroup[i]
    // //     if (i==txgroup.length - 1){
    // //         tg.next=null;
    // //     }else {
    // //         tg.next=getTxHash(txgroup[i+1])
    // //     }
    // // }
    // // var header = getTxHash(txgroup.txs[0])
    // //重新刷新header

    // for (let tg of txgroup.txs) {
    //     // tg.header=header;
    //     message = Transaction.fromObject(tg);
    //     let signedTxBuffer = Transaction.encode(message).finish();
    //     let rawTxHexString = Buffer.from(signedTxBuffer).toString('hex');
    //     // let signedTx = sign.signRawTransaction(rawTxHexString, account)
    //     let signedTx = signRawTx(rawTxHexString, account)
    //     let buffer = fromHexString(signedTx);
    //     let message = Transaction.decode(buffer);
    //     let txdata = Transaction.toObject(message);
    //     arr.push(txdata)
    // }
    // txgroup.txs = arr;
    // //debug
    // // console.log(arr)
    // var headtx = arr[0];
    // console.log(headtx)
    // var copyTx = JSON.parse(JSON.stringify(headtx));
    // message = Transactions.fromObject(txgroup)
    // data = Transactions.encode(message).finish();
    // // console.log(data)
    // copyTx.header = data;
    // console.log(arr[0])
    // console.log(copyTx);
    // // console.log(txgroup.txs);

    // // console.log(getTxHash(copyTx))

    // //debug

    // message = Transaction.fromObject(copyTx);
    // var signedTxBuffer = Transaction.encode(message).finish();
    // var signedTxHexString = Buffer.from(signedTxBuffer).toString('hex');
    // console.log(signedTxHexString)
    // // return encoded transaction hex string
    // // return signedTxHexString;
    return ""
}
// var fromHexString = function (hexString) {
//     hexString = hexString.replace(/^(0x|0X)/, '');
//     var matchResult = hexString.match(/.{2}/g);
//     if (!matchResult) {
//         throw new Error('hexString format error: ' + hexString);
//     }
//     return Buffer.from(new Uint8Array(matchResult.map(function (byte) { return parseInt(byte, 16); })));
// };
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

var getTxHash = function (tx) {
    let message = Transaction.fromObject(tx);
    let txheader = Transaction.toObject(message);
    txheader.signature = null;
    txheader.header = null;
    let data = Transaction.encode(txheader).finish();
    // hash transaction
    let hash = sha256js.sha256(data);
    let header = Buffer.from(fromHexString(hash))
    return hash
}


export function signRawTx(rawTx, priKeyStr) {
    // protobufjs.default.Root.fromJSON(transaction_json_1);
    var root = protobufjs.Root.fromJSON(transaction_json_1);
    var Transaction = root.lookupType('Transaction');
    // decode transaction string
    var buffer = fromHexString(rawTx);
    console.log("buffer", buffer)
    var message = Transaction.decode(buffer);
    console.log("message", message.nonce + "")
    var txdata = Transaction.toObject(message, {defaults: true});
    console.log("txdata", txdata)
    // txdata.signature = null;
    // var data = Transaction.encode(txdata).finish();
    // // hash transaction
    // var hash = sha256js.sha256(data);
    // var keypair = bitcoinjs.ECPair.fromPrivateKey(fromHexString(priKeyStr));;

    // // sign
    // var signature = keypair.sign(Buffer.from(fromHexString(hash)));
    // var r = signature.slice(0, 32);
    // var s = signature.slice(32, 64);
    // if (r[0] & 0x80) {
    //     r = Buffer.concat([Buffer.from([0]), r]);
    // }
    // if (s[0] & 0x80) {
    //     s = Buffer.concat([Buffer.from([0]), s]);
    // }

    // signature = bip66.encode(r, s);
    // txdata.signature = {
    //     ty: 1,
    //     pubkey: keypair.publicKey,
    //     signature: signature,
    // };

    // message = Transaction.fromObject(txdata);
    // var signedTxBuffer = Transaction.encode(message).finish();
    // var signedTxHexString = Buffer.from(signedTxBuffer).toString('hex');
    // // return encoded transaction hex string
    // console.log(signedTxHexString);
    // console.log(signedTxHexString.length);
    // return signedTxHexString;
}


function fromHexString(hexString) {
    hexString = hexString.replace(/^(0x|0X)/, '');
    var matchResult = hexString.match(/.{2}/g);
    if (!matchResult) {
        throw new Error('hexString format error: ' + hexString);
    }
    let intArr = matchResult.map(byte => { return parseInt(byte, 16); })
    let u8Arr = new Uint8Array(intArr)
    let resBuffer = Buffer.from(u8Arr)
    return resBuffer;
}

// function fromHexString(hexString) {
//     var pos = 0;
//     var len = hexString.length;
//     if (len % 2 != 0) {
//         return null;
//     }
//     len /= 2;
//     var arrBytes = new Array();
//     for (var i = 0; i < len; i++) {
//         var s = hexString.substr(pos, 2);
//         var v = parseInt(s, 16);
//         arrBytes.push(v);
//         pos += 2;
//     }
//     return Buffer.from(arrBytes);
// }

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest();
}

function hexStr2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var arrBytes = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        if (v >= 128) {
            v = v - 256;
        }
        arrBytes.push(v);
        pos += 2;
    }
    return arrBytes;
}

function bytes2HexStr(b) {
    let hexs = "";
    for (let i = 0; i < b.length; i++) {

        let hex = (b[i]).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        hexs += hex.toUpperCase();
    }
    return hexs;
}

