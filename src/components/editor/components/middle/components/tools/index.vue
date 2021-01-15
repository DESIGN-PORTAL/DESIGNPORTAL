<!-- 设计工具 -->
<template>
  <div class="tools" :style="style">
    <div
      class="tool"
      v-for="tool in tools"
      :class="{
        disabled: tool.disabled,
      }"
      :key="tool.type"
      @click="handleClickTool($event, tool.type)"
    >
      <i class="iconfont" :class="tool.icon"></i>
      <div v-if="tool.hint" class="hint">{{ tool.hint }}</div>
      <ToolRuler v-if="tool.type === 'ruler' && rulerIsShow" />
      <ToolPhoneAdapter v-if="tool.type === 'phoneAdapter' && adapterIsShow" />
    </div>
  </div>
</template>

<script>
import ToolRuler from './toolRuler';
import ToolPhoneAdapter from './toolPhoneAdapter';

let html2canvas = null;

export default {
  components: {
    ToolRuler,
    ToolPhoneAdapter,
  },
  inject: ['Bus', 'editor', 'designView'],
  data() {
    return {
      rulerIsShow: false, // 是否显示标尺工具
      adapterIsShow: false, // 是否显示屏幕适配
    };
  },
  computed: {
    currentPage() {
      return this.editor.currentPage;
    },
    showKey() {
      return (this.designView.isMac && '⌘') || 'ctrl';
    },
    /**
     * 设计区工具列表
     */
    tools() {
      return [
        {
          icon: 'iconic_chexiao',
          type: 'undo',
          disabled: !this.editor.operationList.length,
          hint: `撤销(${this.showKey}+z)`,
        },
        {
          icon: 'iconic_huifu',
          type: 'redo',
          disabled: !this.editor.undoList.length,
          hint: `重做(${this.showKey}+y)`,
        },
        // {
        //   icon: 'iconic_yulan',
        //   type: 'play',
        //   disabled: true,
        //   hint: '',
        // },
        {
          icon: 'iconLayers',
          type: 'layer',
          disabled: false,
          hint: '图层管理',
        },
        {
          icon: 'iconic_biaochi',
          type: 'ruler',
          disabled: false,
          hint: '辅助工具',
        },
        {
          icon: 'iconic_shouji-39',
          type: 'phoneAdapter',
          disabled: false,
          hint: '手机适配',
        },
        {
          icon: 'iconic_xiazai',
          type: 'download',
          disabled: this.currentPage && !this.currentPage.layers.length && this.currentPage.bg.url === '',
          hint: '保存为图片',
        },
      ];
    },
    style() {
      let left = this.editor.leftPanelWidth + this.designView.left + this.designView.renderWidth + 20;

      // 短屏加上短屏附加值一半值
      if (this.designView.renderShort) left += this.designView.shortValue / 2;

      return {
        left: `${left}px`,
        height: `calc(100vh - ${this.editor.headerHeight}px)`,
        top: `${this.editor.headerHeight}px`,
      };
    },
  },
  created() {
    this.Bus.$on('clickMiddle', this.handleClickMiddle);
  },
  mounted() {
    this.$nextTick(() => {
      require.ensure([], function() {
        html2canvas = require('../../../../assets/js/html2canvas.min.js');
      });
    });
  },
  beforeDestroy() {
    this.Bus.$off('clickMiddle', this.handleClickMiddle);
  },
  methods: {
    handleClickMiddle() {
      this.rulerIsShow = false;
      this.adapterIsShow = false;
    },
    /**
     * 点击工具
     */
    handleClickTool(e, type) {
      e.stopPropagation();
      this.Bus.$emit(type);
      const typeMap = {
        download: this.downloadCurrentPage,
        layer: () => {
          this.designView.showLayerManage = !this.designView.showLayerManage;
        },
        ruler: () => {
          this.adapterIsShow = false;
          this.rulerIsShow = true;
        },
        phoneAdapter: () => {
          this.rulerIsShow = false;
          this.adapterIsShow = true;
        },
      };

      typeMap[type] && typeMap[type]();
    },
    /**
     * 下载当前设计
     */
    downloadCurrentPage() {
      const _this = this;

      if (this.currentPage.layers.length > 0 || this.currentPage.bg.url !== '') {
        html2canvas(document.getElementById('design-view'), {
          allowTaint: true,
          useCORS: true,
          backgroundColor: 'transparent',
        }).then(function(canvas) {
          var pageData = canvas.toDataURL();
          // , 1.0  "image/png"
          _this.saveFile(pageData.replace('image/png', 'image/octet-stream'), new Date().getTime() + '.png');
        });
      }
    },
    //下载 的方法
    saveFile(data, filename) {
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = data;
      save_link.download = filename;

      var event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
    },
  },
};
</script>

<style lang="less">
.tools {
  position: fixed;
  top: 0;
  width: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  pointer-events: none;
  .tool {
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    pointer-events: all;

    .hint {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(calc(100% + 10px), -50%);
      width: auto;
      padding: 0 5px;
      height: 18px;
      line-height: 18px;
      border-radius: 4px;
      background-color: #3e3e3e;
      color: #fff;
      font-size: 12px;
      white-space: nowrap;
      display: none;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-right: 5px solid #3e3e3e;
        transform: translate(-95%, -50%);
      }
    }

    &:not(:first-child) {
      margin-top: 10px;
    }
    &:hover {
      background-color: #3e3e3e;
      color: #fff;
      .hint {
        display: block;
      }
    }

    .iconic_shouji-39 {
      font-size: 20px;
    }

    .iconic_xiazai {
      font-size: 17px;
    }
  }

  .disabled {
    pointer-events: none;
    color: #cbcbcb;
  }
}
</style>
