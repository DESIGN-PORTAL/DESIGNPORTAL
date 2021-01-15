<template>
  <section class="imgBox">
    <BTabs>
      <div name="图片">
        <header>
          <div class="mb20 headButton">
            <BButton type="outline" @click="handleChangeImage" style="width: 100%;">替换图片</BButton>
          </div>
          <sliderInput :sliderObj="objOpacity" class="mb20" />
          <sliderInput :sliderObj="objRadius" />
        </header>
        <BCollapse v-model="activeNames">
          <locationSize />
        </BCollapse>
      </div>
      <!-- <div name="字段设置" name="2">配置管理</div>
      <div name="动画" name="3">角色管理</div> -->
    </BTabs>
  </section>
</template>

<script>
import sliderInput from './components/sliderInput';
import locationSize from './components/locationSize';

export default {
  inject: ['editor', 'Bus'],
  data() {
    return {
      activeName: '1',
      cropper: {},
      destination: '',
      image: {},
      bgConfig: '',
      activeNames: '',
      objOpacity: {
        role: 'opacity',
        title: '不透明',
        units: '%',
        defaultVal: 50,
      },
      objRadius: {
        role: 'borderRadius',
        title: '圆角',
        units: '%',
        defaultVal: 50,
      },
    };
  },
  computed: {
    currentLayer() {
      return this.editor.currentLayer;
    },
  },
  components: {
    sliderInput,
    locationSize,
  },
  created() {},
  mounted() {
    this.objOpacity.defaultVal = this.currentLayer.opacity * 100;
    this.objRadius.defaultVal = this.currentLayer.borderRadius * 1;
  },
  methods: {
    handleChangeImage() {
      this.Bus.$emit('chooseImage');
    },
  },
};
</script>

<style lang="less" scoped>
ul,
li {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.imgBox {
  header {
    padding: 20px;
    align-items: center;
  }
}
.headButton {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mb20 {
  margin-bottom: 20px;
}
</style>
