import Router from 'vue-router'

import routes from './routes'

// const router = new Router({
//     routes
// })
// 正常来说这样是可以用了，但是
// 如果这样的话，那么在全局import进来的是同一个router，
// 做不到每次都是新的router
// 服务端渲染会导致每次生成的app,没有释放掉，导致内存溢出，详情看服务端渲染
// export default router

export default () => {
    return new Router({
        routes,
        // history模式
        mode: 'history',
        // 不管用router-link还是路由跳转，都会在前面加上这么一段，两头都要/
        // 不是很常用，但当要区分页面路径跟其他路径时会用到
        // base: '/base/',

        // 指定链接激活应该是什么样式
        linkActiveClass: 'active-link',
        linkExactActiveClass: 'exact-active-link',
        // 路由跳转时滚动位置
        scrollBehavior(to, from, savedPosition) {
            console.log('to', to, 'from', from, 'savedPosition', savedPosition)
            if (savedPosition) {
                return savedPosition
            } else {
                return {
                    x: 0,
                    y: 0
                }
            }
        },
        // 不是所有的浏览器都支持这种history的模式，如果不支持，true允许退回hash模式
        // false不退回hash模式，这是就不是单页应用了，而是多页应用，每次请求都要后端返回html
        fallback: true
            // 这两个用于处理路径参数，用得少
            // parseQuery(query) {
            //     console.log('parseQuery', query)
            // },
            // stringifyQuery(obj) {
            //     console.log('stringifyQuery', obj)
            // }
    })
}
