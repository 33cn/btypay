export default class Account {
  addr = '' // 地址
  label = '' // 标签
  coinsBalance = 0 // 可用余额，从 GetAccounts 接口获取
  ticketBalance = 0 // 正在挖矿的余额, 从 GetBalance ({execer: 'ticket'}) 接口获取
  ticketFrozen = 0 // 正在挖矿的冻结余额, 从 GetBalance ({execer: 'ticket'}) 接口获取

  constructor(
    addr,
    label,
    coinsBalance,
    ticketBalance = 0,
    ticketFrozen = 0
  ) {
    this.addr = addr
    this.label = label
    this.coinsBalance = coinsBalance
    this.ticketBalance = ticketBalance
    this.ticketFrozen = ticketFrozen
  }
  /* static method start */

  /**
   * @description 通过地址寻找列表中对应的Account的实例
   * @static
   * @param {Array<Account>} list Account list
   * @param {string} addr address
   * @returns {Account}
   * @memberof Account
   */
  static findAccountOfList (list, addr) {
    return list.find((account) => {
      return account.addr === addr
    })
  }

  /**
   * @description 返回列表中余额最大的实例
   * @static
   * @param {Array<Account>} list Account list
   * @returns {Account}
   * @memberof Account
   */
  static findMaxBalanceAccountOfList (list) {
    return list.reduce((max, next) => (next.coinsBalance > max.coinsBalance ? next : max), list[0])
  }

  /* static method end */
}
