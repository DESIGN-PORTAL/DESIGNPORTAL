<template>
  <div ref="slider" class="component-slider" @click="handleClick">
    <div class="progress" :style="progressStyle"></div>
    <div @click.stop="1 === 1" class="handle" @mousedown="handleMousedown" :style="style">
      <div class="tip-value" v-show="onDrag">{{ tipFormat ? tipFormat(value) : value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    /**
     * 步进值
     */
    step: {
      type: Number,
      default: 1,
    },
    /**
     * 最小值
     */
    min: {
      type: Number,
      default: 0,
    },
    /**
     * 最大值
     */
    max: {
      type: Number,
      default: 100,
    },
    tipFormat: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      onDrag: false,
      originPosition: null,
      startPoint: null,

      indicatorRadius: 8, // 滑块 半径
      wholeWidth: 170, // 整个长度
      left: 0, // 滑块left值
    };
  },
  watch: {
    value() {
      this.init();
    },
  },
  computed: {
    progressStyle() {
      return {
        width: `${this.left}px`,
      };
    },
    style() {
      return {
        left: `${this.left}px`,
        width: `${this.indicatorRadius * 2}px`,
        height: `${this.indicatorRadius * 2}px`,
        cursor: `${this.onDrag ? 'grabbing' : 'grab'}`,
      };
    },
    /**
     * 滑块最小移动距离
     */
    minLeft() {
      // return this.indicatorRadius;
      return 0;
    },
    /**
     * 滑块最大移动距离
     */
    maxLeft() {
      // return this.wholeWidth - this.indicatorRadius;
      return this.wholeWidth;
    },
    /**
     * 最大值与最小值的差值
     */
    diffVal() {
      return this.max - this.min;
    },
    /**
     * 实际使用的长度
     */
    realityWidth() {
      // return this.wholeWidth - (this.indicatorRadius * 2);
      return this.wholeWidth;
    },
    /**
     * 精度
     */
    precision() {
      return this.step.toString().split('.').length - 1;
    },
  },
  mounted() {
    this.wholeWidth = this.$refs.slider.offsetWidth;

    this.init();

    document.addEventListener('mousemove', this.handleMousemove);
    document.addEventListener('mouseup', this.handleMouseLeave);
    document.addEventListener('mouseleave', this.handleMouseLeave);
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMousemove);
    document.removeEventListener('mouseup', this.handleMouseLeave);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
  },
  methods: {
    init() {
      const percentWidth = this.realityWidth / this.diffVal;

      this.left = this.value * percentWidth + this.minLeft;
    },
    handleMousedown(e) {
      this.originPosition = this.left;
      this.startPoint = {
        x: e.pageX,
      };
      this.onDrag = true;

      // e.preventDefault();
      // e.stopPropagation();
    },
    handleMousemove(e) {
      if (!this.onDrag) return;

      e.preventDefault();
      e.stopPropagation();

      const moveX = e.pageX - this.startPoint.x;

      let newLeft = this.originPosition + moveX;
      if (newLeft < this.minLeft) {
        newLeft = this.minLeft;
      } else if (newLeft > this.maxLeft) {
        newLeft = this.maxLeft;
      }

      this.setVal(newLeft);
    },
    handleMouseLeave(e) {
      if (!this.onDrag) return;
      e.preventDefault();
      e.stopPropagation();
      this.onDrag = false;
    },
    /**
     * 点击修改值
     */
    handleClick(e) {
      this.setVal(e.offsetX);
    },
    /**
     * 设置值
     */
    setVal(val) {
      this.left = val;

      // left值 占整个长度的比例
      // const percent = (newLeft - this.indicatorRadius) / this.realityWidth;
      const percent = val / this.realityWidth;
      this.$emit('input', +(percent * this.diffVal).toFixed(this.precision));
      this.$nextTick(() => this.$emit('change', this.value));
    },
    handlerClick(e) {
      e.preventDefault();
      e.stopPropagation();
    },
  },
};
</script>

<style lang="less">
.component-slider {
  display: inline-block;
  width: 170px;
  height: 4px;
  border-radius: 3px;
  background-color: #d8d8d8;
  position: relative;
  cursor: pointer;

  .progress {
    width: 0;
    height: 100%;
    background-color: @color-main;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }
  .handle {
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(145, 144, 144, 0.13);
    border: 1px solid #cbcbcb;
    border-radius: 50%;
    cursor: grab;
    .tip-value {
      position: absolute;
      width: auto;
      padding: 0 5px;
      height: 17px;
      line-height: 17px;
      font-size: 12px;
      background-color: rgba(@color-main, 0.6);
      color: #fff;
      border-radius: 2px;
      top: -8px;
      left: 50%;
      pointer-events: none;
      transform: translate(-50%, -100%);
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(@color-main, 0.6);
      }
    }
  }
}
</style>
