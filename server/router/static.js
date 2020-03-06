const Router = require('koa-router')
const send = require('koa-send')

// 这个staticRouter只会处理/public开头的路径
// 这是我们想要的处境静态文件的中间件
const staticRouter = new Router({ prefix: '/public' })
staticRouter.get('/*', async ctx => {
    await send(ctx, ctx.path)
})
module.exports = staticRouter
