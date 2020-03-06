// 正式环境
const Router = require('koa-router')
const serverRender = require('./server-render')
const VueServerRenderer = require('vue-server-renderer')
const path = require('path')
const fs = require('fs')

// 0400 clientManifest.json  json文件在node.js里面可以作为一个模块直接require进来的
// 拿进来的就是一个对象
const clientManifest = require('../../public/vue-ssr-client-manifest.json')
const renderer = VueServerRenderer.createBundleRenderer(
    // ../../server-build/vue-ssr-server-bundle.json正式环境这个是不会变的
    // 可以一直复用
    path.join(__dirname, '../../server-build/vue-ssr-server-bundle.json'), {
        inject: false,
        clientManifest
    }
)

const template = fs.readFileSync(path.join(__dirname, '../../server/server.template.ejs'), 'utf-8')

const pageRouter = new Router()
pageRouter.get('*', async(ctx) => {
    await serverRender(ctx, renderer, template)
})

module.exports = pageRouter
