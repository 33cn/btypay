<template>
  <div class="obow" @click="focus">
    <span class="word-box" 
      :class="{
        'right-focus': focusing && focusingIndex === index,
        'select-word': focusing && focusingIndex === index && item
      }" 
      v-for="(item, index) in chartArray" 
      :key="index"
      @click="clickFocus(index)">{{item}}</span>
    <input class="hidden-input" 
      v-model="inputTemp" 
      @input="setInputIntoArray" 
      @keydown="onKeyDown($event)"
      @blur="focusing = false" ref="hInput">
  </div>
</template>
<script>

export default {
  name: 'InputOneByOne',
  props: {
    boxNum: Number,
    value: String
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      inputTemp: '',
      chartArray: [],
      focusing: false,
      focusingIndex: 0
    }
  },
  watch: {
    'chartArray': function() {
      const charts = this.chartArray.join(' ')
      const reg = /[\u4e00-\u9fa5]/g
      const zhCharts = charts.match(reg)
      if (zhCharts) {
        this.$emit('change', zhCharts.join(' '))
      } else {
        this.$emit('change', '')
      }
    }
  },
  mounted () {
    this.chartArray = new Array(this.boxNum)
  },
  methods: {
    setInputIntoArray() {
      // console.log(this.inputTemp)
      if (!this.inputTemp) return
      const reg = /[\u4e00-\u9fa5]/g
      const zhCharts = this.inputTemp.match(reg)
      if (zhCharts) {
        const replaceCounts = zhCharts.length < this.boxNum - this.focusingIndex ? zhCharts.length : this.boxNum - this.focusingIndex
        this.chartArray.splice(this.focusingIndex, replaceCounts, ...zhCharts.slice(0, replaceCounts))
        this.focusingIndex += replaceCounts
      }
      this.inputTemp = ''
    },
    focus () {
      let input = this.$refs.hInput
      input.focus()
      this.focusing = true
    },
    clickFocus(index) {
      this.focusingIndex = index
      let input = this.$refs.hInput
      input.focus()
      this.focusing = true
    },
    onKeyDown(event) {
      let keycode = event.keyCode || event.which
      switch (keycode) {
        // end
        case 35:
          this.focusingIndex = this.boxNum - 1
          break
        case 36:
          this.focusingIndex = 0
          break
        // left
        case 37:
          this.focusingIndex--
          break
        // right
        case 39:
          this.focusingIndex++
          break
        // backspace
        case 8:
          this.backspaceHandle()
          break
      }
      if (this.focusingIndex < 0) {
        this.focusingIndex = 0
      }
      if (this.focusingIndex >= this.boxNum) {
        this.focusingIndex = this.boxNum - 1
      }
    },
    backspaceHandle() {
      let i = this.focusingIndex
      if (i < 0) {
        this.focusingIndex = 0
        return
      }
      if (this.chartArray[i]) {
        this.chartArray.replaceElem(i, undefined)
      } else {
        this.focusingIndex--
        this.chartArray.replaceElem(--i, undefined)
      }
    }
  }
}
</script>
<style lang="scss">
.obow {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  user-select: none;
  .word-box {
    display: inline-block;
    font-size: 14px;
    text-align: left;
    background: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: solid 1px #CDDBEE;
    outline: none;
    margin-left: 10px;
    width: 20px;
    height: 20px;
    cursor: text;
  }
  .word-box:nth-child(3n+1) {
    margin-left: 23px;
  }
  .select-word {
    color: white;
    background: rgb(49, 142, 254)
  }
  .right-focus {
    box-shadow: $--box-shadow-item-base;
  }
  .right-focus::after {
    content: '';
    border-left: 1px solid black;
    margin-left: 2px;
    animation: 1s blink step-end infinite;
  }
  .hidden-input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .debug-input {
    width: 400px;
  }
}
@keyframes blink {
  from, to {
    border-left: none;
  }
  50% {
    border-left: 1px solid black;
  }
}
</style>

