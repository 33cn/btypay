import protobufjs from 'protobufjs'
import sha256js from 'js-sha256'
import bitcoinjs from 'bitcoinjs-lib'
import bip66 from 'bip66'
import transaction_json from './transaction.json'
import Long from 'long'

const root = protobufjs.Root.fromJSON(transaction_json);
const Transaction = root.lookupType('Transaction');
const Transactions = root.lookupType('Transactions');
const CoinsActions = root.lookupType('CoinsActions');
const CoinsAction = root.lookupType('CoinsAction')

const ExpireBound = 1000000000 
const Nanosecond   = 1
const Microsecond  = 1000 * Nanosecond
const Millisecond  = 1000 * Microsecond
const Second       = 1000 * Millisecond
const Minute       = 60 * Second
const Hour         = 60 * Minute 

var map = new Map();
map.set("ns",Nanosecond);
map.set("us",Microsecond);
map.set("µs",Microsecond);
map.set("ms",Millisecond);
map.set("s",Second);
map.set("m",Minute);
map.set("h",Hour);

//TxHeightFlag 标记是一个时间还是一个 TxHeight
const TxHeightFlag  = Long.fromInt(1).shiftLeft(62)

function parseExpire(expire) {
	if (expire.length == 0) {
        throw new Error('ErrInvalidParam');
	}
	if (expire.indexof("H") == 0 && expire.indexof(":")==1) {
		let = txHeight = parseInt(expire.substring(2))
	
		if (txHeight <= 0) {
            throw new Error('ErrHeightLessZero');
		}
		if (TxHeightFlag.add(txHeight).compare(txHeight)== -1) {
            throw new Error('ErrHeightOverflow');
		}

		return TxHeightFlag.add(txHeight)
	}

    //解析时间字符串,支持ns,us,ms,s,m,h 时间单位 
    for (let key in map){
        if (expire.lastIndexof(key) != -1){
           let v = parseInt(expire)
           //如果小于则溢出超过最大值
           if (TxHeightFlag.divide(map[key]).compare(v)==-1){
            new Error('ErrTimeOverflow');
           }
           return Long.fromInt(map[key]).multiply(v)
        }
    }
    let blockHeight = parseInt(expire)

	return blockHeight
}

function setExpire(tx,expire) {
    //大于边界值则是设置逾期时间
	if (expire > ExpireBound) {
		if (expire < Second*120) {
			expire = Second * 120
		}
		//用秒数来表示的时间
        tx.Expire = (new Date()).valueOf()/1000 + expire/Second
        return tx
	} 
        //小于则设置逾期高度
		tx.Expire = int64(expire)
	return tx
}

export function signGroupTxAndSetExpire(tx,expire,privateKey) {
    let txBuffer = fromHexString(tx)
    let txData = protobufDecode(Transaction, txBuffer)
    let txsData = protobufDecode(Transactions, txData.header)
    let expireTime = parseExpire(expire)
    let tx0 = setExpire(txsData.Txs[0],expireTime) 
    txsData.Txs[0] = tx0
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

function signTxDataAndSetExpire(txData,expire,priKeyStr) {
    let expireTime = parseExpire(expire)
    txData.signature = null;
    let txBuffer = protobufEncode(Transaction, setExpire(txData,expireTime))
    // hash transaction
    let hash = sha256js.sha256(txBuffer);
    let keypair = bitcoinjs.ECPair.fromPrivateKey(fromHexString(priKeyStr));

    // sign
    let signature = keypair.sign(Buffer.from(fromHexString(hash)));
    let r = signature.slice(0, 32);
    let s = signature.slice(32, 64);
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
    let txBuffer = protobufEncode(Transaction, txData)
    // hash transaction
    let hash = sha256js.sha256(txBuffer);
    let keypair = bitcoinjs.ECPair.fromPrivateKey(fromHexString(priKeyStr));

    // sign
    let signature = keypair.sign(Buffer.from(fromHexString(hash)));
    let r = signature.slice(0, 32);
    let s = signature.slice(32, 64);
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
    payload = Buffer.from(payload)
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
    console.log(txData.payload)
    console.log(Buffer.from(txData.payload))
    return Buffer.from(txData.payload).toString()
}


export function protobufDecodePayload(tx){
    let txBuffer = fromHexString(tx)
    let txData = protobufDecode(Transaction, txBuffer)

    let coinsActionsData = protobufDecode(CoinsAction, txData.payload)
    return coinsActionsData
}