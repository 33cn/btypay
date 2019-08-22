<template>
    <div class="assetBack_container">
        <p @click="backHandle"><img src="../assets/images/back.png" alt=""></p>
        <p>{{title}}</p>
    </div>
</template>

<script>
export default {
    props:{
        'title':{
			type:String,
			require:true
		}
    },
    methods:{
        backHandle(){
            if(this.title == 'BTY转账'){
                console.log(this.$store.state.Records.assetType)
                if(this.$store.state.Records.assetType == 'bty'){
                    this.$router.push({ path: "/coin?coin=bty" });
                }else{
                    this.$router.push({ path: "/coin?coin=game" });
                }
                // this.$router.push({name:'bty'})
                return
            }
            this.$router.go(-1)
        }
    },
}
</script>

<style lang='scss'>
.assetBack_container{
    position: relative;
    padding-top: 106px;
    p{
        &:nth-of-type(1){
            margin-left: 41px;
            width: 25px;
            height: 22px;
            img{
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        }
        &:nth-of-type(2){
            width: 100px;
            text-align: center;
            position: absolute;
            left: calc(50% - 50px);
            top: 105px;
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:bold;
            color:rgba(139,176,255,1);
            line-height: 1;
        }
    }
}
</style>
