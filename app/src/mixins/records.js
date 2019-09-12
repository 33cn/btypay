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
        toDetail(val,from='') {
            // console.log(from)
            this.$store.commit('Records/RECORD_DETAIL',val);
            if(from == 'convert' || from == 11){
                this.$router.push({ name: 'convertDetail', params: { hash: val.hash } })
                return
            }
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
