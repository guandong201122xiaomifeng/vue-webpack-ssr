const sha1 = require('sha1')
const axios = require('axios')
    // 线上数据库存储时有个命名空间，我们所有的数据都存储在这个命名空间下面
    // 每个请求都要把todo带上，才知道操作哪个数据库
const className = 'todo'
    // 创建axios实例，包含了axios的所有方法，只不过路径
    // 前面多了baseURL
const request = axios.create({
        baseURL: 'https://d.apicloud.com/mcm/api'
    })
    // 发送请求时要拿到appId,appKey
    // 自定义错误
const createError = (code, resp) => {
    const err = new Error(resp.message)
    err.code = code
    return err
}

// 处理请求结果的公共方法,接收的对象就是axios请求返回的对象
const handleRequest = ({ status, data, ...rest }) => {
    if (status === 200) {
        return data
    } else {
        createError(status, rest)
    }
}
module.exports = (appId, appKey) => {
        // 每个请求都需要发送个签名，有个头的格式
        // 7-2  1510 验证签名的时候跟now有关系， 如果时间太久会过期，所以每次都重新生成是最保险的
        const getHeaders = () => {
                const now = Date.now()
                return {
                    'X-APICloud-AppId': appId,
                    'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${now}`)}.${now}`
      }
    }

    // 0710 return 的对象包含所有api请求的方法
    return {
      // 获取所有的todo列表
      async getAllTodos () {
        return handleRequest(await request.get(`/${className}`, {
          headers: getHeaders()
        }))
      },
      async addTodo (todo) {
        return handleRequest(await request.post(
          `/${className}`,
          todo,
          { headers: getHeaders() }
          ))
      },
      async updateTodo (id, todo) {
        return handleRequest(await request.put(
          // 0900 rest api的形式，根据id找到对应的数据
          `/${className}/${id}`,
          todo,
          { headers: getHeaders() }
        ))
      },
      async deleteTodo (id) {
        return handleRequest(await request.delete(
          // 0900 rest api的形式，根据id找到对应的数据
          `/${className}/${id}`,
          { headers: getHeaders() }
        ))
      },
      async deleteCompleted (ids) {
        const requests = ids.map(id => {
          return {
            method: 'DELETE',
            path: `/mcm/api/${className}/${id}`
          }
        })
        // 批量处理的做法   /batch
        return handleRequest(await request.post(
          '/batch',
          { requests },
          { headers: getHeaders() }
        ))
      }
    }
}
