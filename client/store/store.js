import Vuex from 'vuex'

// import Vue from 'vue'

// Vue.use(Vuex)
// const store = new Vuex.Store({
//     state: {
//         count: 0
//     },
//     mutations: {
//         updateCount(state, num) {
//             state.count = num
//         }
//     }
// })

// export default store
// 这里mutations没加default，而有defaultState
// 是因为defaultState是默认数据，不是业务数据，服务端渲染时有一些数据要覆盖它
// 而mutations是操作，不管有没有默认值都要操作
import defaultState from './state/state'

import mutations from './mutations/mutations'

import getters from './getters/getters'
import actions from './actions/actions'
// 开发环境不允许通过this.$store.state.count = 0 的方式进行修改数据，
// 否则，就没有规范性可言，所以要加 strict
const isDev = process.env.NODE_ENV === 'development'
export default () => {
    const store = new Vuex.Store({
            strict: isDev,
            state: defaultState,
            mutations,
            getters,
            actions,
            plugins: [
                    store => {
                        // 可以在这里面利用store.watch,store.subscribe
                        // 做自己想做的事情
                        console.log('my plugin invoked')
                    }
                ]
                // modules: {
                //     a: {
                //         // 默认mutations都放到全局的命名空间，如果要放到某个模块下面，
                //         // 加上这个配置，好处是可以在不同的 模块使用相同的mutations,actions名字
                //         // 这样a模块下所有的mutations,getters,actions都有命名空间的概念
                //         namespaced: true,
                //         state: {
                //             text: 1
                //         },
                //         mutations: {
                //             updateText(state, text) {
                //                 console.log('text', text)
                //                     // 这里的state是a模块下面的state
                //                     // console.log('a.mutation里面的state', state)
                //                 state.text = text
                //             }
                //         },
                //         getters: {
                //             textPlus(state, getters, rootState) {
                //                 // rootState表示的是全局的state
                //                 // console.log('a.getters里面的state, getters, rootState', state, getters, rootState)
                //                 return state.text + rootState.b.text
                //             },
                //             numPlus(state) {
                //                 return state.text
                //             }
                //         },
                //         actions: {
                //             add({ state, getters, commit, rootState }) {
                //                 // 这里的commit调用的是a模块的命名空间下面的
                //                 // commit('updateText', 123)
                //                 // console.log('a模块的actions的add的参数ctx', ctx)
                //                 commit('updateCount', { num: '456789' }, { root: true })
                //             }
                //         }
                //     },
                //     b: {
                //         namespaced: true,
                //         state: {
                //             text: 2
                //         },
                //         actions: {
                //             testAction({ commit }) {
                //                 // 可以这么理解如果不加
                //                 console.log('b test actions')
                //                 commit('a/updateText', 'b test actions', { root: true })
                //             }
                //         }
                //     }
                // }
        })
        // Vuex的api支持这样配置到webpack
    if (module.hot) {
        module.hot.accept([
            './state/state',
            './getters/getters.js',
            './mutations/mutations.js',
            './actions/actions.js'
        ], () => {
            // 这里不能用import,import 只能用在最外层，不能在业务代码里
            // 然后文件是export.default ,所以这里要加.default
            const newState = require('./state/state').default
            const newGetters = require('./getters/getters').default
            const newMutations = require('./mutations/mutations').default
            const newActions = require('./actions/actions').default
            store.hotUpdate({
                state: newState,
                getters: newGetters,
                mutations: newMutations,
                actions: newActions
            })
        })
    }
    return store
}
