const { defineConfig } = require("@vue/cli-service");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8000,
    devMiddleware: {
      writeToDisk: true
    }
  },
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "node_modules/@mediapipe/hands"),
            to: path.join(__dirname, "public/models")
          }
        ]
      })
    ]
  }
});
