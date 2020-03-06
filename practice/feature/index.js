import Vue from 'vue'

const ChildComp = {
    inject: ['yeye', 'value', 'data'],
    template: `
    <div>
      childComp
      <span>{{value}}</span>
      <p>{{data.value}}</p>
    </div>`,
    mounted() {
        console.log('看看', this.yeye, this.value)
    }
}
const component = {
    components: {
        ChildComp
    },
    // template: `
    //     <div :style = "styles">
    //       <div class = "header">
    //         <slot name = "header"></slot>
    //       </div>
    //       <div class = "body">
    //         <slot name = "body"></slot>
    //       </div>
    //     </div>`,
    template: `
        <div :style = "styles">
          <slot :value = "value" aaa = "456"></slot>
          <child-comp></child-comp>
        </div>`,
    data() {
        return {
            styles: {
                width: '200px',
                height: '200px',
                border: '1px solid black'

            },
            value: 0
        }
    }
}

new Vue({
    components: {
        CompOne: component
    },
    //  provide初始化的时候，实例还没初始化成功，如果要做一些跟实例挂钩的
    // 事情，要用个方法 return {}
    provide() {
        // 官方不推荐，将来如果升级，可能会报错，明白作用，必要时才用
        const data = {}
            // 子组件里每次获取data.value相当于get()，读取this.value
            // Vue里面的reactive根本原理就是利用get方法
        Object.defineProperty(data, 'value', {
                get: () => this.value,
                enumerable: true
            })
            //  默认情况下provide不提供reactive属性
            // 不管this.value怎么变都不会导致inject拿到的value相应改变
            // 如果要实现reactive效果，要用到Object.defineProperty
        return {
            yeye: this,
            value: this.value,
            data
        }
    },
    data: {
        value: '123'
    },
    el: '#root',
    //   template: `
    // <div>
    //   <comp-one>
    //     <span slot = "header">this is header</span>
    //     <span slot = "body">this is body</span>
    //   </comp-one>
    // </div>
    // `,
    template: `
      <div>
        <comp-one ref = "comp">
          <span ref = "span" slot-scope = "prop">{{prop.value}}{{prop.aaa}}{{value}}</span>
        </comp-one>
        <input v-model = "value"></input>
      </div>
      `,
    mounted() {
        console.log(this.$refs)
    }
})
