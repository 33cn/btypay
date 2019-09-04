import {TransactionsType, MiningAddr} from '../libs/bitcoinAmount'
import {MY_ADDRESS, Address} from '@/controllers/address'
import {timeFormat} from '@/libs/common'

export default class TransactionsListEntry {
  // 交易类型
  typeTy = ''
  amountChangeType = 'decrease'
  strToAddrLabel = ''
  strFromAddrLabel = ''
  constructor(blockHeight, txIndex, nTimeData, strToAddress, strFromAddress, strHash, nAmount, nFee,
    strExecer, strActionname, nReceiptTy, strNote, strError) {
    //
    this.height = blockHeight
    this.txIndex = txIndex
    this.hash = strHash
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

    Address.findAll({
      type: MY_ADDRESS,
      success: (res) => {
        const myWallets = res.wallets
        for (let wallet of myWallets) {
          if (wallet.acc.addr === strToAddress) {
            this.strToAddrLabel = `${wallet.label}--${strToAddress}`
            this.strToAddrShort = `${wallet.label}--${this.strToAddrShort}`
          }
          if (wallet.acc.addr === strFromAddress) {
            this.strFromAddrLabel = `${wallet.label}--${strFromAddress}`
            this.strFromAddrShort = `${wallet.label}--${this.strFromAddrShort}`
          }
        }

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
        } else if (this.strFromAddrLabel) {
          this.typeTy = TransactionsType.SendToAddress
        } else if (this.strToAddrLabel) {
          this.typeTy = TransactionsType.RecvWithAddress
        } else {
          this.typeTy = TransactionsType.Other
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
    })
  }
}
