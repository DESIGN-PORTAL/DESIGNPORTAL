<template>
  <div class="background-wrapper">
    <img v-if="bg.url" class="background" :src="bg.url" :style="bgStyle" alt="">
  </div>
</template>

<script>
export default {
  inject: ['designView'],
  props: {
    bg: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    /**
     * 背景样式
     */
    bgStyle() {
      const { renderHeight, renderWidth } = this.designView;
      const { x, y, width, height, naturalWidth, naturalHeight, opacity } = this.bg;

      const style = {
        // backgroundImage: `url(${url}`,
        opacity: opacity / 100,
      };

      if (height) {
        const backgroundSizeWidth = renderWidth / (width / naturalWidth);
        const backgroundSizeHeight = renderHeight / (height / naturalHeight);
        Object.assign(style, {
          width: `${backgroundSizeWidth}px`,
          height: ` ${backgroundSizeHeight}px`,
          left: (backgroundSizeWidth / naturalWidth) * x * -1 + 'px',
          top: (backgroundSizeHeight / naturalHeight) * y * -1 + 'px',
        });
      }

      return style;
    },
  },
};
</script>

<style lang="less">
.background-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  .background {
    height: 100%;
    width: 100%;
    position: absolute;
  }
}
</style>
