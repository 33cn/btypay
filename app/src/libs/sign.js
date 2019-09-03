// "use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Object.defineProperty(exports, "__esModule", { value: true });
// var protobufjs = __importDefault(require("protobufjs"));
var protobufjs = require('protobufjs');
var Long = require("long")
protobufjs.util.isNode = true
protobufjs.util.Long = Long
protobufjs.util.global.Long = Long
protobufjs.util.global.dcodeIO = { Long: Long }

var sha256js = require("js-sha256");
var bitcoinjs = require("bitcoinjs-lib");
var transaction_json_1 = require("./transaction.json")
var crypto = require("crypto")
var bip66 = require('bip66');
import { sign } from '@33cn/wallet-base'

var root = protobufjs.Root.fromJSON(transaction_json_1);
var Transaction = root.lookupType('Transaction');
var Transactions = root.lookupType('Transactions');

export function signGroupTransaction(tx, account) {
    // decode transaction string
    var buffer = fromHexString(tx);
    var message = Transaction.decode(buffer);
    var txdata = Transaction.toObject(message);
    var data = Transactions.decode(txdata.header);
    var txgroup = Transactions.toObject(data);
    let arr = []
    for (let tg of txgroup.txs) {
        message = Transaction.fromObject(tg);
        let signedTxBuffer = Transaction.encode(message).finish();
        let rawTxHexString = Buffer.from(signedTxBuffer).toString('hex');
        let signedTx = sign.signRawTransaction(rawTxHexString, account)
        console.log(signedTx)
        let buffer = fromHexString(signedTx);
        let message = Transaction.decode(buffer);
        let txdata = Transaction.toObject(message);
        arr.push(txdata)
    }

    txgroup.txs = arr;
    var headtx = arr[0];
    var copyTx = JSON.parse(JSON.stringify(headtx));
    message = Transactions.fromObject(txgroup)
    data = Transactions.encode(message).finish();
    copyTx.header = data;
    console.log(arr[0])
    console.log(copyTx);
    console.log(byteToString(copyTx.execer))
    message = Transaction.fromObject(copyTx);
    console.log(message)
    var signedTxBuffer = Transaction.encode(message).finish();
    var message1 = Transaction.decode(signedTxBuffer);
    var tx1 = Transaction.toObject(message1);
    console.log(byteToString(tx1.execer))

    var signedTxHexString = Buffer.from(signedTxBuffer).toString('hex');
    return signedTxHexString;
}


function byteToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (let i in _arr) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str
}


function fromHexString(hexString) {
    hexString = hexString.replace(/^(0x|0X)/, '');
    var matchResult = hexString.match(/.{2}/g);
    if (!matchResult) {
        throw new Error('hexString format error: ' + hexString);
    }
    return Buffer.from(new Uint8Array(matchResult.map(function (byte) { return parseInt(byte, 16); })));
}

export function signGroupTx(tx, privateKey) {
    let txBuffer = fromHexString(tx)
    let txData = protobufDecode(Transaction, txBuffer)
    let txsData = protobufDecode(Transactions, txData.header)

    let arr = []
    for (let txItem of txsData.txs) {
        let signedTxData = signTxData(txItem, privateKey)
        arr.push(signedTxData)
    }

    txsData.txs = arr
    let copyHeadTxData = JSON.parse(JSON.stringify(arr[0]))
    let txsBuffer = protobufEncode(Transactions, txsData)
    copyHeadTxData.header = txsBuffer

    let buffer = protobufEncode(Transaction, copyHeadTxData)
    return Buffer.from(buffer).toString('hex')
}


function protobufDecode(type, buffer) {
    let msg = type.decode(buffer)
    return type.toObject(msg)
}

function protobufEncode(type, data) {
    let msg = type.fromObject(data)
    return type.encode(msg).finish()
}


function signTxData(txdata, priKeyStr) {
    txdata.signature = null;
    var data = Transaction.encode(txdata).finish();
    // hash transaction
    var hash = sha256js.sha256(data);
    var keypair = bitcoinjs.ECPair.fromPrivateKey(fromHexString(priKeyStr));;

    // sign
    var signature = keypair.sign(Buffer.from(fromHexString(hash)));
    var r = signature.slice(0, 32);
    var s = signature.slice(32, 64);
    if (r[0] & 0x80) {
        r = Buffer.concat([Buffer.from([0]), r]);
    }
    if (s[0] & 0x80) {
        s = Buffer.concat([Buffer.from([0]), s]);
    }

    signature = bip66.encode(r, s);
    txdata.signature = {
        ty: 1,
        pubkey: keypair.publicKey,
        signature: signature,
    };
    return txdata
}