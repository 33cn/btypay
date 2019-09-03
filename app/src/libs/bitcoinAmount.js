import { timeFormat } from '@/libs/common'
// import {MY_ADDRESS, Address} from '@/controllers/address'

export const dMinFee = 0.001 // 最小矿工费

export const TransactionsType = {
  Other: 0,
  Generated: 1,
  SendToAddress: 2,
  SendToMining: 3,
  RecvWithAddress: 4,
  RecvFromMining: 5,
  SendToSelf: 6,
  BackDecl: 7,
  TyFailure: 8,
  OpenTicket: 9,
  CloseTicket: 10,

  Exchange: 11
}

export const TransactionFlag = {
  Send: 1,
  Recv: 2,
  Exchange: 3,
}

// 挖矿合约地址
const MiningAddr = '16htvcBNSEA7fZhAdLJphDwQRQJaHpyHTp'

/**
 * @description 交易地址验证
 * @export
 * @param {*} address
 * @returns
 */
export function addrValidate(address) {
  // 交易地址长度为 32~36 位字符长度
  return /^[A-Za-z0-9]{20,64}/.test(address)
}

/**
 * @description 哈希验证
 * @export
 * @param {*} hash
 * @returns
 */
export function hashValidate(hash) {
  // 交易哈希/区块哈希 长度为66位(0x) 或者 64位字符长度
  return /^(0x)?([A-Fa-f0-9]{64})$/.test(hash)
}

export class TransactionsListEntry {
  // 交易类型
  typeTy = ''
  amountChangeType = 'decrease'
  strToAddrLabel = ''
  strFromAddrLabel = ''
  constructor(paraName, symbol, myAddress, blockHeight, txIndex, nTimeData, strToAddress, strFromAddress, strHash, nAmount, nFee,
    strExecer, strActionname, nReceiptTy, strNote, strError) {
    //
    this.symbol = symbol
    this.height = blockHeight
    this.txIndex = txIndex
    this.hash = strHash
    this.hashShort = `${strHash.slice(0, 5)}****${strHash.slice(-5)}`
    this.strTimeData = timeFormat(nTimeData, 'yyyy-MM-dd hh:mm:ss')
    this.strAmount = Number(nAmount).divide(Math.pow(10, 8)).toFixed(4)
    this.strToAddress = strToAddress
    this.strFromAddress = strFromAddress
    this.strToAddrShort = `${strToAddress.slice(0, 7)}****${strToAddress.slice(-4)}`
    this.strFromAddrShort = `${strFromAddress.slice(0, 7)}****${strFromAddress.slice(-4)}`
    this.note = strNote
    this.execer = strExecer
    this.actionName = strActionname
    this.fee = Number(nFee).divide(Math.pow(10, 8)).toFixed(4)
    this.strError = strError

    let npos = strExecer.indexOf('user.')
    if (nReceiptTy !== 2 && strExecer !== 'none' && npos !== 0) {
      this.typeTy = TransactionsType.TyFailure
    } else if (strExecer !== 'coins' && strExecer !== 'ticket') {
      this.typeTy = TransactionsType.Other
    } else if (strExecer === 'ticket' && strActionname === 'withdraw') {
      this.typeTy = TransactionsType.RecvFromMining
    } else if (strExecer === 'ticket' && strActionname === 'miner') {
      this.typeTy = TransactionsType.Generated
    } else if (strExecer === 'ticket' && strActionname === 'open') {
      this.typeTy = TransactionsType.OpenTicket
    } else if (strExecer === 'ticket' && strActionname === 'close') {
      this.typeTy = TransactionsType.CloseTicket
    } else if (strExecer === 'coins' && strActionname === 'transfer' && strToAddress === MiningAddr) {
      this.typeTy = TransactionsType.SendToMining
    } else if (this.strToAddrLabel && this.strFromAddrLabel) {
      this.typeTy = TransactionsType.SendToSelf
    } else if (myAddress === strFromAddress) {
      this.typeTy = TransactionsType.SendToAddress
    } else if (myAddress === strToAddress) {
      this.typeTy = TransactionsType.RecvWithAddress
    } else {
      this.typeTy = TransactionsType.Other
    }

    let execerPrefix = "user.p." + paraName + "."
    if(strExecer === execerPrefix + "coins") {
      if(strActionname === "transfer"){
        if(myAddress === strFromAddress){
          this.typeTy = TransactionsType.SendToAddress
        } else {
          this.typeTy = TransactionsType.RecvWithAddress
        }
      } else if(strActionname === "withdraw") {
        this.typeTy = TransactionsType.Exchange
      }
    }

    if (this.typeTy === TransactionsType.Generated ||
      this.typeTy === TransactionsType.RecvWithAddress ||
      this.typeTy === TransactionsType.SendToSelf ||
      this.typeTy === TransactionsType.RecvFromMining) {
      this.strAmount = `${this.strAmount}`
      this.amountChangeType = 'increase'
    } else {
      this.strAmount = `${this.strAmount}`
      this.amountChangeType = 'decrease'
    }

    if (this.typeTy === TransactionsType.RecvWithAddress ||
      this.typeTy === TransactionsType.SendToSelf) {
      this.recordType = 'recv'
    } else if (this.typeTy === TransactionsType.SendToAddress) {
      this.recordType = 'send'
    } else if (this.typeTy === TransactionsType.Generated ||
      this.typeTy === TransactionsType.OpenTicket ||
      this.typeTy === TransactionsType.CloseTicket ||
      this.typeTy === TransactionsType.SendToMining ||
      this.typeTy === TransactionsType.RecvFromMining) {
      this.recordType = 'mining'
    } else {
      this.recordType = 'error'
    }

    if (strToAddress === MiningAddr) {
      this.strToAddress = `(合约)${strToAddress}`
    }
    if (strFromAddress === MiningAddr) {
      this.strFromAddress = `(合约)${strFromAddress}`
    }
  }
}

export function formatTxType(type) {
  switch (type) {
    case TransactionsType.Other:
      return '其它问题'
    case TransactionsType.Generated:
      return '挖矿所得'
    case TransactionsType.TyFailure:
      return '交易失败'
    case TransactionsType.OpenTicket:
      return '购票成功'
    case TransactionsType.CloseTicket:
      return '关闭选票'
    case TransactionsType.SendToAddress:
      return '发送成功'
    case TransactionsType.SendToMining:
      return '冻结挖矿'
    case TransactionsType.RecvWithAddress:
      return '接收成功'
    case TransactionsType.RecvFromMining:
      return '挖矿取回'
    case TransactionsType.SendToSelf:
      return '内部转账'
    default:
      return '其它问题'
  }
}
