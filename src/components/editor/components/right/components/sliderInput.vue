<template>
  <div class="slider-box">
    <div class="text">{{ sliderObj.title }}</div>
    <BSlider
      class="slider"
      v-model="currentLayer[sliderObj.role]"
      :step="sliderObj.step || 1"
      :min="sliderObj.min || 0"
      :max="sliderObj.max || 100"
      @change="modifyAttr"
    />
    <BInput class="num" v-model.number="currentLayer[sliderObj.role]" @keyup.enter.native="handleClick">
      <div slot="suffix">{{ sliderObj.units }}</div>
    </BInput>
  </div>
</template>

<script>
export default {
  inject: ['editor'],
  data() {
    return {
      dd: 0,
    };
  },
  props: {
    sliderObj: {
      type: Object,
    },
  },
  computed: {
    currentLayer() {
      return this.editor.currentLayer;
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      this.sliderObj.defaultVal = this.sliderObj.defaultVal.replace(/[^\w]/g, '');
    },
    // 汇集数据
    modifyAttr(val) {
      this.editor.handleModifyLayer(this.sliderObj.role, val);
      // this.currentLayer[this.sliderObj.role] = val
    },
  },
};
</script>

<style lang="less" scoped>
.slider-box {
  display: flex;
  align-items: center;
  font-size: 12px;
  .text {
    width: 38px;
    text-align: left;
  }

  .slider {
    flex: 1;
    margin: 0px 12px;
  }

  .num {
    width: 60px;
  }
}
</style>
