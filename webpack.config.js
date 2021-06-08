const path = require("path");

module.exports = {
  mode: "development",
  entry:  "./src/index.js",
  output: {
    filename: "main.js",
    // path: path.resolve(__dirname, './public')
  },
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
            // cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime']
        }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
