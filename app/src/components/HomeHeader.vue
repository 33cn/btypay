<template>
    <div class="homeHeader_container">
        <p><img src="../assets/images/logo.png" alt=""></p>
        <p>比特元钱包</p>
        <!-- <input type="button" value="按钮1" @contextmenu.prevent="show1()">  -->
    </div>
</template>

<script>
export default {
}
</script>

<style lang='scss'>
.homeHeader_container{
    padding: 27px 0 37px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p{
        &:nth-of-type(1){
            padding:0px 13px 0px 33px;
            img{
                width: 36px;
                height: 36px;
            }
        }
        &:nth-of-type(2){
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
    }
}
</style>
