import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './app.vue'

import './assets/styles/global.styl'

import createRouter from './config/router'

// import store from './store/store'
import createStore from './store/store'

Vue.use(Vuex)
Vue.use(VueRouter)
const router = createRouter()
const store = createStore()

// 动态加载C模块，只有某个页面才用到的模块，可以考虑用这种方法
store.registerModule('c', {
        state: {
            textC: 'textC3'
        }
    })
    // 解绑一个module
    // store.unregisterModule('a')
    // 第一个函数的返回值，一旦有变化，作为第二个函数的入参
    // store.watch(state => state.count + 1, (newCount) => {
    //         console.log('state count watched', newCount)
    //     })

// store.subscribe，store.subscribeAction基本都是用在Vuex的插件里面
// ，可以记录那个mutations被调用了
// 每次调用mutation方法时都会调用
store.subscribe((mutation, state) => {
        console.log('mutation', mutation, 'state', state)
    })
    // 每次调用actions里面的方法时都会调用
store.subscribeAction((action, state) => {
        // action.payload参数,action.type名字
        console.log(action, state)
    })
    //  全局钩子
router.beforeEach((to, from, next) => {
    console.log('before each invoked', to, from)
    next()
        //  可以在这里进行判断，让没有登录权限的用户跳转到其他页面
        // if (to.path === '/app') {
        //     // 0950  next一调用就跳转，里面可以是一个字符串，
        //     // 也可以是对象，跟router-link上的一样
        //     next({
        //         path: '/login',
        //         replace: true
        //     })
        // } else {
        //     next()
        // }
})
router.beforeResolve((to, from, next) => {
    console.log('before resolve invoked')
    next()
})
router.afterEach((to, from) => {
        console.log('after each invoked')
    })
    // const root = document.createElement('div')
    // document.body.appendChild(root)
new Vue({
    // 在这个根组件里 的每一个组件都能拿到router,
    // 实现方式类似于provide  ,主要是这一步操作 Vue.use(VueRouter)
    router,
    store,
    render: (h) => h(App)
}).$mount('#root')
