const Router = require('koa-router')
    // 只处理api开头的路径
    // 给特定的路由前面加个前缀，是非常好的规范开发 的操作
    // 也会让我们开发相对比较简单点
const apiRouter = new Router({ prefix: '/api' })
    // 登录验证
const validateUser = async(ctx, next) => {
    if (!ctx.session.user) {
        ctx.status = 401
        ctx.body = 'need login'
    } else {
        await next()
    }
}
apiRouter.use(validateUser)
    // 给前端一个固定的格式，让前端更好地判断
const successResponse = (data) => {
    return {
        success: true,
        data
    }
}
apiRouter
// 拿到所有的todo   可以传多个方法，'/todos', validateUser, async(ctx) => {,像中间件一样
    .get('/todos', async(ctx) => {
        const todos = await ctx.db.getAllTodos()
        ctx.body = successResponse(todos)
    })
    // 创建todo
    .post('/todo', async(ctx) => {
        const data = await ctx.db.addTodo(ctx.request.body)
        ctx.body = successResponse(data)
    })
    // 更新
    .put('/todo/:id', async(ctx) => {
        const data = await ctx.db.updateTodo(ctx.params.id, ctx.request.body)
        ctx.body = successResponse(data)
    })
    // 删除
    .delete('/todo/:id', async(ctx) => {
        const data = await ctx.db.deleteTodo(ctx.params.id)
        ctx.body = successResponse(data)
    })
    // 删除全部，不是传统的rest请求，用post
    .post('/delete/completed', async(ctx) => {
        const data = await ctx.db.deleteCompleted(ctx.request.body.ids)
        ctx.body = successResponse(data)
    })
module.exports = apiRouter
