<template>
  <div id="app">
    <div id="loading" v-show = "loading">
      <loading></loading>
    </div>
    <Header><div>456</div></Header>
    <!-- <p style = 'color: red'>a模块里的textPlus {{textPlus}}</p> -->
    <p>{{fullName}} {{counter}}</p>
    <p>{{appTest}}</p>
    <!-- <p>textA {{textA}}</p>
    <p>textC {{textC}}</p> -->
    <router-link :to = "{name:'app'}">app</router-link>
    <router-link to = "/app/1">app1</router-link>
    <router-link to = "/app/456">app456</router-link>
    <router-link to = '/login?login=1'>login</router-link>
    <router-link to = '/login/exact?exact=1'>login exact</router-link>
    <!-- <Todo></Todo> -->
    <!-- 加上这个路由配置才算成功了 -->

    <transition name = "fade" mode="out-in">
      <router-view></router-view>
    </transition>
      <!-- tabs应该是这样使用 -->
    <!-- <tabs>
      <tab label = "text">
        <span slot = "label">定义label的html</span>
        <p slot = "content">this is tab content</p>
      </tab>
    </tabs> -->
    <!-- <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class = "tab-container">
      <p slot = "content">this is tab content</p>
    </div> -->
    <!-- <notification content = "test notify"/> -->
    <button @click = "notify">click me</button>
    <Footer></Footer>
    <!-- <router-view name = "a"></router-view> -->
  </div>
</template>
<script>

import {
  mapState, mapGetters, mapMutations, mapActions
  // mapGetters
} from 'vuex'
// mapState,mapGetters都是帮助方法
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
import Loading from './components/loading/loading.vue'

// import Todo from './views/todo/todo.vue'
import './assets/styles/global.styl'
console.log(Header.__docs)
export default {
  MetaInfo: {
    title: 'Jocky\' Todo App'
  },
  data() {
    return {
      appTest: 'appTest1'
    }
  },
  components: {
    Header,
    Footer,
    Loading
    // Todo
  },
  mounted () {
    console.log('this.$route', this.$route)
    // this['a/add']()
    // this['b/testAction']()
    // let i = 1
    // console.log('mounted', this.$store, this.textPlus)
    // this['a/updateText']('a.mutaiton')
    // this.$store.state.count = 3
    // this.$store.dispatch('updateCountAsync', {
    //   num: 5,
    //   time: 2000
    // })
    // this.updateCountAsync({
    //   num: 5,
    //   time: 2000
    // })

    // setInterval(() => {
    //   this.updateCount({
    //     num: i++,
    //     num2: 2
    //   })
      // this.$store.commit('updateCount', {
      //   num: i++,
      //   num2: 2
      // })
    // }, 1000)
  },
  methods: {
    notify() {
      this.$notify({
        content: 'test $notify',
        btn: 'close'
      })
    },
    ...mapActions(['updateCountAsync']),
    // ...mapActions(['updateCountAsync', 'a/add', 'b/testAction']),
    // ...mapMutations(['updateCount', 'a/updateText'])
    ...mapMutations(['updateCount'])
  },
  computed: {
    // textA() {
    //   // 可以根据模块名获取要用到的数据
    //   return this.$store.state.a.text
    // },

    // ...mapState(['count']),
    // 把count改成counter
    ...mapState({
      counter: 'count',
      loading: 'loading'
    }),
    // 如果需要计算那么用下面这个方法会更好
    // ...mapState({
    //   counter: (state) => state.count
    //   // textA: state => state.a.text,
    //   // textC: state => state.c.textC
    // }),
    // count() {
    //   return this.$store.state.count
    // },

    ...mapGetters({
      'fullName': 'fullName'
      // 下面这个fullName表示{fullName: fullName},这样右边fullName是个变量
      // fullName,
      // textPlus: 'a/textPlus'
    })
    // fullName() {
    //   return this.$store.getters.fullName
    // }
  }
}
</script>
<style lang = "stylus" scoped>
#app{
  position absolute
  left 0
  right 0
  top 0
  bottom 0
}
#cover{
  position absolute
  left 0
  right 0
  top 0
  bottom 0
}
#loading{
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(255,255,255,.3)
  z-index 99
  display flex
  align-items center
  justify-content center
}
</style>
