// vue config
module.exports = {
  outputDir: '../BTY Wallet/dist',
  publicPath: 'dist',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/globals.scss";'
      }
    }
  },
}
