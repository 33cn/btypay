<template>
    <div class="convertD_Container">
        <ul>
            <li v-for="item in list" :key="item.time" @click="toDetail(item)">
                <div>
                    <img src="../../../../assets/images/transferLogo.png" alt="">
                    <!-- <img :src="item.type==1?'../../../../assets/images/receiptLogo.png':'../../../../assets/images/transferLogo.png'" alt=""> -->
                    <div>
                        <p>{{item.address}}</p>
                        <p>{{item.time}}</p>
                    </div>
                </div>
                <p :class="item.type==1?'transfer':'receipt'">{{item.type==2?'+':'-'}}{{item.value}}</p>
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
                {type:1,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:100,time:'2019/09/09 10:23:23'},
                {type:2,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:100,time:'2019/09/01 10:23:23'},
                {type:1,address:'sdgsdhfsdhsdhfdsgfsdgfdsf',value:100,time:'2019/09/02 10:23:23'},
            ]
        }
    },
    methods:{
        toDetail(val){
            this.$router.push({name:'convertDetail',params:{id:val.time}})
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
.convertD_Container{
    ul{
        li{
            width: calc(100% - 26px);
            background-image: url('../../../../assets/images/txBg.png');
            background-size: 100% 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 10px 0 16px;
            padding: 18px 0px 40px 12px;
            >div{
                display: flex;
                justify-content: space-between;
                align-items: center;
                img{
                    width: 36.5px;
                    margin-right: 5px;
                }
                div{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    p{
                        font-family:MicrosoftYaHei;
                        font-weight:400;
                        line-height:1;
                        &:nth-of-type(1){
                            width: 150px;
                            font-size:23px;
                            color:rgba(51,51,51,1);
                            margin-bottom: 12px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        &:nth-of-type(2){
                            font-size:16.5px;
                            color:rgba(171,177,193,0.62);
                        }
                    }
                }
            }
            p{
                font-size:23px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height:1;
                margin-right: 25px;
                &.transfer{
                    color:rgba(59,225,237,1);
                }
                &.receipt{
                    color:rgba(255,179,89,1);
                }
            }
        }
    }
}
</style>
