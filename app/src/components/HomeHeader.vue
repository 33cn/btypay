<template>
    <div class="homeHeader_container">
        <p><img src="../assets/images/logo.png" alt=""></p>
        <p>比特元钱包</p>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
.homeHeader_container{
    padding: 20.7px 0 26.8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
        &:nth-of-type(1){
            padding:0px 23px 0px 28px;
            img{
                width: 55px;
                height: 55px;
            }
        }
        &:nth-of-type(2){
            font-size:23px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
    }
}
</style>
