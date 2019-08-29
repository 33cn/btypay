
var protobufjs = require('protobufjs');
var transaction_json_1 = require("./transaction.json")


export function signRawTx(rawTx, priKeyStr) {
    console.log("xxxxx")
    console.log(rawTx)
    // protobufjs.default.Root.fromJSON(transaction_json_1);
    var root = protobufjs.Root.fromJSON(transaction_json_1);
    var Transaction = root.lookupType('Transaction');
    // decode transaction string
    var buffer = fromHexString(rawTx);
    console.log("buffer", buffer)
    var message = Transaction.decode(buffer);
    console.log("message", message.nonce + "")
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