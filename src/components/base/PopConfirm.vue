<template>
  <div class="component-pop-confirm">
    <div class="slot">
      <slot></slot>
    </div>

    <div class="handle">
      <div class="message">{{ message }}</div>
      <div class="btns">
        <button class="btn btn-cancel">取消</button>
        <button class="btn btn-confirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
};
</script>

<style lang="less">
.component-pop-confirm {
  width: auto;
  height: auto;
  position: relative;
  .slot {
    position: relative;
    z-index: 2;
  }

  .handle {
    position: absolute;
    z-index: 999;
    top: 100%;
    left: 50%;
    padding: 12px 16px;
    transform: translateX(-50%);
    min-width: 240px;
    .btns {
      .btn-cancel {
      }
    }
  }
}
</style>
