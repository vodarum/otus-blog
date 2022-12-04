const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

const pages = fs.readdirSync("src/pages/");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "main.js",
    clean: true,
    assetModuleFilename: "images/[name][ext]",
  },
  plugins: [
    ...pages.map(
      (p) =>
        new HtmlWebpackPlugin({
          filename: p,
          template: `src/pages/${p}`,
        })
    ),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: "babel-loader",
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
    ],
  },
};
