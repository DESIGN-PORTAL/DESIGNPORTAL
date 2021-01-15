<template>
  <div class="component-switch" :class="value && 'component-switch-actived'" @click="handleClick">
    <!-- 隐藏域 -->
    <input type="hidden" :name="name" :value="value" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit('input', !this.value);
      this.$nextTick(() => {
        this.$emit('change', this.value);
      });
    },
  },
};
</script>

<style lang="less">
.component-switch {
  display: inline-block;
  width: 44px;
  height: 20px;
  border-radius: 10px;
  background-color: #d8d8d8;
  position: relative;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  &:after {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    left: 2px;
    top: 2px;
    transition: left 0.2s ease-in-out;
    background-color: #fff;
  }
  &.component-switch-actived {
    background-color: @color-main;
    &:after {
      left: 26px;
    }
  }
}
</style>
