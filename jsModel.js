// import axios from 'axios'
// import { createError1 } from './util'

const requestmethod = new Promise((resolve, reject) => {
    resolve({
        data: 123,
        success: true
    })
})
const createError1 = (code, msg) => {
    const err = new Error(msg)
    err.code = code
    return err
}
const handleRequest = () => {

    let mid = new Promise((resolve, reject) => {
        requestmethod.then(resp => {
            const data = resp.data
            if (!data) {
                return reject(createError1(400, 'no data'))
            }
            if (!data.success) {
                // 7-5 0625 user.js里面 ctx.body = { success: false, message: 'username or password error'}
                // 是message,所以下面要data.message
                return reject(createError1(400, data.message))
            }
            // 0655 为什么是data.data
            resolve(data.data)
        }).catch(err => {
            // 7-6 0140 axios 认为200 - 300 之间的状态码是错误
            const resp = err.response
            if (resp.status === 401) {
                reject(createError1(401, 'need auth'))
            }
        })
    })
    console.log('handleRequest', mid)
    return (mid)
}

const getAllTodos = function() {
    let mid = handleRequest()
    console.log('getAllTodos-mid', mid)
    return mid
}

const fetchTodos = function() {
    let mid = getAllTodos()
        .then(data => {})
        .catch(err => {
            // handleError(err)
        })
    console.log('fetchTodos', mid)
    return mid
}
fetchTodos()
