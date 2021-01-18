<template>
  <div class="header">
    <div class="logo-wrapper" @click="$router.push('/')">
      <span>Design Portal</span>
    </div>

    <!-- 工具列表 -->
    <div class="tools-wrapper" :style="{ marginRight: `${editor.rightPanelWidth - editor.leftPanelWidth}px` }">
      <div class="tool" @click="handleClickTool('Text')">
        <i class="iconfont iconic_wenben"></i>
        <div class="name">文本</div>
      </div>
      <div class="tool" @click="handleChooseImage">
        <i class="iconfont iconic_sucai"></i>
        <div class="name">素材</div>
      </div>

      <div class="tool" @click="musicDialogState = true">
        <i class="iconfont iconic_yinle"></i>
        <div class="name">音乐</div>
      </div>
    </div>

    <div class="options-wrapper">
      <BButton type="outline" @click="editor.showTemplate">单页模板</BButton>
      <BButtonGroup style="margin-left: 20px;">
        <BButton @click="handleSave('preview')">预览和设置</BButton>
        <BButton type="primary" @click="handleSave('saveData')">
          <i v-if="onSave" class="iconfont iconic_xiangshang"></i>
          保存
        </BButton>
      </BButtonGroup>

      <BButton type="primary" style="margin-left: 20px;" @click="$router.push('/')">首页</BButton>
    </div>

    <musicDialog v-if="musicDialogState" @close="musicDialogState = false" />

    <resourceDialog v-if="resourceState" @close="resourceState = false" />
  </div>
</template>

<script>
import { creator } from '../../factory';
import { deepCopy } from '../../assets/js/utils';
import musicDialog from './musicDialog';
import resourceDialog from './resourceDialog';

export default {
  components: {
    musicDialog,
    resourceDialog,
  },
  inject: ['editor', 'Bus'],
  data() {
    return {
      onSave: false,
      musicDialogState: false, // 音乐素材弹窗
      resourceState: false, // 图片素材弹窗
    };
  },
  mounted() {
    this.Bus.$on('chooseImage', this.handleChooseImage);
    this.Bus.$on('chooseMusic', this.handleChooseMusic);
    this.Bus.$on('saveEnd', this.handleSaveEnd);
  },
  beforeDestroy() {
    this.Bus.$off('chooseImage', this.handleChooseImage);
    this.Bus.$off('chooseMusic', this.handleChooseMusic);
    this.Bus.$off('saveEnd', this.handleSaveEnd);
  },
  methods: {
    /**
     * 点击工具栏
     */
    handleClickTool(type) {
      const toolTypeMap = {
        Text: () => {
          this.editor.addLayer(creator('Text'));
        },
      };
      toolTypeMap[type]();
    },
    /**
     * 保存 / 预览
     */
    handleSave(type) {
      if (!this.editor.currentSymbol) {
        this.$message({
          type: 'error',
          message: '未添加图层！',
        });
        return;
      }
      if (this.editor.currentSymbol ===  this.editor.savedSymbol) {

        this.$message({
          message: '未做任何修改！',
        });
        if (type === 'preview')
          setTimeout(() => this.editor.showPreview = true, 200)
        return;
      }

      this.onSave = true;
      this.editor.currentLayer = null;
      this.Bus.$emit('makeCover', {
        type: type || 'saveData',
        page: deepCopy(this.editor.currentPage),
      });
    },
    handleChooseImage() {
      this.resourceState = true;
    },
    handleChooseMusic() {
      this.musicDialogState = true;
    },
    handleSaveEnd() {
      this.onSave = false;
    },
  },
};
</script>

<style lang="less" scoped>
@headerHeight: 70px;

.header {
  position: relative;
  width: 100%;
  height: @headerHeight;
  line-height: @headerHeight;
  box-shadow: 0 0 5px 0 #999;
  z-index: 10;
  box-sizing: border-box;
  .tools-wrapper {
    height: 100%;
    background: #fff;
    text-align: center;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .tool {
      display: inline-block;
      width: auto;
      cursor: pointer;
      color: #3e3e3e;
      transition: color 0.2s ease-in-out;
      position: relative;
      i {
        font-size: 20px;
        line-height: 20px;
        display: block;
      }
      .name {
        line-height: 17px;
        font-size: 12px;
        margin-top: 5px;
      }
      &:not(:first-child) {
        margin-left: 63px;
      }
      &:hover {
        color: @color-main;
      }
    }
  }

  .logo-wrapper {
    position: absolute;
    left: 60px;
    top: 0;
    height: 100%;
    width: auto;
    z-index: 2;
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    span {
      margin-left: 11px;
      font-size: 30px;
      color: #0f0e0d;
    }
  }

  .options-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: auto;
    z-index: 2;
    padding-right: 60px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .iconic_xiangshang {
    display: inline-block;
    animation: loadingRotate 2s infinite;
    animation-timing-function: linear;
  }

  @keyframes loadingRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
