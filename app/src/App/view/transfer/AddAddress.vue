<template>
    <div class="addAddress_container">
        <asset-back title='添加地址'></asset-back>
        <section class="content">
            <div>
                <p>地址标签</p>
                <input type="text" placeholder="请输入标签内容">
            </div>
            <div>
                <p>地址</p>
                <input class="address" type="text" placeholder="请输入地址">
                <img src="../../../assets/images/scan.png" alt="">
            </div>
        </section>
    </div>
</template>

<script>
import AssetBack from '@/components/AssetBack.vue'
export default {
    components:{AssetBack},
}
</script>

<style lang='scss'>
.addAddress_container{
    width: 100%;
    height: 100vh;
    background-image: url('../../../assets/images/lightColorBg.png');
    background-size: 100% 100%;
    >section.content{
        margin: 69px 63px 0 25px;
        div{
            position: relative;
            margin-bottom: 40px;
            p{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,1);
                line-height:1;
                margin-bottom: 25px;
            }
            input{
                width: 100%;
                border:none;
                background-color: transparent;
                border-bottom: 1px solid #A8B1BD;
                font-size: 18px;
                color:rgba(22,42,84,1);
                opacity:0.8;
                &.address{
                    padding-right: 35px;
                }
                ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
		        	opacity:0.5;
		        }
		        ::-moz-placeholder { /* Firefox 19+ */  
		        	opacity:0.5;
		        }
		        :-ms-input-placeholder { /* IE 10+ */ 
                    opacity:0.5;
		        }
		        :-moz-placeholder { /* Firefox 18- */ 
                    opacity:0.5;
                }
            }
            img{
                width: 23px;
                position: absolute;
                right: 0px;
            }
        }
    }
}
</style>
