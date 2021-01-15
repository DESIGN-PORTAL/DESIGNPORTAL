<template>
  <div class="component-checkbox" :class="value && 'component-checkbox-checked'" @click="handleClick">
    <div class="checkbox"></div>
    <span>{{ label }}<slot></slot></span>

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
    label: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick() {
      this.$emit('input', !this.value);
    },
  },
};
</script>

<style lang="less" scoped>
.component-checkbox {
  display: inline-block;
  cursor: pointer;
  color: #8c8c8c;
  font-size: 14px;
  line-height: 14px;
  .checkbox {
    width: 14px;
    height: 14px;
    position: relative;
    background-color: #ededed;
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
    display: inline-block;
    transform: translateY(2px);
    margin-right: 5px;
    &:before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: #ffffff;
      transform: translate(-50%, -50%);
    }

    &:hover {
      border: 4px solid @color-main;
    }
  }
  &.component-checkbox-checked {
    .checkbox {
      background-color: @color-main;
      &:before {
        display: none;
      }
      &:after {
        content: '';
        display: block;
        width: 8px;
        height: 4px;
        position: absolute;
        left: 50%;
        top: 50%;
        border-left: 1px solid #fff;
        border-bottom: 1px solid #fff;
        transform: translate(-50%, -65%) rotate(-45deg);
      }
    }
  }
}
</style>
