<template>
  <div class="component-button-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
.component-button-group {
  >* {
    position: relative;
    &:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: none;
      &::before {
        content: '';
        display: block;
        height: 100%;
        width: 1px;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #f2f2f2;
        z-index: 1;
        transition: all 0.2s linear;
      }
    }
    &:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      &::after {
        content: '';
        display: block;
        height: 100%;
        width: 1px;
        position: absolute;
        right: -1px;
        top: 0;
        background-color: #f2f2f2;
        z-index: 1;
        transition: all 0.2s linear;
      }
    }
    &:hover {
      &::before, &::after {
        background-color: @color-main;
        z-index: 2;
      }
    }
  }
}
</style>
