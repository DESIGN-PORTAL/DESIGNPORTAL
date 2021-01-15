<template>
  <div class="component-collapse-item" :class="actived && 'component-collapse-item-actived'">
    <header class="header" @click="actived = !actived">
      {{ title }}
      <i class="arrow" :class="actived ? 'arrow-down' : 'arrow-right'"></i>
    </header>
    <section class="content" :style="contentStyle">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    name: {
      type: [Number, String],
      default: '',
    },
    activated: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actived: this.activated,
      offsetHeight: 0, // 内部元素高度  用于展开/收起时的动画
    };
  },
  computed: {
    contentStyle() {
      return {
        height: this.actived ? `${this.offsetHeight}px` : 0,
      };
    },
  },
  mounted() {
    this.offsetHeight = this.$slots.default[0].elm.offsetHeight;
  },
};
</script>

<style lang="less">
.component-collapse-item {
  position: relative;
  .title {
    height: 40px;
  }

  .header {
    height: 40px;
    line-height: 40px;
    background-color: #f6f7fb;
    padding: 0 20px;
    font-weight: bold;
    font-size: 14px;
    position: relative;
    cursor: pointer;

    .arrow {
      position: absolute;
      right: 20px;
      top: 50%;
      transform-origin: center center;
      transform: translateY(-60%);
      pointer-events: none;
      transition: all 0.3s ease-in-out;
      transform-origin: 5px 5px;
      &::after {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border: 2px solid transparent;
        border-right-color: #999;
        border-bottom-color: #999;
        transform: scale(0.8);
      }
    }

    .arrow-down {
      transform: translateY(-60%) rotate(45deg);
    }

    .arrow-right {
      transform: translateY(-50%) rotate(-45deg);
    }
  }

  .content {
    height: auto;
    overflow: hidden;
    transition: height 0.2s ease-in-out;
  }

  &.component-collapse-item-actived {
    .content {
      height: auto;
    }
  }
}
</style>
