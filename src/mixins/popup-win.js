export default {
    data () {
        return {
            visible: true
        }
    },
    watch: {
        visible (newValue) {
            if (!newValue) {
                // some bug happened
                this.destroyElement()
                // this.$el.addEventListener('transitionend', this.destroyElement)
            }
        }
    },
    mounted () {
        document.body.appendChild(this.$el)
    },
    destroyed () {
        this.$el.parentNode.removeChild(this.$el)
    },
    methods: {
        destroyElement () {
            this.$destroy()
        },
        close () {
            this.visible = false
        }
    }
}