<template>
    <div class="node_container">
        <header>
            <router-link :to="{ name: 'WalletIndex'}"><img src="../../../assets/images/close.png" alt=""></router-link>
            <p>节点设置</p>
            <p>保存</p>
        </header>
        <ul>
            <li>
                <p>主链节点设置</p>
                <div class="main">
                    <section class="up">
                        <!-- <p class="name">敢么（GMT）</p> -->
                        <p>http://gamemainnet-bty.token.io</p>
                    </section>
                    <p class="line"></p>
                    <p class="add">添加自定义节点</p>
                </div>
            </li>
            <li>
                <p>平行链节点设置</p>
                <div class="parallel">
                    <section class="up">
                        <p class="name">敢么（GMT）</p>
                        <p>http://gamemainnet-bty.token.io</p>
                    </section>
                    <p class="line"></p>
                    <p class="add">添加自定义节点</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    }
}
</script>

<style lang='scss'>
.node_container{
    padding-top: 100px;
    >header{
        margin: 0px 23px 61px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img{
            width: 20.7px;
        }
        p{
            color: #F5B947;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            &:nth-of-type(1){
                font-size: 23px;
            }
            &:nth-of-type(2){
                font-size: 18.5px;
            }
        }
    }
    ul{
        margin: 0 20px;
        li{
            margin-bottom: 44.5px;
            >p{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                line-height: 1;
                margin-bottom: 9px;
            }
            >div{
                background:rgba(251,251,251,1);
                border-radius:7.5px;
                padding: 25px 25px 19px 16px;
                section.up{
                    p{
                        font-size:18px;
                        font-family:MicrosoftYaHei;
                        font-weight:400;
                        color:rgba(22,42,84,1);
                    }
                }
                p.line{
                    height: 1px;
                    border:0.1px solid rgba(230,230,230,1);
                    margin: 11px 0 13.5px;
                }
                p.add{
                    font-size:18px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(28,192,198,1);
                    line-height:1;
                }
                &.main{

                }
                &.parallel{

                }
            }
        }
    }
}
</style>
