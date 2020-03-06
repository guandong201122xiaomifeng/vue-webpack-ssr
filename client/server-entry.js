import createApp from './create-app'

// 下面这里接受的context就是
// server-render.js 里面renderer.renderToString(context)
// 用到的context
// 可以在这里赋值
// 在进行vue整个应用的过程中，vue也会给它赋很多值
export default context => {
    // 1230
    // 返回一个promise，因为里面我们可能会做一些异步的操作，
    // 我们要让vue-server-render知道什么时候异步操作结束了
    return new Promise((resolve, reject) => {
        // 每次都要重新创建
        // 1450  store暂时用不到，在服务端的api全部实现完成后，要做
        // 异步数据操作的时候，才会在服务端用到store
        // const { app, router, store } = createApp()
        const { app, router, store } = createApp()
            // 如果有登录信息
        if (context.user) {
            // store.state.user = context.user
            store.commit('doLogin', context.user)
        }
        // 浏览器有默认路由，但是服务端router还只是个对象，还没有真正走渲染这一步
        // 13：10 这里是服务端，要主动推一条记录，才会匹配到我们要调用的组件
        router.push(context.url)
            // router.onReady基本上只有在服务端渲染的时候才会被用到
            // router.push(context.url)之后的异步操作都做完之后，比如有懒加载路由
        router.onReady(() => {
            // 1430这里做的主要是服务端渲染获取数据的操作
            // 服务端的api还没有做，应用的数据全部都是存在客户端，所以这里先不做
            // 1610 router.getMatchedComponents这个api也只有在服务端渲染的时候才
            // 用到，路径匹配到的组件
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length) {
                return reject(new Error('no component matched'))
            }
            Promise.all(matchedComponents.map(Component => {
                    if (Component.asyncData) {
                        return Component.asyncData({
                            route: router.currentRoute,
                            // todo.vue 要用到
                            router,
                            store
                        })
                    }
                }))
                .then(data => {
                    // console.log('asyncData', store.state)
                    context.meta = app.$meta()
                    context.state = store.state
                    context.router = router
                    resolve(app)
                })
        })
    })
}
