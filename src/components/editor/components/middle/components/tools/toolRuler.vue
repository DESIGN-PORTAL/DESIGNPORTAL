<template>
  <div class="component-toolRuler" @click="handleClick">
    <div class="item">
      <label>标尺</label>
      <BSwitch v-model="designView.assistTool.ruler" />
    </div>
    <div class="item">
      <label>智能吸附</label>
      <BSwitch v-model="designView.assistTool.adsorb" />
    </div>
    <div class="item">
      <label>参考线颜色</label>
      <BColorPicker ref="picker" v-model="designView.assistTool.lineColor" @change="handleColorChange" />
    </div>

    <BButton type="primary" @click="handleRemoveLines" style="margin-top: 10px; width: 100%;">
      清除参考线
    </BButton>
  </div>
</template>

<script>
export default {
  inject: ['designView'],
  methods: {
    handleClick() {
      this.$refs.picker.closePicker();
    },
    /**
     * 清除参考线
     */
    handleRemoveLines() {
      this.designView.rulers.vertical.lines = [];
      this.designView.rulers.horizontal.lines = [];
    },
    /**
     * 修改参考线颜色
     */
    handleColorChange(val) {
      localStorage.setItem('rulerLineColor', val);
    },
  },
};
</script>

<style lang="less">
.component-toolRuler {
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
