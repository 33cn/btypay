<template>
    <div class="assetBack_container">
        <p @click="backHandle">back</p>
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
    p{
        &:nth-of-type(1){
            width: 50px;
        }
        &:nth-of-type(2){
            width: 100px;
            text-align: center;
            position: absolute;
            left: calc(50vw - 50px);
            top: 10px;
        }
    }
}
</style>
