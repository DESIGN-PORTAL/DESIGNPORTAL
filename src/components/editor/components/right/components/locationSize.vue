<template>
  <BCollapseItem title="位置尺寸" activated>
    <div class="position-size">
      <div class="set-item">
        <div class="name">
          位置
        </div>
        <div>
          <BInputNumber class="input" :value="currentLayer.left * 2" :min="-1000" :max="1000" @change="(val) => modifyAttr('left', val / 2)" />
          <span>X</span>
        </div>
        <div class="flex-1"></div>
        <div>
          <BInputNumber class="input" :value="currentLayer.top * 2" :min="-1000" :max="1000" @change="(val) => modifyAttr('top', val / 2)" />
          <span>Y</span>
        </div>
      </div>

      <div class="set-item">
        <div class="name">
          尺寸
        </div>
        <div>
          <BInputNumber class="input" :value="currentLayer.width * 2" :min="1" :max="1000" @change="(val) => modifyAttr('width', val / 2)" />
          <span>宽</span>
        </div>
        <div class="flex-1"></div>
        <div>
          <BInputNumber class="input" :value="currentLayer.height * 2" :min="1" :max="1000" @change="(val) => modifyAttr('height', val / 2)" />
          <span>高</span>
        </div>
      </div>

      <div class="set-item">
        <div class="name">
          旋转
        </div>
        <BInputNumber class="input" :value="currentLayer.rotate" :min="1" :max="1000" @change="(val) => modifyAttr('rotate', val)" />
        <div class="flex-1"></div>
      </div>
    </div>
  </BCollapseItem>
</template>

<script>
import { throttle } from '../../../assets/js/utils';

export default {
  inject: ['editor'],
  data() {
    return {};
  },
  props: {
    Obj: {
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
    // 汇集数据
    modifyAttr(name, val) {
      throttle(this.editor.handleModifyLayer, 500)(name, val);
    },
  },
};
</script>

<style lang="less" scoped>
.position-size {
  padding: 20px;
  .set-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 12px;
    .name {
      margin-right: 7px;
    }
    .input {
      width: 80px;
      margin-right: 6px;
    }

    .flex-1 {
      flex: 1;
    }
  }
}
</style>
