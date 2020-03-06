const path = require("path")
const HTMLPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
    // 服务端渲染要拿到webpack-dev-server的打包出来的json文件
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const merge = require("webpack-merge")
const baseConfig = require("./webpack.config.base")
const isDev = process.env.NODE_ENV === "development"

const cdnConfig = require('../app.config').cdn
const defaultPlugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),
    new HTMLPlugin({
        template: path.join(__dirname, 'template.html')
    }),
    // 不管是开发还是正式环境都需要
    // 生成的默认文件名为 vue-ssr-client-manifest.json
    new VueClientPlugin()
]

let config
const devServer = {
    port: 8080,
    host: "0.0.0.0",
    overlay: {
        errors: true
    },
    proxy: {
        '/api': 'http://127.0.0.1:3333',
        '/user': 'http://127.0.0.1:3333'
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: {
        //  根目录下的index.html,即new HTMLPlugin({
        //   template: path.join(__dirname, 'template.html')
        // })生成的index.html
        index: '/public/index.html'
    },
    hot: true
}
if (isDev) {
    config = merge(baseConfig, {
        plugins: defaultPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]),
        devtool: "#cheap-module-eval-source-map",
        devServer,
        module: {
            rules: [{
                test: /\.styl/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                    // {
                    //     loader: "css-loader",
                    //     options: {
                    //         module: true,
                    //         localIdentName: isDev ? "[path]-[name]-[hash:base64:5]" : "[hash:base64:5]"
                    //     }
                    // },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    "stylus-loader"
                ]
            }]
        }
    })
} else {
    config = merge(baseConfig, {
        entry: {
            app: path.join(__dirname, "../client/client-entry.js"),
            vendor: ['vue']
        },
        output: {
            filename: '[name].[chunkHash:8].js',
            publicPath: cdnConfig.host ? cdnConfig.host : '/public/'
                // publicPath: '/public/'
        },
        module: {
            rules: [{
                test: /\.styl/,
                use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        "stylus-loader"
                    ]
                })

            }]
        },
        plugins: defaultPlugins.concat([
            new ExtractTextPlugin('styles.[contentHash:8].css'),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime'
            }),
            new webpack.NamedChunksPlugin()
        ])
    })
}

config.resolve = {
    alias: {
        'model': path.join(__dirname, '../client/model/client-model.js')
    }
}

module.exports = config
