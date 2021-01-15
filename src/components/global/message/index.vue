<template>
  <div
    class="component-message"
    :class="{
      'component-message-actived': isShow,
      'component-message-removing': isRemove,
      'component-message-error': type === 'error',
    }"
  >
    <!-- 状态 -->
    <div class="status"></div>

    <header v-if="title">
      {{ title }}
    </header>
    <main>
      {{ message }}
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      isRemove: false,
      time: 3000,
      type: 'success',
      title: '',
      message: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.destroy();
    }, this.time || 3000);
  },
  methods: {
    show() {
      this.isShow = true;
    },
    destroy() {
      this.isRemove = true;
      setTimeout(() => {
        document.querySelector('.component-message-panel').removeChild(this.$el);
      }, 300);
    },
  },
};
</script>

<style lang="less">
.component-message-panel {
  width: auto;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  pointer-events: none;
  z-index: 9999;
}
.component-message {
  position: relative;
  right: 20px;
  top: 20px;
  height: auto;
  max-width: 800px;
  min-width: 300px;
  width: auto;
  border: 1px solid #ededed;
  z-index: 9999;
  background-color: #ffffff;
  pointer-events: all;
  cursor: pointer;
  padding: 16px 40px 16px 24px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  transition: all 0.2s linear;
  transform: translate(100%, 0);
  opacity: 1;
  border-radius: 4px;
  overflow: hidden;

  .status {
    width: 10px;
    height: 100%;
    background-color: #0caf91;
    position: absolute;
    left: 0;
    top: 0;
  }

  header {
    font-size: 16px;
    line-height: 16px;
    color: #333;
    margin-bottom: 10px;
  }
  main {
    font-size: 14px;
    color: #666;
    min-height: 30px;
  }

  &:not(:first-child) {
    margin-top: 20px;
  }
}

.component-message-actived {
  transform: translate(0, 0);
}

.component-message-removing {
  opacity: 0;
}

.component-message-error {
  .status {
    background-color: #ef5656;
  }
}
</style>
