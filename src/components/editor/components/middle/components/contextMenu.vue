<template>
  <ul v-if="layer" class="dp-contextmenu" :style="style">
    <li class="menu-item" @click="handleCopy">复制</li>
    <li class="menu-item" :class="!designView.copiedItem && 'menu-item-disabled'" @click="handlePaste">粘贴</li>
    <li class="menu-item" @click="handleCut">剪切</li>
    <li class="menu-split"></li>
    <!-- <li class="menu-item" @click="handleCopy">上移一层</li>
    <li class="menu-item" @click="handleCopy">下移一层</li>
    <li class="menu-item" @click="handleCopy">置于顶层</li>
    <li class="menu-item" @click="handleCopy">置于底层</li>
    <li class="menu-split"></li> -->
    <li class="menu-item" @click="handleLock">{{ layer.lock ? '解锁' : '锁定' }}</li>
    <li class="menu-item" @click="handleRemove">删除</li>
  </ul>
  <ul v-else class="dp-contextmenu" :style="style">
    <li class="menu-item" @click="handlePaste">粘贴</li>
  </ul>
</template>

<script>
import { deepCopy } from '../../../assets/js/utils';
export default {
  inject: ['editor', 'designView'],
  props: {
    /**
     * 右击事件e
     */
    event: {
      type: Object,
      default: () => {},
    },
    /**
     * 当前右击的图层
     */
    layer: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    currentPage() {
      return this.editor.currentPage;
    },
    /**
     * 图层索引
     */
    layerIndex() {
      if (!this.layer || !this.currentPage) return -1;
      return this.currentPage.layers.indexOf(this.layer);
    },
    /**
     * 样式
     */
    style() {
      const style = {
        left: `${this.event.x}px`,
        top: `${this.event.y}px`,
      };
      return style;
    },
  },
  mounted() {
    console.log('layerIndex', this.layerIndex);
  },
  methods: {
    /**
     * 复制
     */
    handleCopy() {
      this.designView.copiedItem = deepCopy(this.layer);
      this.hideContextMenu();
    },
    /**
     * 剪切
     */
    handleCut() {
      this.handleCopy();
      this.handleRemove();
      this.hideContextMenu();
    },
    /**
     * 粘贴
     */
    handlePaste() {
      const id = this.editor.genarateLayerId();
      const item = deepCopy(this.designView.copiedItem);
      Object.assign(item, {
        id,
        left: this.event.x - this.editor.leftPanelWidth - this.designView.left,
        top: this.event.y - this.editor.headerHeight - this.designView.top,
      });
      this.editor.addLayer(item);
      this.hideContextMenu();
    },
    /**
     * 锁定/解锁
     */
    handleLock() {
      this.layer.lock = !this.layer.lock;
    },
    /**
     * 移除
     */
    handleRemove() {
      this.editor.saveHistory();
      this.currentPage.layers.splice(this.layerIndex, 1);
      this.hideContextMenu();
    },
    /**
     * 隐藏菜单
     */
    hideContextMenu() {
      this.designView.hideContextMenu();
    },
  },
};
</script>

<style lang="less">
.dp-contextmenu {
  position: fixed;
  width: 60px;
  height: auto;
  background-color: #fff;
  // border: 1px solid #DFDFDF;
  box-shadow: 2px 2px 18px 0px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  text-align: center;
  .menu-item {
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    font-size: 14px;
    color: #3e3e3e;
    cursor: pointer;
    &:hover {
      color: @color-main;
    }

    &.menu-item-disabled {
      color: #9999;
      pointer-events: none;
    }
  }
  .menu-split {
    height: 1px;
    background-color: #ededed;
    margin: 5px 0;
  }
}
</style>
