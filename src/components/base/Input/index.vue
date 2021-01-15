<template>
  <div class="component-input">
    <input
      v-model="valueComp"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      class="input"
      :style="{
        textAlign: align,
      }"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @blur="$emit('blur')"
    />
    <div class="suffix" v-if="$slots.suffix">
      <slot name="suffix" />
    </div>
    <div class="handler" v-if="$slots.handler">
      <slot name="handler" />
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
    type: {
      type: String,
      default: 'text',
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
        this.$emit('change', val);
        this.$parent.$emit('formInput', val);
      },
      get() {
        return this.value;
      },
    },
  },
  methods: {
    handleKeydown(e) {
      if (e.keyCode === 13) {
        this.$emit('enter', e);
      }
      this.$emit('keydown', e);
    },
    handleKeyup(e) {
      this.$emit('keyup', e);
    },
  },
};
</script>

<style lang="less" scoped>
.component-input {
  height: 36px;
  line-height: 36px;
  width: 100%;
  position: relative;
  .input {
    width: 100%;
    height: 100%;
    border: 1px solid #f4f4f4;
    border-radius: 4px;
    outline: none;
    transition: all 0.3s ease-in-out;
    padding: 0 8px;
    font-size: 14px;
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

  .suffix {
    position: absolute;
    right: 0;
    width: auto;
    height: 100%;
    top: 0;
    padding: 0 10px;
    pointer-events: none;
  }
}
</style>
