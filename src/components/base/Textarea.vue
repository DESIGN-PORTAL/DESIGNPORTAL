<template>
  <div class="component-text-area">
    <textarea
      v-model="valueComp"
      :placeholder="placeholder"
      :name="name"
      class="text-area"
      :style="{
        textAlign: align,
      }"
      @keydown="handleKeydown"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    align: {
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
  methods: {
    handleKeydown(e) {
      if (e.keyCode === 13) {
        this.$emit('enter');
      }
      this.$emit('keyDown');
    },
  },
};
</script>

<style lang="less" scoped>
.component-text-area {
  width: 100%;
  .text-area {
    width: 100%;
    height: 100%;
    border: 1px solid #f4f4f4;
    border-radius: 4px;
    outline: none;
    transition: all 0.3s ease-in-out;
    padding: 10px 8px;
    font-size: 14px;
    --resize: none;
    resize: none;
    line-height: 1;
    &:hover {
      border: 1px solid rgba(@color-main, 0.8);
    }

    &:focus {
      border: 1px solid @color-main;
      box-shadow: 0 0 6px 0 rgba(@color-main, 0.5);
    }

    &::placeholder {
      font-size: 12px;
      color: #cbcbcb;
    }
  }
}
</style>
