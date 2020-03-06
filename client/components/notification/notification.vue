<template>
  <transition name = "fade" @after-leave = "afterLeave" @after-enter = "afterEnter">
    <div
      class = "notification"
      :style = "style"
      v-show = "visible"
      @mouseenter="clearTimer"
      @mouseleave="createTimer"
    >
      <span class="content">{{content}}</span>
      <a class="btn" @click = "handleClose">{{ btn }}</a>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'notification',
    props: {
      content: {
        type: String,
        required: true
      },
      btn: {
        type: String,
        default: '关闭'
      }
    },
    data () {
      return {
        visible: false
      }
    },
    computed: {
      style () {
        return {}
      }
    },
    methods: {
      handleClose(e) {
        e.preventDefault()
        this.$emit('close')
      },
      afterLeave() {
        this.$emit('closed')
      },
      // 外面可以覆盖，但是这里必须声明，没声明会报错
      afterEnter() {},
      clearTimer() {},
      createTimer() {}
    }
  }
</script>

<style lang="stylus" scoped>
.notification
  display flex
  background-color #303030
  color rgba(255, 255, 255, 1)
  align-items center
  padding 20px
  position fixed
  box-shadow 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 1) inset
  flex-wrap wrap
  transition all .3s
.content
  padding 0
.btn
  color #ff4081
  padding-left 24px
  margin-left auto
  cursor pointer
</style>
