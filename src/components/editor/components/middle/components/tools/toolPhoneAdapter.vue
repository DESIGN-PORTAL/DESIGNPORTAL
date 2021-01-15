<template>
  <div class="component-toolPhoneAdapter" @click="handleClick">
    <div class="item">
      <label>全面屏</label>
      <BSwitch v-model="designView.phoneAdapter.full" @change="handleFullSwitchChange" />
    </div>
    <div class="item">
      <label>短屏</label>
      <BSwitch v-model="designView.phoneAdapter.short" @change="handleShortSwitchChange" />
    </div>
    <div class="item">
      <label>参考线颜色</label>
      <BColorPicker ref="picker" v-model="designView.phoneAdapter.lineColor" @change="handleColorChange" />
    </div>
  </div>
</template>

<script>
export default {
  inject: ['designView'],
  data() {
    return {
      ruler: false,
    };
  },
  methods: {
    /**
     * 点击关闭颜色选择
     */
    handleClick() {
      this.$refs.picker.closePicker();
    },
    /**
     * 全面屏适配切换
     */
    handleFullSwitchChange(val) {
      localStorage.setItem('phoneAdapterFull', +val);
    },
    /**
     * 短屏适配切换
     */
    handleShortSwitchChange(val) {
      localStorage.setItem('phoneAdapterShort', +val);
    },
    /**
     * 修改手机适配 线颜色
     */
    handleColorChange(val) {
      localStorage.setItem('phoneAdapterColor', val);
    },
  },
};
</script>

<style lang="less">
.component-toolPhoneAdapter {
  width: 180px;
  height: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 9px 0px rgba(145, 144, 144, 0.13);
  background-color: #fff;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1003;
  cursor: default;
  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #3e3e3e;
    line-height: 1;
    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  .ebtn-outline {
    margin-top: 20px;
    font-size: 12px;
  }
}
</style>
