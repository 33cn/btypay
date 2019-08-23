<template>
    <div class="login_container">
        <home-header></home-header>
        <div>
            <p>欢迎回来</p>
            <el-form
                label-position="top"
                :rules="rules"
                :model="form"
                ref="createForm"
                class="password"
            >
                <el-form-item label="请输入您的密码" prop="pwd">
                  <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <footer>
            <p><router-link :to="{ name: 'ImportWallet'}">导入</router-link></p>
            <p><router-link :to="{ name: 'CreateWallet'}">创建</router-link></p>
        </footer>
    </div>
</template>
<script>
import HomeHeader from "@/components/HomeHeader.vue";
export default{
    components: { HomeHeader },
    data(){
        return{
            form: {
              password: "",
            },
            rules: {
              pwd: [
                { required: true, message: "请输入您的密码", trigger: "blur" },
                { min: 8, max: 16, message: "8 到 16位字符", trigger: "blur" }
              ],
            }
        }
    }
}

</script>
<style lang='scss'>
.login_container{

}
</style>