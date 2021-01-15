<template>
  <div class="component-base-modal" :class="{ 'component-base-modal-activated': value }">
    <div class="mask" @click="handleClickMask"></div>
    <div class="content-wrapper" :style="style">
      <div class="header" v-if="title">
        {{ title }}
        <dir v-if="showClose" class="btn-close" title="关闭" @click="handleClose">
          <i class="iconfont iconguanbi"></i>
        </dir>
      </div>
      <dir v-if="!title && showClose" class="btn-close-alone" title="关闭" @click="handleClose">
        <i class="iconfont iconguanbi"></i>
      </dir>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    closeOnMask: {
      type: Boolean,
      default: true,
    },
    /**
     * 显示关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      left: '',
      top: '',
      startLeft: '',
      startTop: '',
      transition: '',
    };
  },
  computed: {
    style() {
      return `left: ${this.left}; top: ${this.top}; transition: ${this.transition}`;
    },
  },
  mounted() {
    document.body.addEventListener('mousedown', this.handleClickBody);
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    document.body.removeEventListener('mousedown', this.handleClickBody);
    if (this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit('input', false);
      this.$emit('close');
      this.left = this.startLeft;
      this.top = this.startTop;
    },
    /**
     * 点击事件
     */
    handleClickBody(e) {
      if (this.value) return;

      // 用于从点击处展开模态框
      const { clientX, clientY } = e;
      this.left = `${clientX}px`;
      this.top = `${clientY}px`;
      this.startLeft = this.left;
      this.startTop = this.top;
      this.transition = 'none';

      setTimeout(() => {
        this.left = '';
        this.top = '';
        this.transition = '';
      }, 0);
    },
    /**
     * 点击遮罩
     */
    handleClickMask() {
      if (this.closeOnMask) this.handleClose();
    },
  },
};
</script>

<style lang="less">
.component-base-modal {
  width: 0;
  height: 0;
  pointer-events: none;
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1001;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .content-wrapper {
    position: fixed;
    width: auto;
    height: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: 1002;
    background-color: #ffffff;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    box-shadow: 0px 9px 15px 0px rgba(0, 0, 0, 0.15);

    .header {
      height: 54px;
      line-height: 54px;
      background: #f6f7fb;
      text-align: center;
      color: #3e3e3e;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      .btn-close {
        position: absolute;
        right: 0;
        top: 0;
        width: 52px;
        height: 100%;
        cursor: pointer;
        i {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          color: #8c8c8c;
          transition: color 0.2s linear;
        }

        &:hover {
          i {
            color: #3e3e3e;
          }
        }
      }
    }
    .btn-close-alone {
      position: absolute;
      right: 17px;
      top: 17px;
      width: 18px;
      height: 18px;
      line-height: 17px;
      text-align: center;
      cursor: pointer;
      padding: 0;
      border-radius: 50%;
      background-color: #8c8c8c;
      transition: all 0.2s linear;
      margin: 0;
      i {
        font-size: 12px;
        color: #ffffff;
      }

      &:hover {
        background-color: @color-main;
      }
    }
  }
}

.component-base-modal-activated {
  pointer-events: all;
  .mask {
    opacity: 1;
  }

  .content-wrapper {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
