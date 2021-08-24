const path = require("path");


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
      },
      '/messages': {
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
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"],
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' 
      }
    ]
  },
};


// Запуск dev-server-а : npm run start:dev