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
export default {
    data(){
        return{
            list:[
                {time:'2019/07/31 12:34:32'},
                {time:'2019/07/31 12:34:31'},
                {time:'2019/07/31 12:34:33'},
            ]
        }
    },
    methods:{
        toDetail(val){
            this.$router.push({name:'detail',params:{id:val.time}})
        }
    }
}
</script>

<style lang='scss'>
.all_Container{

}
</style>
