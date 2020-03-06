import Notification from './notification.vue'

export default {
    extends: Notification,
    computed: {
        // 覆盖./notification.vue里面的style
        style() {
            return {
                position: 'fixed',
                right: '20px',
                bottom: `${this.verticalOffset}px`
            }
        }
    },
    mounted() {
        this.createTimer()
    },
    methods: {
        createTimer() {
            if (this.autoClose) {
                this.timer = setTimeout(() => {
                    this.visible = false
                }, this.autoClose)
            }
        },
        clearTimer() {
            // 定时器占用一定的内存
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },
        afterEnter() {
            this.height = this.$el.offsetHeight
        }
    },
    beforeDestroy() {
        this.createTimer()
    },
    data() {
        return {
            verticalOffset: 0,
            autoClose: 3000,
            height: 0
        }
    }
}
