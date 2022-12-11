const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

const pages = fs.readdirSync("src/pages/").map((p) => p.replace(/\.html/, ""));

module.exports = {
  entry: {
    index: "./src/js/index.js",
    "swiper-init": "./src/js/swiper-init.js",
  },
  output: {
    filename: "[name].js",
    clean: true,
    assetModuleFilename: "images/[name][ext]",
  },
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
  plugins: [
    ...pages.map(
      (p) =>
        new HtmlWebpackPlugin({
          filename: `${p}.html`,
          template: `src/pages/${p}.html`,
          inject: true,
          chunks: p === "index" ? ["index", "swiper-init"] : ["index"],
        })
    ),
    new MiniCssExtractPlugin(),
  ],
};
