<template>
  <div class="component-input-number">
    <BInput v-model="nValue" @change="handleChange" @blur="$emit('blur')">
      <div class="number-handle" slot="handler">
        <div class="plus" @click="handleClick('plus')"></div>
        <div class="minus" @click="handleClick('minius')"></div>
      </div>
    </BInput>
  </div>
</template>

<script>
import BInput from './index';

export default {
  components: {
    BInput,
  },
  props: {
    value: {
      type: Number,
      default: null,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 9999999999999999999999999,
    },
  },
  data() {
    return {};
  },
  computed: {
    nValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', +val);
      },
    },
  },
  methods: {
    handleClick(type) {
      // this.nValue = this.value + (type === 'plus' ? 1 : -1);
      this.handleChange(this.value + (type === 'plus' ? 1 : -1));
    },
    handleChange(val) {
      this.$emit('change', +val);
    },
  },
};
</script>

<style lang="less">
.component-input-number {
  display: inline-block;
  .number-handle {
    width: 12px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 6px;
    z-index: 2;
    > div {
      height: 50%;
      width: 100%;
      cursor: pointer;
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &:active {
        &::after {
          border-width: 5px;
        }
      }
    }

    .plus {
      &::after {
        border-bottom-color: #cbcbcb;
      }
      &:hover {
        &::after {
          border-bottom-color: @color-main;
        }
      }
    }

    .minus {
      &::after {
        top: 40%;
        border-top-color: #cbcbcb;
      }
      &:hover {
        &::after {
          border-top-color: @color-main;
        }
      }
    }
  }
}
</style>
