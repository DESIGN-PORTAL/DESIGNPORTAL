<template>
  <div class="component-confirm" :class="isShow && 'component-confirm-actived'">
    <div class="mask"></div>

    <div class="confirm-wrapper">
      <div class="btn-close" @click="handleClickCancel"></div>

      <header>{{ title }}</header>

      <main>
        {{ content }}
      </main>

      <footer>
        <button class="btn btn-cancel" @click="handleClickCancel">{{ cancelButtonText }}</button>
        <button class="btn btn-confirm" @click="handleClickConfirm">{{ confirmButtonText }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      title: '确认',
      content: '',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      onOk: null, // function
      onCancel: null, // funciton
    };
  },
  methods: {
    handleClickConfirm() {
      this.onOk && this.onOk();
      this.destory();
    },
    handleClickCancel() {
      this.onCancel && this.onCancel();
      this.destory();
    },
    destory() {
      this.isShow = false;
      setTimeout(() => {
        document.body.removeChild(this.$el);
      }, 200);
    },
  },
};
</script>

<style lang="less" scoped>
.component-confirm {
  width: 0;
  height: 0;
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1199;
    opacity: 0;
    transition: opacity 0.2s linear;
  }
  .confirm-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: auto;
    background-color: #ffffff;
    z-index: 1200;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: opacity 0.2s linear;
    border-radius: 4px;
    color: #333;

    header {
      padding: 10px 16px;
      font-size: 16px;
    }

    main {
      font-size: 14px;
      padding: 20px;
      color: #666;
    }

    footer {
      padding: 10px 16px;
      text-align: right;
      .btn {
        padding: 0 16px;
        height: 36px;
        border-radius: 2px;
        font-size: 13px;
        cursor: pointer;
      }

      .btn-cancel {
        background-color: #ffffff;
        border: 1px solid #ededed;
        transition: all 0.2s ease-in-out;
        color: #666;
        &:hover {
          border-color: @color-main;
          color: @color-main;
        }
      }

      .btn-confirm {
        background-color: @color-main;
        color: #ffffff;
        border: none;
        margin-left: 10px;
        transition: all 0.2s ease-in-out;
        &:hover {
          background-color: rgba(@color-main, 0.7);
        }
      }
    }

    .btn-close {
      position: absolute;
      right: 17px;
      top: 12px;
      width: 20px;
      height: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      cursor: pointer;
      transform: rotate(45deg);
      transition: background-color 0.2s ease-in-out;
      &::after, &::before {
        content: '';
        display: block;
        width: 1px;
        height: 1px;
        background-color: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &::before {
        width: 60%;
      }

      &::after {
        height: 60%;
      }

      &:hover {
        background-color: @color-main;
      }
    }
  }
}

.component-confirm-actived {
  > div {
    opacity: 1 !important;
  }
}
</style>
