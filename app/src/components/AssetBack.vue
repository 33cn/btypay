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
            this.$router.go(-1)
        }
    }
}
</script>

<style lang='scss'>
.assetBack_container{
    position: relative;
    margin-left: 25px;
    padding-top: 100px;
    p{
        &:nth-of-type(1){
            width: 25px;
            height: 22px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        &:nth-of-type(2){
            width: 100px;
            text-align: center;
            position: absolute;
            left: calc(50% - 50px);
            top: 103.5px;
            font-size:23px;
            font-family:MicrosoftYaHei;
            font-weight:bold;
            color:rgba(139,176,255,1);
            line-height: 1;
        }
    }
}
</style>
