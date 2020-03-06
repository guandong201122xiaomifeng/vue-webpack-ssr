import Vue from 'vue'

new Vue({
    el: '#root',
    template: `
    <div>
      <div v-pre>{{text}}</div>
      <div v-text = "text"></div>
      <div v-if = "active" v-text = "text">456</div>
      <div v-else-if = "text > 5"> else-if content</div>
      <div v-else>else content</div>
      <div v-html = "html"></div>
      <input type = "text" v-model.lazy = "text"/>
      <input type = "checkbox" v-model = "active"/>
      <input type = "checkbox" :value = "1" v-model = "arr"/>
      <input type = "checkbox" :value = "2" v-model = "arr"/>
      <input type = "checkbox" :value = "3" v-model = "arr"/>
      <div>
        <input type = "radio" value = "one" v-model = "picked"/>
        <input type = "radio" value = "two" v-model = "picked"/>
      </div>

      <ul>
        <li v-for = "(item,index) in arr" :key = "item">{{item}}:{{index}}</li>
        <li v-for = "(val,key,index) in obj" :key = "key">{{val}}:{{key}}:{{index}}</li>
      </ul>
    </div>
    `,
    data: {
        picked: '',
        arr: [1, 2, 3],
        obj: {
            a: '123',
            b: '456',
            c: '789'
        },
        active: false,
        text: 5,
        html: `<span>html<span>`
    },
    mounted() {
        // this.obj = {
        //     a: '951',
        //     b: '456',
        //     c: '789'
        // }
    }
})
