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
            list: [
            ]
        }
    },
    methods: {
        toDetail(val) {
            this.$store.commit('Records/RECORD_DETAIL',val);
            this.$router.push({ name: 'detail', params: { hash: val.hash } })
        }
    },
    computed: {
        ...mapState(['loadingData'])
    },
    watch: {
        'loadingData': function (val) {
            console.log('watch')
            if (val instanceof Array) {
                this.list = this.list.concat(val)
                console.log(this.list)
            }
        }
    },
    mounted() {
        this.list = this.loadingData;
        
        // console.log(this.$store.state.Records.loadingData)
    }
}