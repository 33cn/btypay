<template>
    <div class="node_container">
        <home-header></home-header>
        <section class="header">
            <router-link :to="{ name: 'WalletIndex'}"><img src="../../../assets/images/close.png" alt=""></router-link>
            <p>节点设置</p>
            <p>保存</p>
        </section>
        <ul>
            <li>
                <p>主链节点设置</p>
                <div class="main">
                    <section class="up">
                        <!-- <p class="name">敢么（GMT）</p> -->
                        <div>
                            <p>http://gamemainnet-bty.token.io</p>
                            <img src="../../../assets/images/selected.png" alt="">
                            <p class="line"></p>
                        </div>
                    </section>
                    <p class="add" @click="mainDialog=true">添加自定义节点</p>
                </div>
            </li>
            <li>
                <p>平行链节点设置</p>
                <div class="parallel">
                    <section class="up">
                        <div>
                            <p class="name">敢么（GMT）</p>
                            <p>http://gamemainnet-bty.token.io</p>
                            <img src="../../../assets/images/selected.png" alt="">
                            <p class="line"></p>
                        </div>
                    </section>
                    <p class="add" @click="paraDialog=true">添加自定义节点</p>
                </div>
            </li>
        </ul>
        <el-dialog title="主链节点设置" :visible.sync="mainDialog" width='370px' :show-close=false class="mainNode">
            <p>请输入您要添加的主链节点地址，建议您使用默认的主链节点</p>
            <input type="text" class="mainAddress" v-model="mainData">
            <div slot="footer" class="dialog-footer">
                <el-button @click="mainDialog = false">取消</el-button>
                <el-button type="primary" @click="mainDialog = false">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="平行链节点设置" :visible.sync="paraDialog" width='369px' :show-close=false class="paraNode">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="平行链名称" prop="paraName">
                    <el-input v-model="form.paraName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="代币名称" prop="coinName">
                    <el-input v-model="form.coinName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="节点地址" prop="address">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paraDialog = false">取消</el-button>
                <el-button type="primary" @click="paraSubmit('ruleForm')">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
export default {
    components: { HomeHeader },
    data(){
        let paraNameCheck = (rule, value, callback)=>{
            if (value == "") {
              callback(new Error("请输入平行链名称"));
            }
        }
        let coinNameCheck = (rule, value, callback)=>{
            if (value == "") {
              callback(new Error("请输入代币名称"));
            }
        }
        let addressCheck = (rule, value, callback)=>{
            if (value == "") {
              callback(new Error("请输入节点地址"));
            }
        }
        return{
            mainDialog:false,
            paraDialog:false,
            mainData:'',
            form:{
                paraName:'',
                coinName:'',
                address:''
            },
            rules:{
                paraName: [{ validator: paraNameCheck, trigger: "blur" }],
                coinName: [{ validator: coinNameCheck, trigger: "blur" }],
                address: [{ validator: addressCheck, trigger: "blur" }],
            }
        }
    },
    methods:{
        paraSubmit(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                  alert("submit!");
                } else {
                  console.log("error submit!!");
                  return false;
                }
            });
        }
    },
    watch:{
        paraDialog(val){
            if(!val){
                this.$refs['ruleForm'].resetFields();
            }
        }
    }
}
</script>

<style lang='scss'>
.node_container{
    >section.header{
        margin: 9px 55px 43px 41px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img{
            width: 22px;
        }
        p{
            color: #F5B947;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            &:nth-of-type(1){
                font-size: 18px;
            }
            &:nth-of-type(2){
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
    ul{
        height: calc(100vh - 101px - 78px - 10px);
        overflow-y: scroll;
        margin: 0 26px 0 31px;
        li{
            margin-bottom: 36px;
            >p{
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                margin-bottom: 11px;
            }
            >div{
                background:rgba(251,251,251,1);
                border-radius:10px;
                padding: 19px 51px 24px 24px;
                section.up{
                    div{
                        position: relative;
                        p{
                            font-size:14px;
                            font-family:MicrosoftYaHei;
                            font-weight:400;
                            color:rgba(22,42,84,1);
                        }
                        img{
                            width: 18px;
                            position: absolute;
                            right: -37px;
                            bottom: -1px;
                        }
                        
                        p.name{
                            font-size: 12px;
                            color:rgba(22,42,84,1);
                            margin-bottom: 9px;
                        }
                    }
                }
                p.line{
                    height: 1px;
                    border:0.1px solid rgba(230,230,230,1);
                    margin: 10px 0 8px;
                }
                p.add{
                    font-size:12px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(28,192,198,1);
                    &:hover{
                      cursor: pointer;
                    }
                }
                &.main{
                    
                }
                &.parallel{
                    padding-bottom: 18px;
                    p.line{
                        margin-top: 5px;
                    }
                    .up{
                        img{
                            bottom: 16px;
                        }
                    }
                }
            }
        }
    }
    .el-dialog__wrapper{
        .el-dialog{
            background-image: url('../../../assets/images/addParaBg.png');
            background-size: 100% 100%;
        }
        &.mainNode{
            .el-dialog{
                background-image: url('../../../assets/images/addMainBg.png');
            }
        }
    }
}
div.el-form-item__error{
    top: calc(100% - 11px);
}
</style>
