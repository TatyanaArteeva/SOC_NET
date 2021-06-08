const path = require("path");
// const { SourceMapDevToolPlugin } = require("webpack");

module.exports = {
  mode: "development",
  entry:  "./src/index.js",
  output: {
    filename: "main.js",
    sourceMapFilename: "[name].js.map"
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    historyApiFallback: true,
    port: 9000,
    open: true,
    watchContentBase: true,
    progress: true,
    proxy: {
      '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      }
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ['@babel/plugin-transform-runtime']
          },
        }
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      // {
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   use: ['source-map-loader'],
      //   plugins: [
      //     new SourceMapDevToolPlugin({
      //       filename: "[file].map"
      //     }),
      //   ],
      // },
    ]
  },
};


// Запуск dev-server-а : npm run start:dev