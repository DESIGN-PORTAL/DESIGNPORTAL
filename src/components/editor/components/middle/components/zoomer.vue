<!-- 缩放工具 -->
<template>
  <div class="zoomer" :style="style">
    <div class="zoom-btn zoom-in" @click="handleZoom('plus')">+</div>
    <div class="zoom-size">{{ scale * 100 }}%</div>
    <div class="zoom-btn zoom-out" @click="handleZoom('minus')">-</div>
  </div>
</template>
<script>
export default {
  inject: ['editor', 'designView'],
  computed: {
    scale() {
      return this.editor.scale;
    },
    style() {
      return {
        left: `${this.designView.windowWidth - this.editor.rightPanelWidth - 20}px`,
      };
    },
  },
  methods: {
    /**
     * 缩放
     */
    handleZoom(type) {
      const { zoomLevel } = this.editor;

      // 放大
      if (type === 'plus') {
        if (this.scale >= zoomLevel[zoomLevel.length]) return;
        for (let i = 0; i < zoomLevel.length; i++) {
          const level = zoomLevel[i];
          if (level > this.scale) {
            this.editor.scale = level;
            console.log('this.scale', this.scale);
            break;
          }
        }
      } else {
        // 缩小
        if (this.scale <= zoomLevel[0]) return;
        for (let i = zoomLevel.length - 1; i >= 0; i--) {
          const level = zoomLevel[i];
          if (level < this.scale) {
            this.editor.scale = level;
            break;
          }
        }
      }

      this.designView.handleSetEditor();
    },
  },
};
</script>

<style lang="less">
.zoomer {
  position: fixed;
  bottom: 133px;
  right: 340px;
  width: 32px;
  height: auto;
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #dfdfdf;
  overflow: hidden;
  z-index: 999;
  text-align: center;
  font-size: 18px;
  user-select: none;
  color: #8c8c8c;
  transform: translateX(-100%);
  .zoom-btn {
    height: 32px;
    line-height: 32px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: @color-main;
      color: #fff;
    }
  }
  .zoom-size {
    line-height: 14px;
    font-size: 12px;
    transform: scale(0.83333);
  }
}
</style>
