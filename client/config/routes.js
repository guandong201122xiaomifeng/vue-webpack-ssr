// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export default [{
        // 默认路由/的跳转
        path: '/',
        redirect: '/app'
    }, {
        // 匹配/app/xx
        // path: '/app/:id',

        path: '/app',
        // 把/app/:id的id作为props传给Todo组件，所以组件
        // 不一定要作为路由来拿id,跟$route解耦
        // props: true,
        //  指定特定的props
        // props: {
        //     id: '指定'
        // },
        // 这里的route就是对应的$route
        // props: (route) => ({ id: route.query.a }),
        // 匹配 /app
        // path: '/app',
        // component: Todo,
        component: () =>
            import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
        // components: {
        //     default: Todo,
        //     a: Login
        // },
        name: 'app',
        meta: {
            title: 'abc',
            description: 'xxxxxx'
        },
        // 路由配置的钩子,进入这个路由之前调用，
        // 在全局beforeEach和beforeResolve之间
        beforeEnter(to, from, next) {
            console.log('route app before enter')
            next()
        }
        // 'test' 匹配到/app/test
        // '/test' 匹配到  /test
        // children: [{
        //     path: 'test',
        //     component: Login
        // }]
    }, {
        path: '/login',
        // component: Login
        component: () =>
            import(/* webpackChunkName: "login-view" */ '../views/login/login.vue')
            // components: {
            //     default: Login,
            //     a: Todo
            // }
    }
    // , {
    //     path: '/login/exact',
    //     component: Login
    //         // component: () =>
    //         //     import ('../views/login/login.vue')
    // }
]
