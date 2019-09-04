<template>
  <img class="svg-icon" v-if="icon" :src="require(`../assets/svg/icon-${icon}.svg`)">
</template>
<script>
export default {
  props: ['icon']
}
</script>

