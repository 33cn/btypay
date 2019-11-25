<template>
    <div class="exportAccount_container">
        <section>
            {{mnemonic}}
        </section>
        <section>
            {{hexPrivateKey}}
        </section>
    </div>
</template>
<script>
export default {
    data(){
        return{
            mnemonic:'',
        }
    },
    computed:{
        hexPrivateKey(){
            return this.$store.state.Account.hexPrivateKey;
        },
        password(){
            return this.$store.state.Account.password;
        }
    },
    methods:{
        getSeed(){
            getChromeStorage("ciphertext").then(result => {
                console.log("result");
                console.log(result);
                this.mnemonic = decrypt(result.ciphertext, this.password);
                console.log(this.mnemonic)
            })
        }
    },
    mounted(){
        this.getSeed()
    }
}
</script>
<style lang="scss">
div.exportAccount_container{

}
</style>