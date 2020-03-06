import Vue from 'vue'

const component = {
    // props: ['active', 'propOne', 'changeProp'],
    props: {
        active: Boolean,
        propOne: {
            type: String,
            required: true
        }
    },
    methods: {
        handleChange() {
            // this.changeProp()
            this.$emit('change')
        }
    },
    template: `
        <div>
          <P>{{text}}</P>
          <p @click = "handleChange">{{propOne}}144<p/>
          <span v-show = "active">see me if active</span>
        </div>`,
    data() {
        return { text: 0 }
    },
    mounted() {
        console.log('component  mounted')
        console.log('propOne', this.propOne)
    }

}

const parent = new Vue({
    name: 'parent'
})
const comp2 = {
    parent: parent,
    extends: component,
    // props: {
    //     propOne: '456'
    // },
    data() {
        return {
            text: 'comp21'
        }
    },
    // template: `
    // <div>
    //   {{text}}
    // </div>
    // `,
    mounted() {
        console.log(this.$parent)
        this.$parent.text = 12345
        console.log(this.$parent.$options.name)
    }
}
new Vue({
        parent: parent,
        name: 'Root',
        components: {
            Comp2: comp2
        },
        propsData: {
            propOne: '456'
        },
        data: {
            text: '7891'
        },
        el: '#root',
        template: `
          <div>
            <span>{{text}}</span>
            <comp2 propOne = '789'/>
          </div>
          `,
        mounted() {
            console.log(this.$parent.$options.name)
        }
    })
    //  相当于Vue的一个子类，只是多了一些配置项，首字母要大写
    // const CompVue = Vue.extend(component)

// new CompVue({
//     propsData: {
//         propOne: 'propOne'
//     },
//     el: '#root',
//     //  这里的data会覆盖component里的data
//     data() {
//         return {
//             text: 1
//         }
//     },

//     // props: {
//     //     propOne: 'propOne'
//     // 通过props这种方式，在组件内部是拿不到propOne的
//     // },
//     // 先跑组件里的mounted，再跑这里的mounted
//     mounted() {
//         console.log('CompVue  mounted')
//     }

// })
