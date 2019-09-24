import protobufjs from 'protobufjs'
import sha256js from 'js-sha256'
import bitcoinjs from 'bitcoinjs-lib'
import bip66 from 'bip66'
import transaction_json from './transaction.json'

const root = protobufjs.Root.fromJSON(transaction_json);
const Transaction = root.lookupType('Transaction');
const Transactions = root.lookupType('Transactions');

export function signRawTx(tx, privateKey){
    let txData = protobufDecode(Transaction, fromHexString(tx))
    let signedTxData = signTxData(txData, privateKey)
    return Buffer.from(protobufEncode(Transaction, signedTxData)).toString('hex')
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
    let copyHeadTxData = arr.slice(0, 1)[0]
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

function fromHexString(hexString) {
    hexString = hexString.replace(/^(0x|0X)/, '');
    var matchResult = hexString.match(/.{2}/g);
    if (!matchResult) {
        throw new Error('hexString format error: ' + hexString);
    }
    return Buffer.from(new Uint8Array(matchResult.map(function (byte) { return parseInt(byte, 16); })));
}

function signTxData(txData, priKeyStr) {
    txData.signature = null;
    var data = Transaction.encode(txData).finish();
    // hash transaction
    var hash = sha256js.sha256(data);
    var keypair = bitcoinjs.ECPair.fromPrivateKey(fromHexString(priKeyStr));

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
    txData.signature = {
        ty: 1,
        pubkey: keypair.publicKey,
        signature: signature,
    };
    return txData
}