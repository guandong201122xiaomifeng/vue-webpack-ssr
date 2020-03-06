const Router = require('koa-router')
const userRouter = new Router({ prefix: '/user' })

// 登录肯定是用post请求
userRouter.post('/login', async(ctx) => {
    // 获取user对象
    const user = ctx.request.body
        // 涉及到后台的操作太复杂，这里简单判断一下
    if (user.username === 'jocky' && user.password === 'jocky111') {
        // 设置一个session,代表登录成功
        // 7-3 1050 讲session的逻辑
        // koa-session 会把{username: 'jocky'} 写到cookie里面去，叫做json web token的东西
        // 会给这部分数据加个签名，这个签名会根据 server.js里面的app.keys进行加密，
        // 在后面的请求里面会拿这个做验证，验证通过的话，会设置ctx.session.user，
        // 然后api.js里面validateUser就可以拿到ctx.session.user
        ctx.session.user = {
            username: 'jocky'
        }
        ctx.body = {
            success: true,
            data: {
                username: 'jocky'
            }
        }
    } else {
        ctx.status = 400
        ctx.body = {
            success: false,
            message: 'username or password error'
        }
    }
})
module.exports = userRouter
