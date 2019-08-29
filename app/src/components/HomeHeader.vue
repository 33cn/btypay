<template>
    <div class="homeHeader_container" :style="isHidden?'display: none':'display:flex'">
        <p><img src="../assets/images/logo.png" alt=""></p>
        <!-- <p>比特元钱包</p> -->
        <!-- <input type="button" value="按钮1" @contextmenu.prevent="show1()">  -->
    </div>
</template>

<script>
export default {
    props:['isHidden'],
    // mounted(){
    //     console.log(this.isHidden)
    // }
}
</script>

<style lang='scss'>
.homeHeader_container{
    padding: 27px 0 37px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // display: none;
    p{
        &:nth-of-type(1){
            padding:0px 13px 0px 34px;
            img{
                width: 102px;
                height: 35px;
            }
        }
        &:nth-of-type(2){
            font-size:18px;
            font-family:MicrosoftYaHei;
            // font-family: "Hiragino Sans GB";
            font-weight:400;
            color:rgba(255,255,255,1);
        }
    }
}
</style>
