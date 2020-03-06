<script>
import TabContainer from './tab-container.vue'
export default {
  name: 'Tabs',
  components: {
    TabContainer
  },
  methods: {
    onChange(index) {
      this.$emit('change', index)
    }
  },
  data() {
    return {
      panes: []
    }
  },
  provide() {
    const data = {}
    Object.defineProperty(data, 'value', {
      get: () => this.value,
      enumerable: true
    })
    return {
      // value: this.value
      data
    }
  },
  props: {
    // 要通过value来控制那个tab
    value: {
      type: [String, Number],
      required: true
    }
  },
  render () {
    return (
      <div class = 'tabs'>
        <ul class = 'tabs-header'>
          { this.$slots.default }
        </ul>
        <tab-container panes = {this.panes}></tab-container>
      </div>
    )
  }
}
</script>
<style lang="stylus" scoped>
.tabs-header
  display flex
  margin  0
</style>

