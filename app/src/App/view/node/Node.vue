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
                    <p class="add" @click="mainDialog=true">添加自定义节点</p>
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
        <el-dialog title="主链节点设置" :visible.sync="mainDialog" width='400px' :show-close=false class="mainNode">
            <p>请输入您要添加的主链节点地址，建议您使用默认的主链节点</p>
            <input type="text" class="mainAddress" v-model="mainData">
            <div slot="footer" class="dialog-footer">
                <el-button @click="mainDialog = false">取消</el-button>
                <el-button type="primary" @click="mainDialog = false">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="平行链节点设置" :visible.sync="paraDialog" width='400px' :show-close=false>
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
export default {
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
