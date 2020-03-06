import Vue from 'vue'

const component = {
        // props: ['active', 'propOne', 'changeProp'],
        props: {
            active: {
                // type: Boolean,
                // required: true,
                default: false,
                validator(val) {
                    return typeof val === 'boolean'
                }
            },
            // active: Boolean,
            propOne: String,
            changeProp: Function,
            obj: {
                default () {
                    return { a: 3 }
                }
            }
        },
        methods: {
            change() {
                // this.changeProp()
                this.$emit('change')
            }
        },
        template: `
        <div>
          <p>obj.a{{obj.a}}</p>
          <input type = 'text' v-model = "text"/>
          <p @click = "change">{{propOne}}<p/>
          <span v-show = "active">see me if active</span>
        </div>`,
        data() {
            return { text: 0 }
        },
        mounted() {
            console.log('this.changeProp', this.changeProp)
                // this.propOne = 'propOne   changed'
        }

    }
    // 关于组件命名，官方推荐   ‘CompOne’,   因为一个组件其实就是一个类，开头要大写，
    // 引用时，这样就行  <comp-one></comp-one>
Vue.component('CompOne', component)

new Vue({
    components: {
        CompOne: component
    },
    methods: {
        change() {
            this.propOne += 1
        }
    },
    el: '#root',
    template: `
    <div>
      <comp-one :changeProp = "change" :active = "true"
      :propOne = "propOne"></comp-one>
      <comp-one @change = "change" :active = "false" prop-one = "prop-one"></comp-one>
    </div>
    `,
    data: {
        propOne: 'text'
    }
})
