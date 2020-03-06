// import model from '../../model/client-model'
// resolve.alias那里有配置，根据不同的环境获取相应的路径，加载相应的文件
import model from 'model'
import notify from '../../components/notification/function'
import bus from '../../util/bus'

const handleError = (err) => {
    // handle err
    if (err.code === 401) {
        // 首先是告诉用户要登录，然后跳到登录页面
        notify({
                content: '你得先登录啊！'
            })
            // 触发client-entry.js里的router.$on('auth', () => {
            // router.push('/login')})
        bus.$emit('auth')
    }
}
export default {
    // 异步通过mutations修改state里面的数据
    updateCountAsync(store, data) {
        console.log('updateCountAsync4', data.num)
        setTimeout(() => {
            store.commit('updateCount', {
                // num: data.num
                num: 1
            })
        }, data.time)
    },
    fetchTodos({ commit }) {
        commit('startLoading')
            // .then或者.catch之后的结果还是promise,可以拿去判断
        return model.getAllTodos()
            .then(data => {
                commit('endLoading')
                commit('fillTodos', data)
            })
            .catch(err => {
                commit('endLoading')
                handleError(err)
            })
    },
    login({ commit }, { username, password }) {
        commit('startLoading')
            // 请求成功之后要进行页面跳转，所以封装个promise让外面知道成功了，可以跳转了
        return new Promise((resolve, reject) => {
            model.login(username, password)
                .then(data => {
                    commit('endLoading')
                    commit('doLogin', data)
                    notify({
                        content: '登录成功'
                    })
                    resolve()
                })
                .catch(err => {
                    commit('endLoading')
                    handleError(err)
                    reject(err)
                })
        })
    },
    addTodo({ commit }, todo) {
        commit('startLoading')
        model.createTodo(todo)
            .then(data => {
                commit('endLoading')
                commit('addTodo', todo)
                notify({
                    content: '你又多了一件事要做'
                })
            })
            .catch(err => {
                commit('endLoading')
                handleError(err)
            })
    },
    updateTodo({ commit }, { id, todo }) {
        commit('startLoading')
        model.updateTodo(id, todo)
            .then(data => {
                commit('endLoading')
                commit('updateTodo', { id, todo: data })
            })
            .catch(err => {
                commit('endLoading')
                handleError(err)
            })
    },
    deleteTodo({ commit }, id) {
        commit('startLoading')
        model.deleteTodo(id)
            .then(data => {
                commit('endLoading')
                commit('deleteTodo', id)
                notify({
                    content: '你又少了一件事要做'
                })
            })
            .catch(err => {
                commit('endLoading')
                handleError(err)
            })
    },
    deleteAllCompleted({ commit, state }) {
        commit('startLoading')
            // ids  直接从state里面筛选就可以
        const ids = state.todos.filter(t => t.completed).map(t => t.id)
        model.deleteAllCompleted(ids)
            .then(() => {
                commit('endLoading')
                commit('deleteAllCompleted')
                notify({
                    content: '清理一下...'
                })
            })
            .catch(err => {
                commit('endLoading')
                handleError(err)
            })
    }
}
