import Vue from 'vue'

const app = new Vue({
    // el: '#root',
    // template: '<div><span>{{text}}</span></div>',
    data: {
        text: 0
    },
    beforeCreate() {
        //  打印不了this.text
        console.log('看一下beforeCreate里的this.text', this.text)
            //  下面修改成5后视图还是0
            //  this.text = 5
        console.log('看一下beforeCreate里改变后的this.text', this.text)
        console.log(this, this.$el, 'beforeCreate')
    },
    created() {
        //  打印出this.text
        console.log(123, this.text)
            //  下面修改成5后视图是5
        this.text = 5
        console.log(this, this.$el, 'created')
    },
    beforeMount() {
        console.log(this.$el, 'beforeMount')
    },
    mounted() {
        console.log(this.$el, 'mounted')
    },
    beforeUpdate() {
        console.log(this, 'beforeUpdate')
    },
    updated() {
        console.log(this, 'updated')
    },
    //  在组件章节讲解
    activated() {
        console.log(this, 'activated')
    },
    //  在组件章节讲解
    deactivated() {
        console.log(this, 'deactivated')
    },
    beforeDestroy() {
        console.log(this, 'beforeDestroy')
    },
    destroyed() {
        console.log(this, 'destroyed')
    },
    render(h) {
        throw new TypeError('render error')
            // console.log('render function invoke')
            // return h('div', {}, this.text)
    },
    renderError(h, err) {
        console.log(111, err)
        return h('div', {}, err.stack)
    },
    errorCaptured() {
        //  会向上冒泡，即，子组件的错误，可以在上级组件获取，并且正式环境可用
    }

})
app.$mount('#root')

// setInterval(() => {
//     app.$data.text += 1
// }, 1000)
setTimeout(() => {
    app.$destroy()
}, 1000)
