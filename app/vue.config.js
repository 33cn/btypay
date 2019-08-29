// vue config
module.exports = {
  outputDir: '../BTY Wallet/dist',
  publicPath: 'dist',
  productionSourceMap: false,
  lintOnSave:false,  // 关闭eslint
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/globals.scss";'
      }
    }
  },
  devServer:{
    open: true,
  }
}
