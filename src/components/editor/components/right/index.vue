<template>
  <div class="config-container">
    <div class="config-list-wrapper common-scroll">
      <BackgroundConf v-if="currentLayer === null" />
      <template v-else>
        <component :is="`${currentLayer.type}Conf`"></component>
      </template>
    </div>
  </div>
</template>

<script>
import { componentsConf } from '../../factory';

export default {
  inject: ['editor'],
  components: {
    ...componentsConf,
  },
  data() {
    return {
      coverageIsShow: true,
    };
  },
  computed: {
    currentLayer() {
      return this.editor.currentLayer;
    },
  },
};
</script>
<style lang="less">
.panel-right {
  .config-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .config-list-wrapper {
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>
