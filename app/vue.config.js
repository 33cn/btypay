// vue config
module.exports = {
  outputDir: '../BTY Wallet/dist',
  publicPath: 'dist',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/globals.scss";'
      }
    }
  }
}
