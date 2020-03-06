import Vue from 'vue'

const component = {
    // template: `
    //     <div :style = "styles">
    //       <slot></slot>
    //     </div>`,
    props: ['props1'],
    render(h) {
        //  return 出来的是vnode的一个类，是内存里类似于dom结构的结构，
        // 会跟真正的dom结构进行对比，如果需要更新，才会转化为真正的dom结构
        return h('div', {
            style: this.styles
                // on: { click: () => { this.$emit('click') } }
                // this.$slots拿到的就是传进来的html节点，没表明slot的是
                // this.$slots.default,有表明slot="aaa"的是this.$slots.aaa
        }, [this.$slots.default, this.props1])
    },
    mounted() {
        console.log('this.props1', this.props1)
        console.log('this.$slots.default', this.$slots.header)
    },
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
    data: {
        value: '123'
    },
    el: '#root',
    // template: `
    //   <div>
    //     <comp-one ref = "comp">
    //       <span ref = "span">{{value}}</span>
    //     </comp-one>
    //   </div>
    //   `,
    render(createElement) {
        return createElement(
            'comp-one', {
                ref: 'comp',
                props: {
                    props1: this.value
                },
                // 如果nativeOn绑定到组件上面，那么是绑定到该组件的根节点
                // 上，组件内部不需要再写on来绑定事件
                nativeOn: {
                    click: () => {
                        this.handleClick()
                    }
                }
                // 如果on绑在组件上，那么组件内部根节点需要用on绑定事件，出发$emit('事件名')
                // 如果on绑定在节点上，那么该节点不需要做什么处理，事件发生时就会调用函数
                // on: {
                //     click: () => {
                //         this.handleClick()
                //     }
                // }
            },
            // 子节点的话需要数组，如果时文本内容不需要数组
            [
                createElement('span', {
                    ref: 'span',
                    // 表明这个节点的slot属性，不是default
                    // slot: 'header',
                    attrs: {
                        id: 'test-id',
                        class: 'abc',
                        style: 'color: red'
                    },
                    domProps: {
                        innerText: 369
                            // innerHtml: '<span>159</span>'
                    }
                    // domProps: {
                    //     // innerText: 369
                    //     innerHtml: '<span>159</span>'
                    // }
                }, this.value)
            ]
        )
    },
    methods: {
        handleClick() {
            console.log('clicked')
        }

    },
    mounted() {
        console.log(this.$refs)
    }
})
