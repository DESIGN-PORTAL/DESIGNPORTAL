<template>
  <div class="component-color-map" @click="handleClick" @mousedown="handleMousedown">
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
const height = 174; // canvas高度

const minLeft = 0;
const maxLeft = wrapperWidth;
const minTop = 0;
const maxTop = height;

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
      left: 0,
      top: 0,
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
        top: `${this.top}px`,
      };
    },
  },
  created() {
    colorGeter = new ColorGeter({ width, height, imgUrl: require('./assets/img/colorHsl.png') });
    // this.initLeftWithColor();
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
      this.setPosition(e.offsetX, e.offsetY);
    },
    /**
     * 鼠标按下
     */
    handleMousedown(e) {
      this.onDrag = true;
      this.setPosition(e.offsetX, e.offsetY);
      this.originPoint = {
        x: this.left,
        y: this.top,
      };
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
      const moveY = e.pageY - this.startPoint.y;
      this.setPosition(this.originPoint.x + moveX, this.originPoint.y + moveY);
    },
    /**
     * 鼠标离开
     */
    handleMouseleave() {
      this.onDrag = false;
    },
    reset() {
      colorGeter.setColors(this.gradientColors);
      // const p = colorGeter.getColorPoint(this.value);
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
    setPosition(left, top) {
      if (left <= minLeft) {
        left = minLeft;
      } else if (left >= maxLeft - 1) {
        left = maxLeft - 1;
      }

      if (top <= minTop) {
        top = minTop;
      } else if (top >= maxTop - 1) {
        top = maxTop - 1;
      }

      this.left = left;
      this.top = top;

      const color = colorGeter.getColor(this.left, this.top);
      this.$emit('input', color.hex);
      this.$emit('change', color);
    },
  },
};
</script>
<style lang="less">
.component-color-map {
  margin-top: 10px;
  width: 220px;
  height: 174px;
  background-color: #fff;
  background-image: url('./assets/img/colorHsl.png');
  background-size: 100% 100%;
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
