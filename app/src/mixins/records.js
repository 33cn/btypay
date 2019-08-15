import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('Records')
export default{
    data(){
        return{
            list:[
                {type:1,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:100,time:'2019/09/09 10:23:23'},
                {type:2,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:200,time:'2019/09/01 10:23:23'},
                {type:3,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:300,time:'2019/09/02 10:23:23'},
                {type:3,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:300,time:'2019/09/03 10:23:23'},
            ]
        }
    },
    methods:{
        toDetail(val){
            this.$router.push({name:'detail',params:{id:val.time}})
        }
    },
    computed:{
        ...mapState(['loadingData'])
    },
    watch:{
        'loadingData':function(val){
            console.log(val instanceof Array)
            if(val instanceof Array){
                this.list = this.list.concat(val)
            }
        }
    },
    mounted(){
        // console.log(this.$store.state.Records.loadingData)
    }
}