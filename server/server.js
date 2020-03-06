const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const staticRouter = require('./router/static')
const apiRouter = require('./router/api')
const userRouter = require('./router/user')

const createDb = require('./db/db')
const config = require('../app.config')
const koaBody = require('koa-body')
const koaSession = require('koa-session')
const db = createDb(config.db.appId, config.db.appKey)
    // const pageRouter = require('./router/dev-ssr')
const app = new Koa()

app.keys = ['vue ssr tech']
app.use(koaSession({
    key: 'v-ssr-id',
    // maxAge是用毫秒计算的
    maxAge: 2 * 60 * 60 * 1000
}, app))

// 服务端渲染分开发和正式环境
const isDev = process.env.NODE_ENV === 'development'
app.use(async(ctx, next) => {
    try {
        console.log(`request with path ${ctx.path}`)
        await next()
    } catch (err) {
        console.log(err)
        ctx.status = 500
        if (isDev) {
            ctx.body = err.message
        } else {
            ctx.body = 'please try again later'
        }
    }
})

// 在所有请求的最上面用一下
app.use(koaBody())
app.use(async(ctx, next) => {
    ctx.db = db
    await next()
})
app.use(async(ctx, next) => {
    if (ctx.path === '/favicon.ico') {
        await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
    } else {
        await next()
    }
})

app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
    // /api开头的路由回到apiRouter里面处理
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

let pageRouter
if (isDev) {
    pageRouter = require('./router/dev-ssr')
        // pageRouter = require('./router/dev-ssr-no-bundle')
} else {
    // pageRouter = require('./router/ssr')
    pageRouter = require('./router/ssr-no-bundle')
}
// koa-router的既定用法，不需要知道里面是什么逻辑，只要知道这么用就可以
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333
app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`)
})
