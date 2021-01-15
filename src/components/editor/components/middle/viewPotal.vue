<template>
  <div class="view-portal">
    <template v-if="page">
      <component :is="preName + 'Background'" v-if="page.bg.url" :bg="page.bg" />
      <template v-for="(layer, index) in page.layers">
        <Layer :key="index" :item="layer" :index="index" :scale="scale" />
      </template>
    </template>
  </div>
</template>

<script>
import { preName, components } from '../../factory';
import Layer from '../layers/wrapper';

export default {
  components: {
    ...components,
    Layer,
  },
  props: {
    page: {
      type: Object,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    scale: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      preName,
    };
  },
};
</script>

<style lang="less" scoped>
.view-portal {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
