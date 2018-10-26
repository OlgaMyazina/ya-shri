const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

module.exports = {
  entry: {
    home: './src/home/home.ts',
    index: './src/index.ts',
    device: './src/device/device.ts'
  },

  output: {
    path: path.resolve(__dirname, './public'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(handlebars|hbs)$/,
        loader: 'handlebars-loader',
        query: {
          inlineRequires: '/images/'
        }
      },
      {
        test: /\.css$/,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },

      {
        test: /\.(jpg|png|svg)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre'
      },
      {
        test: /\.(jpe?g|png|svg|ico)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img/'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyWebpackPlugin([{ from: 'src/images', to: 'img/' }]),
    new webpack.DefinePlugin({
      EVENTS_URL: JSON.stringify(process.env.EVENTS_URL || 'http://localhost:8000/api/events')
    })
  ]
};
