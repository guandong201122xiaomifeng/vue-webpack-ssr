// 服务端渲染的逻辑，开发和正式环境都是一样的
// 要用ejs渲染template
const ejs = require('ejs')
    // ctx,我们返回的内容要写在ctx.body里面
    // render, 开发和正式环境创建的流程不一样，我们要在外部进行传入
    // template也是一样，从外部进行传入
module.exports = async(ctx, renderer, template) => {
    // 指明返回的数据类型是html
    ctx.headers['Content-Type'] = 'text/html'
        // 获取session里面的登录信息
    const context = { url: ctx.path, user: ctx.session.user }
        // 服务端渲染时传入到vue-server-renderer里面去
        // vue-server-renderer拿到之后可以在上面插入一堆属性，
        // 方便我们渲染html
        // 上面有客户端js路径，css路径
        // 还有html要用到的title等，都可以通过context拿出来
    try {
        // 0330 renderer.renderToString(context)会返回一个promise
        const appString = await renderer.renderToString(context)
            // 7-11 0630 上面的appString,在重定向的情况下是用不着的
            // 但是由于用得到的是createBundleRenderer方法，所以只能是在这个方法之后
            // 才能进行下面的操作
            // 7-11 0410 重定向之后这两个是不相等的
        if (context.router.currentRoute.fullPath !== ctx.path) {
            // 路径重新设定，重新开始一个请求
            return ctx.redirect(context.router.currentRoute.fullPath)
        }
        // context.meta.$inject()可以拿到很多东西，包括单独页面的css样式
        // 详情可以看vue-meta  github文档
        const { title } = context.meta.inject()
        const html = ejs.render(template, {
            appString,
            // context.renderStyles()是带有style标签的字符串
            style: context.renderStyles(),
            scripts: context.renderScripts(),
            title: title.text(),
            // renderer.renderToString(context)之后，会把store里面的state
            // 放到context.renderState上面
            initialState: context.renderState()
        })
        ctx.body = html
    } catch (err) {
        console.log('render error', err)
        throw err
    }
}
