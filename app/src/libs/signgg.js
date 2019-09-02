
var protobufjs = require('protobufjs');
var transaction_json_1 = require("./transaction.json")


 function signRawTx(rawTx, priKeyStr) {
    console.log("xxxxx")
    console.log(rawTx)
    // protobufjs.default.Root.fromJSON(transaction_json_1);
    var root = protobufjs.Root.fromJSON(transaction_json_1);
    var Transaction = root.lookupType('Transaction');
    // decode transaction string
    var buffer = fromHexString(rawTx);
    console.log("buffer", buffer)
    var message = Transaction.decode(buffer);
    console.log(JSON.stringify(message))
    console.log("message", message.nonce + "")
}

function fromHexString(hexString) {
    console.log(console.log(3413051718+1629598023*4294967296))
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

signRawTx('0a05636f696e731238180a2a3410c096b10222097061726163726f73732a223148506b506f7056653345526676614167656444744a5137393274615a464548436520a08d0630c692bcdbfca8ec90613a223148506b506f7056653345526676614167656444744a5137393274615a4645484365')