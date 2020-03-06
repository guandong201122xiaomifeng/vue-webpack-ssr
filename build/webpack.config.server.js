const path = require("path")
    // const HTMLPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

const merge = require("webpack-merge")
const baseConfig = require("./webpack.config.base")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const VueServerPlugin = require("vue-server-renderer/server-plugin")

// const defaultPlugins = [
// new webpack.DefinePlugin({
//     'process.env': {
//         NODE_ENV: '"development"'
//     }
// })
// new HTMLPlugin({
//     template: path.join(__dirname, 'template.html')
// })
// ]

let config
const isDev = process.env.NODE_ENV === 'development'
let plugins = [
    new ExtractTextPlugin('styles.[contentHash:8].css'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        // webpack官方推荐
        'process.env.VUE_ENV': '"server"'
    })
]
if (isDev) {
    plugins.push(new VueServerPlugin())
}
// const devServer = {
//     port: 8080,
//     host: "0.0.0.0",
//     overlay: {
//         errors: true
//     },
//     hot: true
// }
config = merge(baseConfig, {
    // 表明打包好的js文件是在node运行的
    target: 'node',
    entry: path.join(__dirname, "../client/server-entry.js"),
    plugins,
    // 使用source-map原因，vue-server-render有个插件可以给我们提供个代码调试的功能
    // 但只能直引到出错的文件是出在哪一行
    devtool: "source-map",
    output: {
        // 指定我们写的代码export出去，入口时怎么样的，
        // 指定应用的入口，  nodejs  是这种  module.export放出去，require接受进来
        // 其他的模式比如  jquery 的是(function(){})()
        // 浏览器端就不是这样的，没有模块的概念，也不支持这种运行方式
        libraryTarget: 'commonjs2',
        // 名字不需要运用到hash之类的，因为是通过模块加载的，不需要浏览器的缓存功能
        filename: 'server-entry.js',
        path: path.join(__dirname, '../server-build')
    },
    // 浏览器端没有模块导入的概念，所以要一次性把依赖的文件都打包出来
    // 但是node端不需要，因为可以用require的方式在需要的地方引进来，
    // 不用再打包一次，浪费内存
    // dependencies里面vue,vuex,vue-router
    externals: Object.keys(require('../package.json').dependencies),
    // devtool: "#cheap-module-eval-source-map",
    // devServer,
    //import Vue from 'vue'
    // 服务端渲染不需要这个resolve
    // resolve: {
    //     alias: {
    //         'vue': path.join(__dirname, "../node_modules/vue/dist/vue.esm.js")
    //     }
    // },
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
            // rules: [{
            //     test: /\.styl/,
            //     use: [
            //         // style-loader 会把css文件通过js的方式插入到html文件
            //         // 有dom操作的代码在里面，node端不用这个，没有dom的执行环境
            //         "vue-style-loader",
            //         "css-loader",
            //         {
            //             loader: "postcss-loader",
            //             options: {
            //                 sourceMap: true
            //             }
            //         },
            //         "stylus-loader"
            //     ]
            // }]
    }
})

config.resolve = {
    alias: {
        'model': path.join(__dirname, '../client/model/server-model.js')
    }
}

module.exports = config
