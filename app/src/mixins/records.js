import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('Records')
export default {
    data() {
        return {
            TX_TYPE: {
                RECV: 1,
                SEND: 2,
                EXCHANGE: 3
            },
            list: []
        }
    },
    methods: {
        toDetail(val) {
            this.$router.push({ name: 'detail', params: { id: val.time } })
        }
    },
    computed: {
        ...mapState(['loadingData'])
    },
    watch: {
        'loadingData': function (val) {
            if (val instanceof Array) {
                this.list = this.list.concat(val)
            }
        }
    },

    mounted() {
        this.list = this.loadingData
        // console.log(this.$store.state.Records.loadingData)
    }
}