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
                    <p class="add" @click="addMainNode">添加自定义节点</p>
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
                    <p class="add" @click="paraDialog=true">添加自定义节点</p>
                </div>
            </li>
        </ul>
        <el-dialog title="平行链节点设置" :visible.sync="paraDialog" width='400px' :show-close=false>
            <el-form :model="form" :rules="rules">
                <el-form-item label="平行链名称">
                    <el-input v-model="form.paraName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="代币名称">
                    <el-input v-model="form.coinName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="节点地址">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paraDialog = false">取 消</el-button>
                <el-button type="primary" @click="paraDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        var paraNameCheck = (rule, value, callback)=>{

        }
        return{
            paraDialog:false,
            form:{
                paraName:'',
                coinName:'',
                address:''
            },
            rules:{
                paraName: [{ validator: paraNameCheck, trigger: "blur" }],
            }
        }
    },
    methods:{
        addMainNode() {
            this.$prompt('请输入您要添加的主链节点地址，建议您使用默认的主链节点', '主链节点设置', {
                customClass:'addMain',
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              showClose:false
            }).then(() => {
                this.$message({
                  type: 'info',
                  message: '保存修改'
                });
            })
            .catch(action => {
              this.$message({
                type: 'info',
                message: action === 'cancel'
                  ? '放弃保存并离开页面'
                  : '停留在当前页面'
              })
            });
        },
        addParaNode(){

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
    .el-dialog__wrapper{
        background:rgba(98,119,218,0.65);
        .el-dialog{
            background-color: transparent;
            background-image: url('../../../assets/images/addParaBg.png');
            background-size: 100% 100%;
            padding: 20px 50px;
        }
        
    }
}
.el-message-box__wrapper{
    background:rgba(98,119,218,0.65);
    .el-message-box{
        width: calc(100% - 0px);
        padding: 28px 35px 50px;
        background-color: transparent;
        border: none;
        background-image: url('../../../assets/images/addMainBg.png');
        background-size: 100% 100%;
        div.el-message-box__header{
            text-align: center;
            font-size:20px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(22,42,84,1);
            line-height:1;
        }
        div.el-message-box__content{
            p{
                font-size:18px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(22,42,84,0.68);
                line-height:1;
            }
            input{
                height: 30px;
                background-color: transparent;
                border: none;
                border-bottom: 1px solid rgba(22,42,84,0.23);
                border-radius: 0px;
                padding: 10px 0 0 0;
            }
        }
        div.el-message-box__btns{
            display: flex;
            justify-content: center;
            button{
                width: 82px;
                padding: 5px;
                border-radius:10px;
                font-size:20px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(33,123,244,1);
                line-height:1;
                &:nth-of-type(1){
                    margin-right: 46px;
                    border:1px solid rgba(33,123,244,1);
                }
                &:nth-of-type(2){
                    color: #fff;
                    background-color: rgba(33,123,244,1)!important;
                }
                &.el-button--primary{
                    background: rgba(33,123,244,1);
                }
            }
        }
    }
}
</style>
