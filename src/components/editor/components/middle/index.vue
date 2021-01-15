<template>
  <div
    ref="centerWrapper"
    class="center-wrapper"
    :style="centerWrapperStyle"
    @click="handleClickWrapper"
    @contextmenu="handleContextMenu"
  >
    <div id="design-view" ref="designView" class="design-view" :style="designViewStyle">
      <ViewPortal ref="viewPortal" :page="currentPage" :scale="scale" />

      <!-- 标尺 -->
      <Ruler />

      <!-- 参考线 -->
      <Lines />

      <LongPageSlider v-if="currentPage && currentPage.type === 'long'" />
    </div>

    <!-- 设计区四周遮挡 -->
    <AroundCovers />

    <!-- 缩放工具 -->
    <Zoomer />

    <!-- 设计工具栏 -->
    <Tools />

    <!-- 设计工具栏 -->
    <LayerList v-show="showLayerManage" />

    <!-- html2canvas用 生成预览图片 -->
    <div ref="canvasWrapepr" class="canvas-wrapper" :style="canvasWrapperStyle">
      <ViewPortal v-if="saveingPage" :page="saveingPage" :scale="1" />
    </div>

    <!-- 右键菜单 -->
    <ContextMenu v-if="showContextmenu" :event="contextMenuEvent" :layer="contextMenuItem" />
  </div>
</template>

<script>
import ViewPortal from './viewPotal'; // 显示窗口
import { deepCopy, dataURLtoFile } from '../../assets/js/utils';
import LongPageSlider from './components/longPageSlider'; // 长页面拉伸工具
import Ruler from './components/ruler'; // 标尺
import Lines from './components/lines'; // 参考线
import AroundCovers from './components/aroundCovers'; // 四周遮挡面板
import Tools from './components/tools'; // 工具栏
import Zoomer from './components/zoomer'; // 缩放工具
import LayerList from './components/layerList'; // 缩放工具
import ContextMenu from './components/contextMenu'; // 右键菜单
import hotkeys from 'hotkeys-js';

import { upload } from '../../services/file';

let html2canvas = null;

const shortWidth = 32;
const fullHeight = 118;

export default {
  components: {
    ViewPortal,
    LongPageSlider,
    Ruler,
    Lines,
    AroundCovers,
    Tools,
    Zoomer,
    LayerList,
    ContextMenu,
  },
  inject: ['Bus', 'editor'],
  provide() {
    return {
      designView: this,
    };
  },
  data() {
    return {
      isMac: false, // 是否是mac系统
      left: 0,
      top: 0,
      bottom: 0,
      minWindowWidth: 1280, // 页面最小宽度
      windowWidth: 1280,
      windowHeight: 800,
      minBlankHeight: 160, // 设计区上下空白高度最小值
      wrapperWidth: null, // 设计区总宽度
      wrapperHeight: null, // 设计区总高度
      // 标尺配置
      rulers: {
        vertical: {
          length: 18,
          indicator: 0,
          showIndicator: false, // 显示垂直标尺当前刻度值
          lines: [], // 垂直参考线集合
        },
        horizontal: {
          length: 27,
          indicator: 0,
          showIndicator: false, // 显示水平标尺当前刻度值
          lines: [], // 水平参考线集合
        },
      },
      saveingPage: null, // 当前保存页 截图时使用的
      showLayerManage: false, // 显示图层管理
      showContextmenu: false, // 显示右键菜单
      contextMenuEvent: null, // 右击事件源
      contextMenuItem: null, // 右击对象
      contextMenuIndex: null, // 右击对象index
      copiedItem: null, // 已复制的对象
      // 辅助工具
      assistTool: {
        ruler: true, // 显示标尺
        adsorb: true, // 智能吸附
        lineColor: localStorage.getItem('rulerLineColor') || 'rgba(82, 138, 255, 1)', // 辅助线颜色
      },
      // 屏幕适配
      phoneAdapter: {
        full: !!+localStorage.getItem('phoneAdapterFull') || false, // 全面屏
        short: !!+localStorage.getItem('phoneAdapterShort') || false, // 短屏
        lineColor: localStorage.getItem('phoneAdapterColor') || 'rgba(82, 138, 255, 1)', // 参考线颜色
      },
      // 吸附辅助线集合
      adsorbLines: {
        x: [],
        y: [],
      },
    };
  },
  computed: {
    // 展示区宽度
    scale() {
      return this.editor.scale;
    },
    // 展示区宽度
    width() {
      return this.editor.canvasWidth;
    },
    // 展示区高度
    height() {
      return this.editor.canvasHeight;
    },
    // 展示区宽度
    designWidth() {
      return this.width * 2;
    },
    // 展示区高度
    designHeight() {
      return this.height * 2;
    },
    currentPage() {
      return this.editor.currentPage;
    },
    currentLayer() {
      return this.editor.currentLayer;
    },
    /**
     * 实际渲染高度
     */
    renderHeight() {
      return this.height * this.scale;
    },
    /**
     * 实际渲染宽度
     */
    renderWidth() {
      return this.width * this.scale;
    },
    /**
     * 中间区域样式
     */
    centerWrapperStyle() {
      if (!this.wrapperHeight) return {};
      return {
        height: `${this.wrapperHeight}px`,
        width: `${this.wrapperWidth}px`,
      };
    },
    /**
     * 设计区域 展示区域样式
     */
    designViewStyle() {
      const left = this.left;
      const top = this.top;
      const width = this.renderWidth;
      const height = this.renderHeight;
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: '',
      };
    },
    /**
     * 预览图生成盒子样式
     */
    canvasWrapperStyle() {
      const style = {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };

      if (this.saveingPage) {
        Object.assign(style, {
          height: this.saveingPage.height || 603,
        });
      }
      return style;
    },
    /**
     * 全面屏顶部与底部所占高度
     */
    fullValue() {
      return fullHeight * this.scale;
    },
    /**
     * 全面屏两侧所占宽度
     */
    shortValue() {
      return shortWidth * this.scale;
    },
    /**
     * 是否 渲染全面屏样式 h5页面才有
     */
    renderFull() {
      return this.phoneAdapter.full && (this.currentPage.type === 'h5' || !this.currentPage.type);
    },
    /**
     * 是否 渲染短屏样式 h5页面才有
     */
    renderShort() {
      return this.phoneAdapter.short && (this.currentPage.type === 'h5' || !this.currentPage.type);
    },
  },
  watch: {
    height() {
      this.handleResizeCanvas();
    },
  },
  created() {
    this.isMac = /macintosh|mac os x/i.test(navigator.userAgent);

    this.Bus.$on('makeCover', this.handleMakeCover);

    window.addEventListener('resize', this.handleResize);
  },
  mounted() {
    this.bindShortCuts();

    this.$nextTick(() => {
      this.handleResize();
      require.ensure([], () => {
        html2canvas = require('../../assets/js/html2canvas.min.js');
      });
    });
  },
  beforeDestroy() {
    this.Bus.$off('makeCover', this.handleMakeCover);

    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    /**
     * 绑定快捷键
     */
    bindShortCuts() {
      // 多个快捷方式做同样的事情
      hotkeys('⌘+c, ctrl+c', () => {
        this.handleCopy();
      });
      hotkeys('⌘+v, ctrl+v', () => {
        this.handlePaste();
      });
      hotkeys('⌘+x, ctrl+x', () => {
        this.handleCut();
      });
      hotkeys('⌘+z, ctrl+z', () => {
        this.editor.handleUndo();
      });
      hotkeys('⌘+y, ctrl+y', () => {
        this.editor.handleRedo();
        return false;
      });
    },
    /**
     * 复制
     */
    handleCopy(layer) {
      this.copiedItem = deepCopy(layer || this.currentLayer);
      this.hideContextMenu();
    },
    /**
     * 剪切
     */
    handleCut() {
      this.handleCopy();
      this.handleRemove();
    },
    /**
     * 粘贴
     */
    handlePaste() {
      const id = this.editor.genarateLayerId();
      const item = deepCopy(this.copiedItem);
      Object.assign(item, {
        id,
        left: item.left + 20,
        top: item.top + 20,
      });
      this.editor.addLayer(item);
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
     * 键盘按下事件 快捷键操作
     */
    handleKeydown(e) {
      // 如果正在编辑文本直接返回
      if (this.editTextId !== null) return;

      // 删除
      if (e.keyCode === 46 && this.currentLayer) {
        this.saveHistory();
        const index = this.currentPage.layers.indexOf(this.currentLayer);
        this.currentLayer = null;
        this.currentPage.layers.splice(index, 1);
        return;
      }

      // 组合键  ctrl a, ctrl c, ctrl v, ctrl z 如果没有按下ctrl键 直接返回
      if (!e.ctrlKey) return;

      const keyCodeMap = {
        90: this.handleUndo, // ctrl z 撤回
        89: this.handleRedo, // ctry y 重做
      };

      keyCodeMap[e.keyCode] && keyCodeMap[e.keyCode]();

      // console.log('e.ctrl', e)
    },
    /**
     * 隐藏菜单
     */
    hideContextMenu() {
      this.showContextmenu = false;
    },
    /**
     * 处理右键点击事件，子元素点击也会调用这里（子元素会传入点击的子元素对象)
     */
    handleContextMenu(e, item, index) {
      this.contextMenuEvent = {
        x: e.pageX,
        y: e.pageY,
      };
      this.contextMenuItem = item || null;
      this.contextMenuIndex = index || null;
      if (this.contextMenuItem || this.copiedItem) this.showContextmenu = true;
      else this.showContextmenu = false;
      e.preventDefault();
      e.stopPropagation();
    },
    /**
     * 页面缩放
     */
    handleResize() {
      this.windowWidth = window.innerWidth < this.minWindowWidth ? this.minWindowWidth : window.innerWidth;
      this.windowHeight = window.innerHeight;

      this.handleSetEditor();
    },
    /**
     * 画布大小改变
     */
    handleResizeCanvas() {
      this.handleSetEditor();
    },
    /**
     * 设计区渲染设置
     */
    handleSetEditor() {
      // const panelWidth =
      //   this.windowWidth -
      //   this.editor.leftPanelWidth -
      //   this.editor.rightPanelWidth
      const panelWidth = this.$refs.centerWrapper.getBoundingClientRect().width;
      const panelHeight = this.windowHeight - this.editor.headerHeight;

      // 上下空白区域的和
      const totalBlankHeight = panelHeight - this.renderHeight;

      let top = +(totalBlankHeight / 2).toFixed(0);
      let bottom = totalBlankHeight - top;
      const width = panelWidth - this.renderWidth;
      let left = width / 2;

      if (this.renderHeight >= panelHeight - 150) {
        top = bottom = this.minBlankHeight;
        this.wrapperHeight = this.renderHeight + this.minBlankHeight * 2;
        setTimeout(() => {
          this.handleSetEditor();
        }, 10);
      } else {
        this.wrapperHeight = null;
      }
      this.left = left;
      this.top = top;
      this.bottom = bottom;

      this.rulers.horizontal.length = Math.floor(this.designHeight / 50) + 10;
    },
    /**
     * 点击设计器
     */
    handleClickWrapper() {
      this.editor.currentLayer = null;
      this.editor.editTextId = null;
      this.hideContextMenu();
      this.Bus.$emit('clickMiddle');
    },
    /**
     * 生成预览图
     */
    handleMakeCover(data) {
      const { type, page } = data;
      this.saveingPage = page;
      this.$nextTick(() => {
        html2canvas(this.$refs.canvasWrapepr, {
          allowTaint: true,
          useCORS: true,
          backgroundColor: 'transparent',
        }).then((canvas) => {
          const pageData = canvas.toDataURL();
          const file = dataURLtoFile(pageData, `coverImg${this.saveingPage.id}.png`);

          const formData = new FormData();
          formData.append('file', file, file.name);

          upload(formData).then((res) => {
            for (let item of this.editor.data.pages) {
              if (page.id === item.id) {
                item.coverImg = res;
                break;
              }
            }

            // 如果是全局保存或预览，生成完成之后通知其他组件
            if (['preview', 'saveData'].includes(type)) this.Bus.$emit('makeCoverEnd', type);
          });
          // this.saveingPage = null
        });
      });
    },
  },
};
</script>

<style lang="less">
.center-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  // 设计可视化区域
  .design-view {
    width: 420px;
    height: 675px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    #bigBg {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
    }
  }

  .canvas-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 375px;
    height: 603px;
    background-color: #fff;
    transform: translate(-200%, -200%);
  }
}
</style>
