<template>
    <div class="transferRecord_Container">
        <ul>
            <li v-for="item in list" :key="item.time">
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
                {time:'2018/07/31 12:34:32'},
                {time:'2018/07/31 12:34:33'},
                {time:'2018/07/31 12:34:34'},
            ]
        }
    }
}
</script>

<style lang='scss'>
.transferRecord_Container{

}
</style>
