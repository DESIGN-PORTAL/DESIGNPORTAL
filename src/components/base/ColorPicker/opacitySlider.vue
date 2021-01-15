<template>
  <div class="component-opacity-slider-wrapper">
    <div class="component-opacity-slider" :style="sliderStyle" @click="handleClick" @mousedown="handleMousedown">
      <em class="indicator" :style="indicatorStyle"></em>
    </div>
  </div>
</template>

<script>
const width = 220;
// const height = 20;

const minValue = 0;
const maxValue = width;

export default {
  props: {
    value: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      default: '#FFFFFF',
    },
  },
  data() {
    return {
      left: 220,
      onDrag: false,
      originPoint: null,
      startPoint: null,
    };
  },
  computed: {
    sliderStyle() {
      return {
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0), ${this.color})`,
      };
    },
    indicatorStyle() {
      return {
        left: `${this.left}px`,
      };
    },
  },
  created() {
    this.left = maxValue * this.value;
  },
  mounted() {
    document.body.addEventListener('mousemove', this.handleMousemove);
    document.body.addEventListener('mouseup', this.handleMouseleave);
  },
  beforeDestroy() {
    document.body.removeEventListener('mousemove', this.handleMousemove);
    document.body.removeEventListener('mouseup', this.handleMouseleave);
  },
  methods: {
    /**
     * 点击事件
     */
    handleClick(e) {
      this.setLeft(e.offsetX);
    },
    /**
     * 鼠标按下
     */
    handleMousedown(e) {
      this.onDrag = true;
      this.setLeft(e.offsetX);
      this.originPoint = this.left;
      this.startPoint = {
        x: e.pageX,
        y: e.pageY,
      };
    },
    /**
     * 鼠标移动
     */
    handleMousemove(e) {
      if (!this.onDrag) return;
      const moveX = e.pageX - this.startPoint.x;
      this.setLeft(this.originPoint + moveX);
    },
    /**
     * 鼠标离开
     */
    handleMouseleave() {
      this.onDrag = false;
    },
    /**
     * 设置坐标
     */
    setLeft(left) {
      if (left <= minValue) {
        this.left = minValue;
        this.$emit('input', 0);
        return;
      }
      if (left >= maxValue) {
        this.left = maxValue;
        this.$emit('input', 1);
        return;
      }

      this.left = left;

      const value = left / maxValue;
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="less">
.component-opacity-slider-wrapper {
  margin-top: 10px;
  width: 220px;
  height: 20px;
  background-image: url('./assets/img/blank.jpg');
  .component-opacity-slider {
    width: 220px;
    height: 20px;
    position: relative;
    overflow: hidden;
    .indicator {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      box-sizing: border-box;
      border-radius: 50%;
      pointer-events: none;
      margin-left: -8px;
    }
  }
}
</style>
