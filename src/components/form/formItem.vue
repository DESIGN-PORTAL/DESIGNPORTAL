<template>
  <BRow class="component-form-item">
    <BCol v-bind="labelCol">
      <label v-if="label"><span v-if="this.require">*</span>{{ label }}：</label>
    </BCol>
    <BCol v-bind="wrapperCol">
      <slot></slot>
      <div class="err-hint">{{ errMsg }}</div>
    </BCol>
    <BCol v-if="unit" class="unit" span="2">
      {{ unit }}
    </BCol>
  </BRow>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    /**
     * 验证规则
     */
    rulers: {
      type: Array,
      default: () => [],
    },
    /**
     * 是否必填
     */
    require: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    labelCol: {
      type: Object,
      default: () => ({ span: 6 }),
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 }),
    },
    unit: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      errMsg: '',
    };
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
  mounted() {
    this.$slots.default[0].componentInstance.$on('input', this.handleInput);
  },
  methods: {
    validate() {
      const slotIns = this.$slots.default[0].componentInstance;
      if (this.require && !slotIns.value) {
        this.errMsg = `${this.label}为必填项`;
        return false;
      }
      return true;
    },
    /**
     * slot中 组件input事件
     */
    handleInput(val) {
      if (this.errMsg !== '') {
        if (this.require) {
          this.errMsg = val ? '' : `${this.label}为必填项`;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-form-item {
  width: auto;
  min-height: 45px;
  // display: flex;
  // align-items: center;
  margin-bottom: 20px;
  .col {
    &:first-child {
      text-align: right;
      padding-right: 10px;
      padding-top: 8px;
    }
  }

  .err-hint {
    position: absolute;
    color: #f5222d;
    font-size: 14px;
  }

  label {
    color: #3e3e3e;
    font-size: 14px;
    text-align: right;
    span {
      color: #f5222d;
      margin-right: 3px;
    }
  }

  .unit {
    padding-left: 10px;
  }
}
</style>
