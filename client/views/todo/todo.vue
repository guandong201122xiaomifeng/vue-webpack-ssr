<template>
  <section class="real-app">
    <div class="tab-container">
      <tabs :value = "filter" @change = "handleChangeTab">
        <tab :label = "tab" :index = "tab"  v-for = "tab in stats" :key = "tab">
        </tab>
        <!-- <tab label = "tab1" index = "1">
          <span>tab content 1 {{inputContent}}</span>
        </tab>
        <tab index = "2">
          <span slot = "label" style = "color: red">
            tab2
          </span>
          <span>tab content 2</span>
        </tab>
        <tab label = "tab3" index = "3">
          <span>tab content 3</span>
        </tab> -->
      </tabs>
    </div>
    <router-view></router-view>
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来要做什么"
      @keyup.enter="handleAdd"
    />
    <Item
      :todo="todo"
      v-for="todo in filteredTodos"
      :key="todo.id"
      @del="deleteTodo"
      @toggle="toggleTodoState"
    />
    <Helper
      :filter="filter"
      :todos="todos"
      @clearAllCompleted="clearAllCompleted"
    ></Helper>
  </section>
</template>

<script>
import Item from './item.vue'
import Helper from './helper.vue'
import { mapState, mapActions } from 'vuex'
// let id = 0
export default {
  metaInfo: {
    title: 'The Todo App'
  },
  beforeRouteEnter(to, from, next) {
    //  这个钩子之前，this是拿不到的,拿不到上下文，next()之前组件没有被创建
    console.log('todo route enter', this)
    // 但是next方法接收一个方法，vm是创建后的this对象
    next(vm => {
      // vm是组件被创建之后的this对象
      // 可以这样拿到vm里面的数据，塞到组件里面
      console.log('vm.id', vm.id)
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 可以在这里对/app/:id的路由id值进行判断，拦截，不用增加watch开销
    console.log('todo route Update', this)
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 如果用户填了一个表单，修改了点内容，弹个confirm框，问是否要修改，
    // 根据用户需要决定走不走下一步next()
    console.log('todo route Leave', this)
    // if (global.confirm('are you sure?')) {
      next()
    // }
  },
  // beforeCreate() {
  //   console.log('beforeCreate123')
  // },
  // 这个只是个方法，不是钩子函数，不会被执行
  asyncData({ store, router }) {
    // fetchTodos返回的是的promise
    if (store.state.user) {
      // 登录的状态下
      return store.dispatch('fetchTodos')
    }
    // 没有登录重定向到/login
    router.replace('/login')
    return Promise.resolve()
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(123)
    //   }, 1000)
    // })
  },
  mounted() {
    if (this.todos && this.todos.length < 1) {
      // 当store.state里面的todos没有数据时才调用
      this.fetchTodos()
    }
    //  如果是/app/:id这种情况，从/app/1切换到/app/89这样，
    // mounted钩子不会调用，这时这里的代码不会跑，得用beforeRouteUpdate
    // 或者watch,但是watch会比较麻烦一点，而且不能控制路由的跳转行为
    // console.log('todo mounted')
  },
  props: ['id'],
  data() {
    return {
      // todos: [],
      todo: {
        id: 0,
        content: 'this is todo',
        completed: false
      },
      filter: 'all',
      stats: ['all', 'active', 'completed']
    }
  },
  components: {
    Item,
    Helper
  },
  computed: {
    ...mapState(['todos']),
    filteredTodos() {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo => todo.completed === completed)
    }
  },
  methods: {
    ...mapActions([
      'fetchTodos',
      'addTodo',
      'deleteTodo',
      'updateTodo',
      'deleteAllCompleted'
      ]),
    handleAdd(e) {
      const content = e.target.value.trim()
      if (!content) {
        this.$notify({
          content: '必须输入要做的内容'
        })
        return
      }
      const todo = {
        content,
        completed: false
      }
      this.addTodo(todo)
      // this.todos.unshift({
      //   id: id++,
      //   content: e.target.value.trim(),
      //   completed: false
      // })
      e.target.value = ''
      // this.inputContent = ''
    },
    // deleteTodo(id) {
    //   this.todos.splice(
    //     this.todos.findIndex(todo => todo.id === id),
    //     1
    //   )
    // },
    handleChangeTab(value) {
      this.filter = value
    },
    toggleTodoState(todo) {
      this.updateTodo({
        id: todo.id,
        // 这里不能直接修改todo.completed，因为todo是store里面的数据
        // 要通过Object.assgin拷贝一下
        todo: Object.assign({}, todo, {
          completed: !todo.completed
        })
      })
    },
    clearAllCompleted() {
      this.deleteAllCompleted()
    }
  }
}
</script>

<style lang="stylus" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

.add-input {
  position: relative;
  font-size: 24px;
  color: inherit;
  padding: 6;
  border: 1px solid #999;
  box-sizing: border-box;
}
.tab-container
  background-color #ffffff
  padding 0 15px
</style>
