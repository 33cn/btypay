<template></template>

<script>
export default {
  data() {
    return {


        
      a: {
        method: "Chain33.CreateRawTransaction",
        params: [
          {
            to: "1HPkPopVe3ERfvaAgedDtJQ792taZFEHCe",
            amount: 100000000,
            execName: "paracross"
          }
        ]
      },

      b: {
        method: "Chain33.CreateTransaction",
        params: [
          {
            execer: "user.p.fzmtest.paracross",
            actionName: "ParacrossAssetTransfer",
            payload: {
              execName: "user.p.fzmtest.paracross",
              to: "1EkHDWUBFQGNiPvn98EABPfscRbotvWhY6",
              amount: 100000000
            }
          }
        ]
      },

      c: {
        method: "Chain33.GetBalance",
        params: [
          {
            addresses: ["1EkHDWUBFQGNiPvn98EABPfscRbotvWhY6"],
            execer: "user.p.fzmtest.paracross",
            asset_exec: "paracross",
            asset_symbol: "coins.bty"
          }
        ]
      },

      d: {
        method: "Chain33.CreateTransaction",
        params: [
          {
            execer: "user.p.fzmtest.paracross",
            actionName: "TransferToExec",
            payload: {
              to: "15SJCxkPPrJnhQiwHf8M9LAy6fAmDmpV7R",
              execName: "user.p.fzmtest.trade",
              amount: 100000000,
              cointoken: "coins.bty"
            }
          }
        ]
      },

      e: {
        method: "Chain33.GetBalance",
        params: [
          {
            addresses: ["1EkHDWUBFQGNiPvn98EABPfscRbotvWhY6"],
            execer: "user.p.fzmtest.trade",
            asset_exec: "paracross",
            asset_symbol: "coins.bty"
          }
        ]
      },

      f: {
        method: "trade.CreateRawTradeBuyLimitTx",
        params: [
          {
            tokenSymbol: "coins.bty",
            amountPerBoardlot: 100000000,
            minBoardlot: 1,
            pricePerBoardlot: 100000000,
            totalBoardlot: 1,
            assetExec: "paracross"
          }
        ]
      },

      g: {
        method: "trade.CreateRawTradeRevokeBuyTx",
        params: [
          {
            buyID:
              "26b724c75159de8037f0ade34518550b4cdf7fe18671c9e54344b923885e1916"
          }
        ]
      },

      h: {
        method: "trade.CreateRawTradeSellMarketTx",
        params: [
          {
            buyID:
              "26b724c75159de8037f0ade34518550b4cdf7fe18671c9e54344b923885e1916",
            boardlotCnt: 1
          }
        ]
      },

      i: {
        method: "Chain33.GetBalance",
        params: [
          {
            addresses: ["1EkHDWUBFQGNiPvn98EABPfscRbotvWhY6"],
            execer: "user.p.fzmtest.trade"
          }
        ]
      },

      j: {
        method: "Chain33.CreateRawTransaction",
        params: [
          {
            to: "15SJCxkPPrJnhQiwHf8M9LAy6fAmDmpV7R",
            amount: 100000000,
            execName: "user.p.fzmtest.trade",
            isWithdraw: true
          }
        ]
      },

      k: {
        method: "Chain33.CreateRawTransaction",
        params: [
          {
            to: "1CAPSpuKkNmy1rcYcZnujJKzjumExtFU6w",
            amount: 100000000,
            execName: "user.p.fzmtest.user.wasm.dice"
          }
        ]
      }







    };
  }
};
</script>



