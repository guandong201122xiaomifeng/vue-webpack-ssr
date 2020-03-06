import axios from 'axios'
import { createError } from './util'

const request = axios.create({
    // 7-5 0240 因为是跟自己发请求，所以不需要指定host,port，因为是个本地的请求
    //     客户端发请求默认是同域的  ， 也就是说 如果  '/'  ,会自动加上页面的http://localhost:3333
    // 但是服务端是没有同域的概念的， 也就是说 如果  '/'  ,不会自动加上页面的http://localhost:3333
    // 0935  但是服务端跟自己发请求，是拿不到cookie的，
    // server-render的时候通过ctx拿到cookie,通过复杂的方式传到client-model发
    // 请求的地方，拿到cookie,在发请求的时候再把cookie放进去，显得很复杂
    // 有没有比较简单的方法
    // baseURL: process.env.VUE_ENV === 'server' ? 'http://127.0.0.1:3333' : '/'
    baseURL: '/'
})

const handleRequest = (request) => {
    return new Promise((resolve, reject) => {
        request.then(resp => {
            console.log('看一下axios成功里面的resp', resp)
            const data = resp.data
            if (!data) {
                return reject(createError(400, 'no data'))
            }
            if (!data.success) {
                // 7-5 0625 user.js里面 ctx.body = { success: false, message: 'username or password error'}
                // 是message,所以下面要data.message
                return reject(createError(400, data.message))
            }
            // 0655 为什么是data.data
            resolve(data.data)
        }).catch(err => {
            // 7-6 0140 axios 认为200 - 300 之间的状态码是错误
            const resp = err.response
            console.log('````````', resp)
            if (resp.status === 401) {
                reject(createError(401, 'need auth'))
            }
        })
    })
}
export default {
    getAllTodos() {
        return handleRequest(request.get('/api/todos'))
    },
    login(username, password) {
        return handleRequest(request.post('/user/login', {
            username,
            password
        }))
    },
    updateTodo(id, todo) {
        return handleRequest(request.put(`/api/todo/${id}`, todo))
    },
    createTodo(todo) {
        return handleRequest(request.post('/api/todo', todo))
    },
    deleteTodo(id) {
        return handleRequest(request.delete(`/api/todo/${id}`))
    },
    deleteAllCompleted(ids) {
        return handleRequest(request.post('/api/delete/completed', { ids }))
    }
}
