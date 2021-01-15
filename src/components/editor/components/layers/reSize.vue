<template>
  <div class="editor-resize-wrapper">
    <template v-for="(option, key) in options">
      <div
        :key="key"
        v-if="!disabled.includes(key)"
        class="editor-resize"
        :class="`${option.type} size-${option.direction} ${option.cursor}`"
        @mousedown="handleMouseDown($event, key)"
        @mouseup="handleMouseUp"
        @click="handleClick"
      ></div>
    </template>
    <!-- 旋转按钮 -->
    <div
      v-if="!disabled.includes('rotate')"
      class="editor-resize editor-rotate"
      @mousedown="handleMouseDown($event, 'rotate')"
      @mouseup="handleMouseUp"
      @click="handleClick"
    >
      <i class="iconfont iconic_xiangshang"></i>
    </div>
  </div>
</template>

<script>
import { deepCopy } from '../../assets/js/utils';
import rotateResize from '../../assets/js/utils/rotateResize';

// 需要吸附角度值
const adsorbDegrees = [0, 45, 90, 135, 180, 225, 270, 315, 360];
// 吸附差值
const adsorbDegree = 5;

export default {
  inject: ['Bus', 'editor', 'designView'],
  props: {
    /**
     * 禁用拉伸的方向
     */
    disabled: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    scale: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentOption: '',
      originPosition: null, // 原始位置
      onResize: false, // 是否在改变大小
      resizeType: '', // 大小改变方向类型
      textRow: 1, // 文本行数
    };
  },
  computed: {
    designX() {
      return this.editor.leftPanelWidth + this.designView.left;
    },
    designY() {
      return this.editor.headerHeight + this.designView.top - this.editor.canvasScrollTop;
    },
    options() {
      const options = {
        'top-left': {
          type: 'size-angle',
          direction: 'top-left',
          cursor: 'top-left',
        },
        top: {
          type: 'size-horizontal',
          direction: 'top',
          cursor: 'top',
        },
        'top-right': {
          type: 'size-angle',
          direction: 'top-right',
          cursor: 'top-right',
        },
        right: {
          type: 'size-verticle',
          direction: 'right',
          cursor: 'right',
        },
        'bottom-right': {
          type: 'size-angle',
          direction: 'bottom-right',
        },
        bottom: {
          type: 'size-horizontal',
          direction: 'bottom',
          cursor: 'bottom',
        },
        'bottom-left': {
          type: 'size-angle',
          direction: 'bottom-left',
          cursor: 'bottom-left',
        },
        left: {
          type: 'size-verticle',
          direction: 'left',
          cursor: 'left',
        },
      };

      const directionList = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'];

      const { rotate } = this.data;

      const absRotate = Math.abs(rotate);

      let directionR = 0;

      if (absRotate >= 22 && absRotate <= 70) {
        directionR = 1;
      }

      if (absRotate >= 70 && absRotate <= 100) {
        directionR = 2;
      }

      if (absRotate >= 100 && absRotate <= 160) {
        directionR = 3;
      }

      if (absRotate >= 160 && absRotate <= 180) {
        directionR = 4;
      }

      if (rotate > 0) {
        for (let i = 0; i < directionR; i++) {
          const direction = directionList.shift();
          directionList.push(direction);
        }
      } else {
        for (let i = directionR; i > 0; i--) {
          const direction = directionList.pop();
          directionList.unshift(direction);
        }
      }

      const keySort = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'];

      for (let keyIndex in keySort) {
        options[keySort[keyIndex]].cursor = directionList[keyIndex];
      }
      return options;
    },
  },
  created() {
    this.Bus.$on('mousemove', this.handleMouseMove);
    this.Bus.$on('mouseleave', this.handleMouseOver);
  },
  beforeDestroy() {
    this.Bus.$off('mousemove', this.handleMouseMove);
    this.Bus.$off('mouseleave', this.handleMouseOver);
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    /**
     * 拉伸 按下
     */
    handleMouseDown(e, option) {
      if (this.data.lock) return false;
      if (this.data.id === this.editor.editTextId) return;
      e.preventDefault();
      e.stopPropagation();
      this.currentOption = option;
      // this.$emit('mousedown', e, option);

      this.originPosition = deepCopy(this.data);

      this.pointStart = {
        x: e.x - this.designX,
        y: e.y - this.designY,
      };

      // 如果是文本类型 计算文本的行数
      if (this.data.type === 'Text') {
        this.textRow = +(this.data.height / (this.data.fontSize * this.data.lineHeight)).toFixed(0);
      }

      this.resizeType = option;
      this.onResize = true;
    },
    handleMouseUp() {
      this.currentOption = '';
    },
    handleMouseMove(e) {
      if (!this.onResize) return;

      // 拉伸改变大小
      let { left, top, width, height, rotate } = this.originPosition;

      const typeMap = {
        'top-left': 'lt',
        'top-right': 'rt',
        'bottom-left': 'lb',
        'bottom-right': 'rb',
        top: 'ct',
        bottom: 'cb',
        left: 'lm',
        right: 'rm',
      };

      // 拉伸旋转计算
      const rect = rotateResize(
        typeMap[this.resizeType] || 'rotate',
        this.pointStart,
        {
          x: e.x - this.designX,
          y: e.y - this.designY,
        },
        {
          x: left * this.scale,
          y: top * this.scale,
          w: width * this.scale,
          h: height * this.scale,
          r: rotate,
        },
        this.resizeType.indexOf('-') > -1
      );

      let { x, y, w, h, r } = rect;

      // 旋转
      if (this.resizeType === 'rotate') {
        // r 值范围是 [-180 - 180]因此 小于0时 加上360
        if (r < 0) r += 360;

        // 计算是否吸附
        let adsorbdDegree = r;
        for (let degree of adsorbDegrees) {
          if (Math.abs(r- degree) <= adsorbDegree) {
            adsorbdDegree = degree;
            break;
          }
        }

        Object.assign(this.data, {
          rotate: adsorbdDegree,
        });
        return;
      }

      // 如果是文本 四个角拉伸时修改fontsize
      if (this.data.type === 'Text') {
        const newHeight = h / this.scale;
        const fontSize = newHeight / this.data.lineHeight / this.textRow;
        this.data.fontSize = +fontSize.toFixed(0);
      }

      // 拉伸
      Object.assign(this.data, {
        left: x / this.scale,
        top: y / this.scale,
        width: w / this.scale,
        height: h / this.scale,
      });
    },
    handleMouseOver() {
      this.onResize = false;

      if (!this.originPosition) return;

      const compareAttr = ['left', 'top', 'width', 'height', 'rotate'];

      for (let name of compareAttr) {
        if (this.originPosition[name] !== this.data[name]) {
          this.editor.saveHistory(this.originPosition);
          break;
        }
      }

      this.originPosition = null;
    },
  },
};
</script>

<style lang="less">
.editor-resize-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: 1px solid @color-main;
  pointer-events: none;
  &::after {
    // content: '';
    width: 100%;
    height: 1px;
    background-color: #000;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    // transform: sacleY(0.5);
  }
  .editor-resize {
    position: absolute;
    background-color: #fff;
    border: 1px solid #ededed;
    pointer-events: all;
    box-sizing: border-box;
    &:hover {
      // background-color: blue;
    }
  }
  .size-top-left {
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .size-top {
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
  }
  .size-top-right {
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
  }
  .size-bottom-left {
    left: 0;
    bottom: 0;
    transform: translate(-50%, 50%);
  }
  .size-bottom {
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
  }
  .size-bottom-right {
    right: 0;
    bottom: 0;
    transform: translate(50%, 50%);
  }
  .size-left {
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .size-right {
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }

  .size-angle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-shadow: 0px 2px 9px 0px rgba(145, 144, 144, 0.13);
    border: 1px solid #cbcbcb;
  }

  .size-verticle {
    width: 6px;
    height: 14px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #cbcbcb;
  }

  .size-horizontal {
    width: 14px;
    height: 6px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #cbcbcb;
  }

  .editor-rotate {
    bottom: -44px;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 50%;
  }

  .top-left {
    cursor: nwse-resize;
  }
  .top {
    cursor: ns-resize;
  }
  .top-right {
    cursor: nesw-resize;
  }
  .right {
    cursor: ew-resize;
  }
  .bottom-right {
    cursor: nwse-resize;
  }
  .bottom {
    cursor: ns-resize;
  }
  .bottom-left {
    cursor: nesw-resize;
  }
  .left {
    cursor: ew-resize;
  }
}
</style>
