import Vue from 'vue'

const app = new Vue({
        // el: '#root',
        template: `<div><span>{{text}} {{obj.a}}</span></div>`,
        data: {
            text: 0,
            obj: { a: 0 }
        },
        watch: {
            text(newText, oldText) {
                console.log(`${newText}:${oldText}`)
            }
        }
    })
    // app.$set(app.obj, 'a', 1)
app.$mount('#root')
let i = 0
    // delete app.obj.a
app.$delete(app.obj, 'a')
setInterval(_ => {
    i = i + 1
        // app.obj.a = i
        // app.text与app.$data.text一样，与app.$options.data.text不一样
        // app.text++
        // app.$data.text++
        // app.$options.data.text++
}, 1000)
console.log(app)
    // app.$options.render = (h) => {
    //     return h('div', {}, 'new content')
    // }
console.log(app === app.$root)
    // app.$children   <zujian>html</zujian>
    // app.$slots      插槽
    // app.$scopedSlots
    // app.$refs        <div ref = "abc"></div>
    // app.$isServer  //服务端渲染的时候才用到

const unwatch = app.$watch('text', (newText, oldText) => {
        console.log(`${newText}:${oldText}`)
    })
    // 如果要注销掉，调用unwatch()即可

setTimeout(() => {
    unwatch()
}, 2000)

app.$once('test', (a, b) => {
    console.log(a, b)
})
setInterval(() => {
    app.$emit('test', 1, 3)
}, 1000)
