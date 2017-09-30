var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
   index: "./src/index.js",
   player: "./src/player.js",
  },//已多次提及的唯一入口文件
  output: {
    path:  __dirname + "/app",//打包后的文件存放的地方
    filename: "[name].min.js",//打包后输出文件的文件名
  },
  devServer: {
    contentBase: "./app",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true//实时刷新
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
           options: {
            presets: [
              "es2015"
            ]
           }
        },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
 　　　　use: ['style-loader', 'css-loader', 'less-loader'],     
      }
    ]
  }
}