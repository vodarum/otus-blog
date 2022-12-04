const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    compress: false,
    liveReload: true,
    open: "/",
    port: 5004,
    watchFiles: ["src/**/*"],
  },
});
