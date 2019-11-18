import protobufjs from 'protobufjs'
import sha256js from 'js-sha256'
import bitcoinjs from 'bitcoinjs-lib'
import bip66 from 'bip66'
import transaction_json from './transaction.json'

const root = protobufjs.Root.fromJSON(transaction_json);
const Transaction = root.lookupType('Transaction');
const Transactions = root.lookupType('Transactions');
const CoinsAction = root.lookupType('CoinsAction');
const CoinsActions = root.lookupType('CoinsActions');
// const AssetsTransfer = root.lookupType('AssetsTransfer');
// const AssetsWithdraw = root.lookupType('AssetsWithdraw');
// const AssetsTransferToExec = root.lookupType('AssetsTransferToExec');

export function signRawTx(tx, privateKey){
    console.log(privateKey)
    console.log('tx='+tx)
    let txData = protobufDecode(Transaction, fromHexString(tx))
    console.log('txData')
    console.log(txData)
    let signedTxData = signTxData(txData, privateKey)
    console.log('signedTxData')
    console.log(signedTxData)
    console.log(Buffer.from(protobufEncode(Transaction, signedTxData)).toString('hex'))
    return Buffer.from(protobufEncode(Transaction, signedTxData)).toString('hex')
}


export function test(tx, privateKey){
    console.log('hhhhhhhhhhhhhhhhhhhhh')
    console.log(CoinsAction)
    let txBuffer = fromHexString(tx)
    let txData = protobufDecode(CoinsAction, txBuffer)
    // let txsData = protobufDecode(CoinsActions, txData.header)
    // console.log(txsData)
}

export function signGroupTx(tx, privateKey) {
    let txBuffer = fromHexString(tx)
    console.log(txBuffer)
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


export function verifySignedTx(tx) {
    let txData = protobufDecode(Transaction, fromHexString(tx))
    let signature = Buffer.from(txData.signature.signature.slice(0))
    let pubkey = Buffer.from(txData.signature.pubkey.slice(0))

    txData.signature = null
    let txBuffer = protobufEncode(Transaction, txData)
    let hash = Buffer.from(fromHexString(sha256js.sha256(txBuffer)))
    let keypair = bitcoinjs.ECPair.fromPublicKey(pubkey)

    let {r, s} = bip66.decode(signature)
    if(r.byteLength > 32){
        r = r.slice(1, 33)
    }
    if(s.byteLength > 32){
        s = s.slice(1, 33)
    }

    return keypair.verify(hash, Buffer.concat([r, s]))
}

export function createNoneTx(payload) {
    let tx = Transaction.create({payload: payload})
    return Buffer.from(protobufEncode(Transaction, tx)).toString('hex')
}

export function getAddrFromSignedTx(tx) {
    let txData = protobufDecode(Transaction, fromHexString(tx))
    let pubkey = txData.signature.pubkey
    return bitcoinjs.ECPair.payments.p2pkh({pubkey}).address
}

export function getPayloadFromSignedTx(tx) {
    let txBuffer = fromHexString(tx)
    let txData = protobufDecode(Transaction, txBuffer)
    return Buffer.from(txData.payload).toString()
}