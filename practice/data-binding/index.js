import Vue from 'vue'

var globalVal = '123' //  eslint-disable-line
new Vue({
    el: '#root',
    // template: `
    // <div>
    //   <span>{{html}}</span>
    //   <p v-html = 'html'></p>
    //   </div>
    // `,
    template: `
    <div :class = "[{ active:!isActive },'abc']"
          :style = "[style1,style2]"
    >
      <p v-html = 'html'></p>
      </div>
    `,
    data: {
        style1: {
            color: 'red',
            appearance: 'none' //  谷歌会把它改成-webkit-appearance: none
        },
        style2: { background: 'black' },
        isActive: false,
        html: '<span>123</span>'
    }
})
