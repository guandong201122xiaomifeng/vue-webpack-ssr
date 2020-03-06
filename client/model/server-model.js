const config = require('../../app.config')
const createDb = require('../../server/db/db')
    // 1300
const db = createDb(config.db.appId, config.db.appKey)
export default {
    // 服务端渲染的api,比客户端渲染的少，因为不会在渲染的时候插如一条数据，
    // 只要负责获取数据就可以
    getAllTodos() {
        return db.getAllTodos()
    }
}
