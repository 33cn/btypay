// vue config
module.exports = {
  outputDir: '../BTY Wallet/dist',
  publicPath: 'dist',
  productionSourceMap: true,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/globals.scss";'
      }
    }
  },
}
