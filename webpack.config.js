//@ts-check

"use strict";

const path = require("path");
const webpack = require("webpack");

const outputDir = path.resolve(__dirname, "dist");

/**@type {import('webpack').Configuration}*/
const config = {
  target: "node",
  mode: "none",

  entry: {
    extension: "./src/extension.ts",
  },
  output: {
    clean: true,
    path: outputDir,
    // filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  optimization: {
    minimize: false, // ビルドが終わらない
  },
  devtool: "nosources-source-map",
  externals: {
    /**
     * @see https://code.visualstudio.com/api/working-with-extensions/bundling-extension#webpack-critical-dependencies
     * .vscodeignore煮含めることで回避できる
     */
    prettier: "prettier", // !node_modules/prettier
    typescript: "typescript", // !node_modules/typescript
    vscode: "commonjs vscode",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "swc-loader",
          },
        ],
      },
    ],
  },
};
module.exports = config;
