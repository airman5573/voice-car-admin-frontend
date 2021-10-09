const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const join = require('path').join;

module.exports = {
  mode: 'development',
  entry: join(__dirname, '/src/index.tsx'),
  devtool: 'source-map',
  output: {
    filename: "main.js",
    path: join(__dirname, '/dist'),
  },
  module: {
    rules: [
    {
      test: /\.(png|jpe?g|gif)$/i,
      loader: 'file-loader',
      options: {
        name: 'assets/[contenthash].[ext]',
      },
    },
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "ts-loader"
      }
    },
    {
      test: /\.(scss|css)$/,
      use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", {
        loader: "sass-loader",
        options: {
          implementation: require("sass")
        }
      }]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, '/src/index.html')
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist'],
    }),
    require('autoprefixer')
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", "scss"]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
    }
  },
};