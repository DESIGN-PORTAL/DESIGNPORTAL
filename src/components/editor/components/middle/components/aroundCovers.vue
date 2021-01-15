<!-- 设计区四周遮挡 -->
<template>
  <div class="design-covers">
    <div class="design-cover design-cover-top" :style="coverTopStyle"></div>
    <div class="design-cover design-cover-right" :style="coverRightStyle"></div>
    <div class="design-cover design-cover-bottom" :style="coverBottomStyle"></div>
    <div class="design-cover design-cover-left" :style="coverLeftStyle"></div>
  </div>
</template>

<script>
export default {
  inject: ['editor', 'designView'],
  computed: {
    scale() {
      return this.editor.scale;
    },
    /**
     * 顶部覆盖物样式
     */
    coverTopStyle() {
      let { top: height, fullValue } = this.designView;

      if (this.designView.renderFull) {
        height -= fullValue / 2;
      }

      return {
        top: 0,
        left: 0,
        height: `${height}px`,
        width: '100%',
      };
    },
    /**
     * 底部覆盖物样式
     */
    coverBottomStyle() {
      let { bottom: height, fullValue } = this.designView;

      if (this.designView.renderFull) {
        height -= fullValue / 2;
      }
      return {
        left: 0,
        bottom: 0,
        height: `${height}px`,
        width: '100%',
      };
    },
    /**
     * 左侧覆盖物样式
     */
    coverLeftStyle() {
      let { left: width, renderHeight: height, top, fullValue, shortValue } = this.designView;

      if (this.designView.renderShort) {
        width -= shortValue / 2;
      }
      if (this.designView.renderFull) {
        height += fullValue;
        top -= fullValue / 2;
      }

      return {
        top: `${top}px`,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
      };
    },
    /**
     * 右侧覆盖物样式
     */
    coverRightStyle() {
      let { left: width, renderHeight: height, top, fullValue, shortValue } = this.designView;

      if (this.designView.renderShort) {
        width -= shortValue / 2;
      }
      if (this.designView.renderFull) {
        height += fullValue;
        top -= fullValue / 2;
      }

      return {
        top: `${top}px`,
        right: 0,
        height: `${height}px`,
        width: `${width}px`,
      };
    },
  },
};
</script>

<style lang="less">
.design-covers {
  .design-cover {
    background-color: #d2d2d2;
    position: absolute;
    z-index: 999;
    opacity: 0.5;
    pointer-events: none;
  }

  .design-cover-top {
    left: 0;
    top: 0;
  }
  .design-cover-right {
    right: 0;
    top: 0;
  }
  .design-cover-bottom {
    bottom: 0;
    left: 0;
  }
  .design-cover-left {
    left: 0;
    top: 0;
  }
}
</style>
