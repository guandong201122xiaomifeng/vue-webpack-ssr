import Vue from 'vue'
import Component from './fun-notification'

const NotificationConstructor = Vue.extend(Component)
    // 实例列表
const instances = []
    // 表明组件id
let seed = 1
const removeInstance = (instance) => {
    if (!instance) return
    const len = instances.length
    const index = instances.findIndex(inst => inst.id === instance.id)
    instances.splice(index, 1)
    if (len <= 1) return
    const removeHeight = instance.vm.height
    for (let i = index; i < len - 1; i++) {
        instances[i].verticalOffset =
            parseInt(instances[i].verticalOffset) - removeHeight - 16
    }
}
const notify = (options) => {
    // 如果是服务端渲染，没有dom操作，就不做处理，以免报错
    if (Vue.prototype.$isServer) return
    const {
        // autoClose要作为data,其他的要作为props,要分开
        autoClose,
        // ...rest 把剩下的属性都拿出来
        ...rest
    } = options
    const instance = new NotificationConstructor({
        // propsData: options,
        propsData: {
            // ...rest 把剩下的属性都拿出来
            ...rest
        },
        data: {
            autoClose: autoClose === undefined ? 3000 : autoClose
        }
    })
    const id = `notification_${seed++}`
    instance.id = id
        // $mount 之后节点已经生成，只是还没插进dom
        // instance.vm 才是vue对象，才能调用$el
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
    instance.vm.visible = true
    let verticalOffset = 0
    instances.forEach(item => {
        verticalOffset += item.vm.$el.offsetHeight + 16
    })
    instance.vm.$on('closed', () => {
        removeInstance(instance)
            // 销毁实例，并不会删除dom里面的节点，所以要手动删除
        document.body.removeChild(instance.vm.$el)
            // 销毁实例
        instance.vm.$destroy()
    })
    instance.vm.$on('close', () => {
        instance.vm.visible = false
    })
    verticalOffset += 16
    instance.verticalOffset = verticalOffset
    instances.push(instance)
    return instance.vm
}
export default notify
