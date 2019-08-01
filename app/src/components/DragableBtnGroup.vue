<template>
  <div class="dragable-btn-group">
    <draggable v-model="valTemp" :options="{animation: 150}" @end="dragEnd">
      <transition-group name="list-complete">
        <el-button class="word-btn draggable-btn" :class="{'word-btn_zh' : lang === 1}" 
          v-for="item in value" 
          :key="item.value">{{item.value}}</el-button>
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components: {draggable},
  props: {
    value: Array,
    lang: Number
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      valTemp: []
    }
  },
  mounted () {
    this.valTemp = this.value
  },
  methods: {
    dragEnd () {
      this.$emit('change', this.valTemp)
    }
  }
}
</script>
<style scoped lang="scss">
.dragable-btn-group {
  width: 100%;
  padding: 0 20px;
  background: white;
  min-height: 100px;
  display: flex;
  align-items: center;
  border-radius: $--border-radius-base
}
.word-btn {
  flex: 0;
  width: auto;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 8px;
  padding: 10px 12px;
  color: black;
  font-size: 14px;
  border: none;
  box-shadow: $--box-shadow-item-base;
  margin-left: 10px;
  cursor: -webkit-grab;
}
.word-btn:hover,.word-btn:active,.word-btn:focus {
  color: black;
}
.word-btn_zh:nth-child(3n+1) {
  margin-left: 15px;
}
.word-btn_zh:nth-child(3n+2) {
  margin-left: 8px;
}
.word-btn_zh:nth-child(3n+0) {
  margin-left: 8px;
}
.list-complete-move {
  transition: transform .5s;
}
.list-complete-enter-active {
  margin-left: 10px;
  transition: all .3s;
}

.list-complete-leave-active {
  margin-left: 0;
  transition: all .3s;
}

.list-complete-enter, .list-complete-leave-to {
  width: 0;
  opacity: 0;
  padding: 0;
  margin-left: 0;
}
</style>

