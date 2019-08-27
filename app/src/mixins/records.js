import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('Records')

export default {
    data() {
        return {
            TX_TYPE: {
                RECV: 1,
                SEND: 2,
                EXCHANGE: 3
            }
        }
    },
    methods: {
        toDetail(val) {
            this.$store.commit('Records/RECORD_DETAIL',val);
            this.$router.push({ name: 'detail', params: { hash: val.hash } })
        }
    },
    computed: {
        ...mapState(['recordData'])
    },

    // mounted() {
    //     this.list = this.loadingData
    // }
}
