<script>
export default {
  name: 'Tab',
  props: {
    index: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      default: 'tab'
    }
  },
  inject: ['data'],
  computed: {
    active () {
      // this.$parent指定就是tabs组件实例
      // 如果不用provide inject 可以用这样
      // return this.$parent.value === this.index
      // 使用provide inject 可以用这样,但是不会时时监听
      // 要Object.defineProperty处理一下
      return this.data.value === this.index
    }
  },
  methods: {
    handleClick() {
      this.$parent.onChange(this.index)
    }
  },
  mounted() {
    this.$parent.panes.push(this)
  },
  render () {
    const tab = this.$slots.label || <span>{this.label}</span>
    const classNames = {
      tab: true,
      active: this.active
    }
    return (
      <li class = {classNames} on-click = {this.handleClick}>
        {tab}
      </li>
    )
  }
}
</script>
<style lang = "stylus" scoped>
.tab
  list-style none
  line-height 40px
  margin-right 30px
  position relative
  cursor pointer
  &.active
    border-bottom 2px solid blue
  &.last-child
    margin-right 0
</style>
