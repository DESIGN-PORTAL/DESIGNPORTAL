<template>
  <div ref="container" class="color-picker-container" :style="style" @click="handleClick">
    <ColorPicker v-if="showPicker" v-model="color" @change="handleChange" />
    <div v-if="transparent" class="transparent">
      <em :style="lineStyle"></em>
    </div>
  </div>
</template>

<script>
import ColorPicker from './colorPicker';

export default {
  components: {
    ColorPicker,
  },
  props: {
    value: {
      type: String,
      default: 'rgba(255, 255, 255, 1)',
    },
  },
  data() {
    return {
      color: this.value,
      showPicker: false, // 显示颜色选择器
      width: 50,
      height: 26,
      angle: 30,
    };
  },
  computed: {
    style() {
      return {
        backgroundColor: this.transparent ? 'rgba(0,0,0,0)' : this.value,
      };
    },
    /**
     * 透明色
     */
    transparent() {
      return this.color.replace(/ /g, '') === 'rgba(0,0,0,0)';
    },
    lineStyle() {
      return {
        transform: `translate(-50%, -50%) rotate(-${this.angle}deg)`,
      };
    },
  },
  mounted() {
    document.addEventListener('click', this.handleBodyClick);
    const rect = this.$refs.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.angle = (Math.atan2(this.height, this.width) * 180) / Math.PI;
    console.log('this.width', this.width, this.height, this.angle);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleBodyClick);
  },
  methods: {
    handleBodyClick() {
      this.closePicker();
    },
    /**
     * 点击弹出颜色框
     */
    handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.showPicker = true;
    },
    /**
     * 颜色修改
     */
    handleChange(e) {
      this.$emit('input', e);
      this.$emit('change', e);
    },
    /**
     * 关闭颜色选择器
     */
    closePicker() {
      this.showPicker = false;
    },
  },
};
</script>

<style lang="less">
.color-picker-container {
  display: inline-block;
  width: 50px;
  height: 26px;
  position: relative;
  border: 1px solid #ededed;
  border-radius: 4px;
  cursor: pointer;
  .transparent {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    em {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      height: 1px;
      width: 200%;
      background-color: rgb(255, 0, 0);
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  .component-color-picker {
    top: 100%;
    bottom: unset;
  }
}
</style>
