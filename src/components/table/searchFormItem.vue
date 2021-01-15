<template>
  <div class="component-searchform-item">
    <label v-if="label">{{ label }}:</label>
    <div class="form-input">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  computed: {
    valueComp: {
      set(val) {
        this.$emit('input', val);
      },
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style lang="less">
.component-searchform-item {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  label {
    padding-right: 10px;
    color: #3e3e3e;
    font-size: 14px;
  }
}
</style>
