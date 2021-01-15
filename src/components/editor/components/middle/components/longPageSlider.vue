<!-- 长页面滑动修改长度 -->
<template>
  <div class="long-page-slider" :style="style">
    <div class="slider" :style="sliderStyle" @mousedown="handleSliderMousedown">可拖动调整页面长度</div>
  </div>
</template>

<script>
const originHeight = 30;

export default {
  inject: ['editor', 'Bus', 'designView'],
  data() {
    return {
      onDrag: false,
      pointStart: {
        x: 0,
        y: 0,
      },
      height: originHeight,
      moveY: 0,
    };
  },
  computed: {
    currentPage() {
      return this.editor.currentPage;
    },
    /**
     * 下拉
     */
    isDown() {
      return this.moveY > 0;
    },
    /**
     * 长页面滑块样式
     */
    style() {
      const style = {
        height: `${this.height}px`,
      };

      if (this.isDown) {
        Object.assign(style, {
          top: '100%',
          backgroundColor: '#FFFFFF',
        });
      } else {
        Object.assign(style, {
          bottom: `${-originHeight}px`,
          backgroundColor: '#e9e9e9',
        });
      }

      return style;
    },
    sliderStyle() {
      return {
        top: this.isDown ? null : 0,
        bottom: this.isDown ? 0 : null,
      };
    },
  },
  created() {
    this.Bus.$on('mousemove', this.handleMouseMove);
    this.Bus.$on('mouseleave', this.handleLineMouseup);
  },
  beforeDestroy() {
    this.Bus.$off('mousemove', this.handleMouseMove);
    this.Bus.$off('mouseleave', this.handleLineMouseup);
  },
  methods: {
    /**
     * 滑块
     */
    handleSliderMousedown(e) {
      this.pointStart = {
        x: e.x,
        y: e.y,
      };
      this.onDrag = true;
    },
    /**
     * 鼠标移动事件
     */
    handleMouseMove(e) {
      if (!this.onDrag) return;

      const { y } = this.pointStart;
      this.moveY = (e.y - y) / this.designView.scale;
      const newHeight = this.currentPage.height + this.moveY;
      if (newHeight < 603) return;
      this.height = Math.abs(this.moveY) + originHeight;
    },
    handleLineMouseup() {
      if (!this.onDrag) return;

      const minHeight = 603;

      this.onDrag = false;
      let newHeight = this.currentPage.height + this.moveY;
      if (newHeight < minHeight) {
        newHeight = minHeight;
      }
      this.currentPage.height = newHeight;
      this.moveY = 0;
      this.height = originHeight;
      this.$nextTick(() => {
        this.Bus.$emit('scrollToBottom');
      });
    },
  },
};
</script>

<style lang="less">
// 长页面滑块
.long-page-slider {
  height: 0;
  width: 375px;
  text-align: center;
  cursor: ns-resize;
  user-select: none;
  background-color: #ffffff;
  z-index: 1000;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  .slider {
    position: absolute;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #cbcbcb;
    color: #3e3e3e;
    font-size: 12px;
  }

  &:after {
    content: '';
    display: block;
  }
}
</style>
