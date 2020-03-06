// 开发环境
const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
    // 正式环境不用memoryfs
    // const MemoryFS = require('memory-fs')
const fs = require('fs')
const webpack = require('webpack')

// const NativeModule = require('module')
// const vm = require('vm')
// 做服务端渲染要用到vue-server-render
const VueServerRenderer = require('vue-server-renderer')
const serverRender = require('./server-render-no-bundle')
const serverConfig = require('../../build/webpack.config.server')
    // serverCompiler可以在node端，run 或者 watch 生成我们在服务端要用到的
    // bundle
const serverCompiler = webpack(serverConfig)

// 指定webpack输出的文件是在memory-fs里面
// const mfs = new MemoryFS()
// serverCompiler.outputFileSystem = mfs
let bundle
    // 下面这步操作可以像webpack-dev-server一样，每次改动都会生成新的文件，
    // 可以拿到新的打包出来的文件
serverCompiler.watch({}, (err, stats) => {
        // 打包过程种出现错误
        if (err) throw err
            // 有些错误不是webpack打包的错误，而是其他的，比如eslint报的错误
        stats = stats.toJson()
        stats.errors.forEach(err => console.log(err))
        stats.warnings.forEach(warn => console.log(warn))
            // 拿到webpack打包出来的文件
        const bundlePath = path.join(
                serverConfig.output.path,
                'server-entry.js'
                // 使用插件  new VueServerPlugin()生成的文件名默认为vue-ssr-server-bundle.json
                // 而不是serverConfig.output.filename
                // 当然也可以指定new VueServerPlugin({filename:'xxxx'})
            )
            // 正式环境，不指定memoryfs，下面的try可以删掉
            // 7-12  1715 require是会做缓存的，第二次require会失效，用上一次的
        delete require.cache[bundlePath]
        bundle = require('../../server-build/server-entry.js').default
            // no-bundle  dev
            // try {
            //     // 7-12 0620 解释
            //     const m = { exports: {} }
            //         // bundlleStr 这时是个字符串
            //     const bundlleStr = mfs.readFileSync(bundlePath, 'utf-8')
            //         // require的时候跟下面的步骤其实是差不多的
            //         // 模块封装bundlleStr，做的事情就是加个function
            //         // function(module, exports, require)
            //     const wrapper = NativeModule.wrap(bundlleStr)
            //         // 下面的script才是可执行的代码，不是字符串了
            //     const script = new vm.Script(wrapper, {
            //             // filename 取什么都没有关系
            //             filename: 'server-entry.js',
            //             displayErrors: true
            //         })
            //         // script 运行的时候需要个上下文，上下文
            //         // 包含module, exports, require这些全局的公共变量
            //     const result = script.runInThisContext()
            //         // 下面这步操作，会把server-entry.js里面export default
            //         //  出来的放到m.exports里面
            //     result.call(m.exports, m.exports, require, m)
            //     bundle = m.exports.default
            // } catch (err) {
            //     console.log('compile js error', err)
            // }

        // 指定编码方式为utf-8,否则是二进制
        // 读取到文件之后是一个字符串，要转为json对象
        // bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
        // 每次webpack打包的时侯打印点东西
        console.log('new bundle generated')
    })
    // 再写一个koa的中间件，在ctx.body指定要服务端渲染要返回的html内容
const handleSSR = async(ctx) => {
    // bundle什么时候没有
    // 在webpack启动第一次打包，速度会比较慢，
    // 服务刚启动的时候还没打包好，是没有bundle的
    if (!bundle) {
        ctx.body = '你等一会，别着急 ... ...'
        return
    }
    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8080/public/vue-ssr-client-manifest.json'
    )
    const clientManifest = clientManifestResp.data;
    // 1530
    // 如果有bundle，就返回内容，但是输出的这部分只是
    // body部分，而完整的html需要头，title,下面的script标签，link-style
    // 所以要给它个模板,用server.template.ejs，用ejs这个模板引擎来帮我们渲染html
    const template = fs.readFileSync(
            path.join(__dirname, '../server.template.ejs'),
            // 指定utf-8,这样读出来的 才是string,否则是Buffer(二进制)
            'utf-8'
        )
        // 生成一个可以直接调用的方法
        // 如果是这样VueServerRenderer.createBundleRenderer(bundle, {
        //   template
        // })
        // VueServerRenderer可以根据官方介绍的标准模板把需要的内容插入到html
        // 里面，但是这样的话我们的一些功能就没办法实现，所以我们不用它插，
        // 只要它的app string,然后我们自己处理后面的东西inject: false

    //  createBundleRenderer优点：内置的 source map 支持
    // （在 webpack 配置中使用 devtool: 'source-map'）
    // 在开发环境甚至部署过程中热重载（通过读取更新后的 bundle，
    // 然后重新创建 renderer 实例）
    const renderer = VueServerRenderer.createRenderer({
        inject: false,
        // 这样会生成带有script标签的字符串
        clientManifest
    })
    await serverRender(ctx, renderer, template, bundle)
}
const router = new Router()
    // 所有的请求都通过handleSSR处理
router.get('*', handleSSR)
module.exports = router
