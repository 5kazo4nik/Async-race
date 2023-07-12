const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const filename = (ext) => (isProduction ? `[name].[contenthash].${ext}` : `[name].${ext}`);
  const optimization = () => {
    const configObj = {
      splitChunks: {
        chunks: 'all',
      },
    };
    if (isProduction) {
      configObj.minimizer = [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()];
    }
    return configObj;
  };

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    watch: !isProduction,
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
    optimization: optimization(),
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'source'),
      },
      open: true,
      compress: true,
      hot: true,
      port: 3000,
    },
    entry: './src/scripts/index.ts',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: `./scripts/${filename('js')}`,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: `./img/${filename('[ext]')}`,
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `./styles/${filename('css')}`,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        minify: {
          collapseWhitespace: isProduction,
        },
      }),
    ],
  };
  return config;
};
