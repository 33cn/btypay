// vue config
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin')
const path = require("path");

// Generate pages object
const pagesObj = {};
const chromeName = ["popup", "options"];

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
