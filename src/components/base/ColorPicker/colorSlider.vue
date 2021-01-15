<template>
  <div ref="do" class="component-color-slider" :style="sliderStyle" @click="handleClick" @mousedown="handleMousedown">
    <em class="indicator" :style="indicatorStyle"></em>
  </div>
</template>

<script>
import { hex2RgbArr, rgb2Hsl } from './Color';
import ColorGeter from './ColorGeter';

const wrapperWidth = 220; // slider宽度
// const indicatorWidth = 16; // 圆点宽度
// const radius = indicatorWidth / 2; // 小圆点半径

const width = wrapperWidth; // canvas宽度
const height = 20; // canvas高度

const minLeft = 0;
const maxLeft = wrapperWidth;

// let imageData = [];
let colorGeter = null;

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      left: 110,
      onDrag: false,
      originPoint: null,
      startPoint: null,
    };
  },
  computed: {
    gradientColors() {
      return ['#ffffff', this.value, '#000000'];
    },
    sliderStyle() {
      return {
        backgroundColor: this.value,
        backgroundImage: `linear-gradient(to right, #ffffff, ${this.value}, #000000)`,
      };
    },
    indicatorStyle() {
      return {
        left: `${this.left}px`,
      };
    },
  },
  created() {
    colorGeter = new ColorGeter({ width, height, colors: this.gradientColors });
    this.initLeftWithColor();
  },
  mounted() {
    // this.$parent.$el.appendChild(colorGeter._canvas);
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
    reset() {
      colorGeter.setColors(this.gradientColors);
      this.initLeftWithColor();
    },
    /**
     * 根据颜色值对应的hsl值 的亮度 --> [l] 调整 滑块的位置
     */
    initLeftWithColor() {
      const rgb = hex2RgbArr(this.value);
      const hsl = rgb2Hsl(rgb[0], rgb[1], rgb[2]);

      this.left = maxLeft * (1 - hsl[2]);
    },
    /**
     * 设置坐标
     */
    setLeft(left) {
      if (left <= minLeft) {
        this.left = minLeft;
        this.$emit('input', '#FFFFFF');
        return;
      }
      if (left >= maxLeft) {
        this.left = maxLeft;
        this.$emit('input', '#000000');
        return;
      }

      this.left = left;

      const color = colorGeter.getColor(this.left, 1);
      this.$emit('input', color.hex);
    },
  },
};
</script>

<style lang="less">
.component-color-slider {
  margin-top: 10px;
  width: 220px;
  height: 20px;
  background-color: #fff;
  background-image: linear-gradient(to right, transparent, #000);
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
</style>
