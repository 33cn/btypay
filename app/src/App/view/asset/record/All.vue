<template>
    <div class="all_Container">
        <ul>
            <li v-for="item in list" :key="item.time" @click="toDetail(item)">
                {{item.time}}
            </li>
        </ul>
    </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('Records')
export default {
    data(){
        return{
            list:[
                {time:'2019/07/31 12:34:32'},
                {time:'2019/07/31 12:34:31'},
                {time:'2019/07/31 12:34:33'},
                {time:'2019/07/31 12:34:36'},
                {time:'2019/07/31 12:34:21'},
                {time:'2019/07/31 12:34:43'},
                {time:'2019/07/31 12:34:52'},
                {time:'2019/07/31 12:34:61'},
                {time:'2019/07/31 12:34:73'},
                {time:'2019/07/31 12:34:82'},
                {time:'2019/07/31 12:34:01'},
                {time:'2019/07/31 12:34:93'},
                {time:'2019/07/30 12:34:32'},
                {time:'2019/07/30 12:34:31'},
                {time:'2019/07/30 12:34:33'},
                {time:'2019/07/30 12:34:36'},
                {time:'2019/07/30 12:34:21'},
                {time:'2019/07/30 12:34:43'},
                {time:'2019/07/30 12:34:52'},
                {time:'2019/07/30 12:34:61'},
                // {time:'2019/07/30 12:34:73'},
                // {time:'2019/07/30 12:34:82'},
                // {time:'2019/07/30 12:34:01'},
                // {time:'2019/07/30 12:34:93'},
                // {time:'2019/07/20 12:34:32'},
                // {time:'2019/07/20 12:34:31'},
                // {time:'2019/07/20 12:34:33'},
                // {time:'2019/07/20 12:34:36'},
                // {time:'2019/07/20 12:34:21'},
                // {time:'2019/07/20 12:34:43'},
                // {time:'2019/07/20 12:34:52'},
                // {time:'2019/07/20 12:34:61'},
                // {time:'2019/07/20 12:34:73'},
                // {time:'2019/07/20 12:34:82'},
                // {time:'2019/07/20 12:34:01'},
                // {time:'2019/07/20 12:34:93'},
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
        console.log(this.$store.state.Records.loadingData)
    }
}
</script>

<style lang='scss'>
.all_Container{

}
</style>
