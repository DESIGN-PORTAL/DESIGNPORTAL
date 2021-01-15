<template>
  <button
    class="component-button"
    :class="[`component-button-${type}`, `component-button-shape-${shape}`]"
    :type="htmlType"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    /**
     * 类型 primary, outline, round,
     */
    type: {
      type: String,
      default: '',
    },
    /**
     * 形状
     */
    shape: {
      type: String,
      default: '',
    },
    htmlType: {
      type: String,
      default: 'button',
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style lang="less" scoped>
.component-button {
  height: 36px;
  width: auto;
  background-color: #f6f7fb;
  font-size: 14px;
  color: #3e3e3e;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s linear;
  border: 1px solid #f2f2f2;
  padding: 0 24px;
  box-sizing: border-box;
  &:hover {
    color: @color-main;
    border-color: @color-main;
  }

  &.component-button-primary {
    background-color: @color-main;
    border: none;
    color: #ffffff;
    &:hover {
      color: #ffffff;
      background-color: rgba(@color-main, 0.8);
    }
  }

  &.component-button-outline {
    background-color: #ffffff;
  }

  &.component-button-shape-round {
    border-radius: 18px;
  }
}
</style>