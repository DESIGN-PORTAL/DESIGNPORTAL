<template>
  <div class="component-color-picker">
    <!-- 简易选择 -->
    <div v-if="type === 'simple'" class="colors-wrapper">
      <ul class="color-col" v-for="(colorRow, rowIndex) in colors" :key="rowIndex">
        <li
          class="color"
          v-for="(color, index) in colorRow"
          :key="index"
          :class="{
            'color-transparent': color === 'transparent',
            'color-customer': color === 'customer',
          }"
          :style="`background-color: ${color.indexOf('#') > -1 ? color : '#FFFFFF'}`"
          @click="handleClick(color)"
        ></li>
      </ul>
    </div>
    <ColorMap v-else v-model="currentColor" @change="handleColorMapChange" />

    <ColorSlider ref="colorSlider" v-model="currentColor" />
    <OpacitySlider ref="opacitySlider" v-model="opacity" :color="currentColor" />

    <div class="current-color-wrapper">
      <span>当前颜色</span>
      <span class="current-color">
        <em :style="`background-color: ${rgbaColor};`"></em>
      </span>

      <div class="input-wrapper">
        <em class="pre">#</em>
        <input
          v-model="currentColorComp"
          type="text"
          maxlength="6"
          onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
          @keydown="handleKeydown"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ColorMap from './colorMap';
import ColorSlider from './colorSlider';
import OpacitySlider from './opacitySlider';

import { rgbReg, rgbaReg, rgb2Hex, hex2RgbArr } from './Color';

const colorsArr = [
  ['#d81b43', '#e91e4e', '#ec4064', '#f0627d', '#f48fa0', 'transparent'],
  ['#8e24aa', '#9c27b0', '#ab47bc', '#ba68c8', '#ce93d8', '#ffffff'],
  ['#512da8', '#5e35b1', '#673ab7', '#7e57c2', '#9575cd', '#b5b6b6'],
  ['#303f9f', '#3949ab', '#5c6bc0', '#7986cb', '#9fa8da', '#898989'],
  ['#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#5a5a5a'],
  ['#00897b', '#009688', '#26a69a', '#80cbc4', '#b2dfdb', '#373737'],
  ['#43a047', '#4caf50', '#81c784', '#a5d6a7', '#c8e6c9', '#232323'],
  ['#fbc02d', '#fdd835', '#ffeb3b', '#fff176', '#fff59d', '#161616'],
  ['#f57c00', '#fb8c00', '#ffa726', '#ffb74d', '#ffcc80', '#000000'],
  ['#e64a19', '#f4511e', '#ff5722', '#ff8a65', '#ffab91', 'customer'],
];

export default {
  components: {
    ColorMap,
    ColorSlider,
    OpacitySlider,
  },
  props: {
    value: {
      type: String,
      default: 'rgba(255, 255, 255, 1)',
    },
  },
  data() {
    return {
      colors: colorsArr,
      currentColor: '',
      opacity: 1, // 透明度
      type: 'simple', // 样式 simple简易 advance 高级
    };
  },
  computed: {
    currentColorComp: {
      get() {
        return this.currentColor.substring(1, 7);
      },
      set(val) {
        this.currentColor = `#${val}`;
      },
    },
    rgbaColor() {
      const arr = hex2RgbArr(this.currentColor);
      const color = `rgba(${arr.join(',')}, ${this.opacity})`;
      this.$emit('input', color);
      this.$emit('change', color);
      return color;
    },
  },
  created() {
    this.analyzeColor(this.value);
  },
  methods: {
    /**
     * 解析颜色
     */
    analyzeColor(value) {
      let color = value,
        opacity = 1;

      // 如果是rgba颜色
      if (rgbaReg.test(color)) {
        const res = color.replace(/(?:\(|\)|rgba|RGBA)*/g, '').split(',');

        opacity = +res[3];
        color = rgb2Hex(+res[0], +res[1], +res[2]);
      } else if (rgbReg.test(color)) {
        // 如果是rgb颜色
        const res = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
        color = rgb2Hex(+res[0], +res[1], +res[2]);
      }
      this.currentColor = color;
      this.opacity = opacity;
    },
    /**
     * 点选颜色
     */
    handleClick(color) {
      if (color === 'transparent') {
        this.currentColor = '#000000';
        this.opacity = 0;
        return;
      }
      if (color === 'customer') {
        this.type = 'advance';
        return;
      }

      this.currentColor = color;
      this.$nextTick(() => {
        this.$refs.colorSlider.reset();
      });
    },
    /**
     * 颜色取反
     */
    colorReverse(color) {
      const OldColorValue = '0x' + color.replace(/#/g, '');
      const str = '000000' + (0xffffff - OldColorValue).toString(16);
      return str.substring(str.length - 6, str.length);
    },
    handleKeydown() {},
    handleColorMapChange() {
      this.$refs.colorSlider.reset();
    },
  },
};
</script>

<style lang="less">
.component-color-picker {
  width: 240px;
  height: auto;
  padding: 10px;
  background-color: rgba(45, 56, 66, 1);
  border-radius: 4px;
  position: absolute;
  right: 0;
  bottom: 100%;
  color: #fff;
  z-index: 999;
  .colors-wrapper {
    display: flex;
    .color-col {
      width: 22px;
      .color {
        width: 22px;
        height: 22px;
        &:hover {
          transform: scale(1.2);
        }
      }

      .color-transparent {
        position: relative;
        overflow: hidden;
        &:after {
          content: '';
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

      .color-customer {
        background-color: #fff;
        background-image: url('./assets/img/colorCustomer.jpg');
        background-size: 100% 100%;
        background-position: center;
      }
    }
  }

  .current-color-wrapper {
    margin-top: 20px;
    width: 100%;
    height: 22px;
    line-height: 22px;
    position: relative;
    text-align: left;
    display: flex;
    align-items: center;
    .current-color {
      display: inline-block;
      width: 22px;
      height: 22px;
      margin-left: 10px;
      background-image: url('./assets/img/blank.jpg');
      em {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .input-wrapper {
      width: 80px;
      height: 100%;
      position: relative;
      margin-left: 10px;
      color: #000;
      .pre {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 22px;
        height: 22px;
        font-style: normal;
        text-align: right;
        padding-right: 3px;
        font-size: 16px;
        pointer-events: none;
      }
      input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        text-align: left;
        padding-left: 20px;
        text-transform: uppercase;
        font-size: 14px;
      }
    }
  }
}
</style>
