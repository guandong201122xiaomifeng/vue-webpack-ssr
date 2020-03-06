import Vue from 'vue'

new Vue({
    el: '#root',
    template: `
    <div>
      <p> Name : {{name}} </p>
      <p> Name : {{getName()}}</p>
      <p> number: {{number}}</p>
      <p> fullName: {{fullName}}</p>
      <p> <input v-model = "number"/></p>
      <p> firstName: <input v-model = "firstName"/></p>
      <p> lastName: <input v-model = "lastName"/></p>
      <p> name: <input v-model = "name"/></p>
      <p> obj.a: <input v-model = "obj.a"/></p>
    </div>
    `,
    data: {
        firstName: 'Jocky',
        lastName: 'Lou',
        number: 0,
        fullName: '',
        obj: { a: '123' }
    },
    computed: {

        name: {
            get() {
                    // this.name += '789'
                    console.log('name get')
                    return `${this.firstName} ${this.lastName}`
                }
                //  不到万不得已，不要给computed属性name设值
                // set(newName) {
                //     console.log('name set')
                //     const names = newName.split(' ')
                //     this.firstName = names[0]
                //     this.lastName = names[1]
                // }
        }
        // name() {
        //     console.log('computed')
        //     return `${this.firstName} ${this.lastName}`
        // }
    },
    methods: {
        getName() {
            console.log('getName invoked')
            return `${this.firstName} ${this.lastName}`
        }
    },
    watch: {
        'obj.a': {
            handler() {
                console.log('obj changed')
                    // 无限循环
                    // this.obj.a += 1
            }
        },
        // obj: {
        //     handler() {
        //         console.log('obj changed')
        //     },
        //     deep: true
        // },
        firstName: {
            handler(newName, oldName) {
                console.log('watch')
                this.fullName = newName + this.lastName
            },
            immediate: true
        }
        // firstName(newName, oldName) {
        //     console.log('watch')
        //     this.fullName = newName + this.lastName
        // }
    }
})
