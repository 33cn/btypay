<template>
    <div class="homeBack_container">
        <p @click="backhandle">返回</p>
    </div>
</template>

<script>
export default {
    methods:{
        backhandle(){
            this.$router.go(-1);
        }
    }
}
</script>

<style>
.homeBack_container{

}
</style>
