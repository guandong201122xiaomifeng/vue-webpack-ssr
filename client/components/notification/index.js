import Notification from './notification.vue'

import notify from './function'
// Vue.use的时候传一个Vue进来
export default (Vue) => {
    // 写组件，最好是能够定义个name，这样组件多的话，不用
    // 再去写个name
    Vue.component(Notification.name, Notification)
    Vue.prototype.$notify = notify
}
