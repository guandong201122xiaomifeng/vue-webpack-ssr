export default {
    // 这里只能接受一个参数num,如果要传多个就只能是包装成一个对象
    // { num, num2 }通过结构的方法拿到对应的数据
    updateCount(state, { num, num2 }) {
        console.log(num2)
            // setTimeout(() => {
            //         // 代码会跑，但是这里的赋值操作会报错
            //         // state.count = 'mutations里面的异步'
            //         console.log('mutations里面的异步')
            //     }, 1000)
        state.count = num
    },
    fillTodos(state, todos) {
        state.todos = todos
    },
    doLogin(state, userInfo) {
        state.user = userInfo
    },
    addTodo(state, todo) {
        state.todos.unshift(todo)
    },
    updateTodo(state, { id, todo }) {
        state.todos.splice(
            state.todos.findIndex(t => t.id === id),
            1,
            todo
        )
    },
    deleteTodo(state, id) {
        state.todos.splice(
            state.todos.findIndex(t => t.id === id),
            1
        )
    },
    deleteAllCompleted(state) {
        // 筛选出没有完成的
        state.todos = state.todos.filter(t => !t.completed)
    },
    startLoading(state) {
        state.loading = true
    },
    endLoading(state) {
        state.loading = false
    }
}
