const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv !== "development";
console.log(`Webpack Wahlclient is in ${nodeEnv} mode`);

module.exports = {
  devtool: isProduction ? false : "inline-source-map",
  devServer: isProduction
    ? {}
    : {
        hot: true,
        port: 8080,
        disableHostCheck: true,
        historyApiFallback: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        }
        // https: {
        //   key: fs.readFileSync(".ssl/key.pem"),
        //   cert: fs.readFileSync(".ssl/cert.pem")
        // }
      },
  entry: {
    app: ["react-hot-loader/patch", "./src/wahlclient/index.tsx"]
  },
  mode: nodeEnv,
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: [/node_modules/, /server/],
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            cacheDirectory: true,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } }
              ],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
            plugins: [
              "extract-hoc/babel",
              "react-hot-loader/babel",
              "transform-class-properties",
              ["import", { libraryName: "antd", style: "css" }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/wahlclient/index.html"),
      inject: "body"
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, "src/wahlclient/data/haselnuss.mp3"),
        to: path.resolve(__dirname, "dist/wahlclient/haselnuss.mp3")
      }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: isProduction
      ? {}
      : {
          "react-dom": "@hot-loader/react-dom"
        },
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  output: {
    publicPath: "/",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/wahlclient")
  },
  node: {
    module: "empty",
    dgram: "empty",
    dns: "mock",
    fs: "empty",
    http2: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
};
