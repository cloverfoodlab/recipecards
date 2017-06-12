let path = require("path");
let webpack = require("webpack");

module.exports = {
  devtool: "eval",
  entry: ["webpack-hot-middleware/client", "./client/index"],
  output: {
    path: path.join(__dirname, "static"),
    filename: "bundle.js",
    publicPath: "/dist/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {}
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: path.join(__dirname, "client"),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  }
};
