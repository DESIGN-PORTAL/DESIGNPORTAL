<template>
  <div class="editor-wrapper">
    <!-- 顶部工具列表 -->
    <Header />

    <div
      v-if="data"
      class="content-wrapper"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseLeave"
      @mouseleave="handleMouseLeave"
    >
      <!-- 左侧页面列表 -->
      <div class="panel-left" :style="leftPanelStyle">
        <PanelLeft />
      </div>

      <!-- 设计区 -->
      <div
        ref="panelMiddle"
        class="panel-center common-scroll"
        :style="centerPanelStyle"
        @scroll="handleScroll"
      >
        <PanelMiddle />
      </div>

      <!-- 右侧配置区域 -->
      <div
        class="panel-right"
        :class="!showPanelRight && 'panel-hide'"
        :style="rightPanelStyle"
      >
        <PanelRight />
      </div>

      <!-- 右侧模板选择面板 -->
      <div
        class="panel-template common-scroll"
        :class="!showPanelTemplate && 'panel-hide'"
        :style="rightPanelStyle"
      >
        <TemplatesPanel />
      </div>
    </div>

    <!-- 预览弹窗 -->
    <PreviewModal
      v-if="showPreview"
      :id="projectId"
      @closed="showPreview = false"
    />
  </div>
</template>

<script>
// 基础组件
// import './components/base/inject'; // 注入基础组件
import Bus from './assets/js/utils/bus';
import { creator } from './factory';
import Header from './components/header';
import PanelLeft from './components/left';
import PanelRight from './components/right';
import PanelMiddle from './components/middle';
import TemplatesPanel from './components/templates';
import PreviewModal from './components/preview';
import { extractBatch } from './services/font';
import { save, getOne } from './services/project';

const canvasDefaultWidth = 375; // 画布默认宽度
const canvasDefaultHeight = 603; // 画布默认高度

// 缩放级别
const zoomLevel = [1, 1.25, 1.5, 1.75, 2];

export default {
  components: {
    Header,
    PanelLeft,
    PanelRight,
    PanelMiddle,
    TemplatesPanel,
    PreviewModal,
  },
  provide() {
    return {
      Bus,
      editor: this,
    };
  },
  data() {
    return {
      projectId: this.$route.query.id || '', // 作品id
      productName: '未命名作品', // 作品名称
      refProjectId: this.$route.query.refId || '', // 模板作品id
      headerHeight: 70, // 顶部栏高度
      leftPanelWidth: 210, // 左边页面兰宽度
      rightPanelWidth: 320, // 右边配置栏宽度
      canvasScrollTop: 0, // 画布Y轴滚动距离
      zoomLevel,
      scale: 1, // 缩放倍率

      data: null, // 整个设计对象
      currentPage: null, // 当期编辑页
      currentLayer: null, // 当前图层
      currentSymbol: null, // 当前操作的Symbol 记录最后一次操作
      savedSymbol: null, // 已保存的Symbol 判断最近操作是否已经保存
      editTextId: null, // 正在编辑的text元素id
      showImageChoose: false, // 是否显示图片选择弹窗
      operationList: [], // 操作历史
      undoList: [], // 撤回历史
      onSave: false, // 正在保存
      showPreview: false, // 显示预览弹窗
      showPanelTemplate: false, // 显示模板选择面板
      showPanelRight: true, // 显示右侧面板
    };
  },
  computed: {
    /**
     * 左侧面板样式
     */
    leftPanelStyle() {
      return {
        width: `${this.leftPanelWidth}px`,
      };
    },
    /**
     * 右侧面板样式
     */
    rightPanelStyle() {
      return {
        width: `${this.rightPanelWidth}px`,
      };
    },
    /**
     * 设计区样式
     */
    centerPanelStyle() {
      return {
        width: `calc(100% - ${this.rightPanelWidth}px - ${this.leftPanelWidth}px)`,
        left: `${this.leftPanelWidth}px`,
      };
    },
    /**
     * 画布宽度
     */
    canvasWidth() {
      return (this.currentPage && this.currentPage.width) || canvasDefaultWidth;
    },
    /**
     * 画布高度 长页面可以修改高度
     */
    canvasHeight() {
      return (
        (this.currentPage && this.currentPage.height) || canvasDefaultHeight
      );
    },
  },
  created() {
    // 因为路由组件子组件不具备beforeRouteLeave hook 因此用此方式实现 需要在beforeDestroy生命周期移除
    this.$router.beforeHooks.push(this.beforeRouteLeave);

    if (!this.projectId && !this.refProjectId) {
      this.data = creator('poroject');
      this.currentPage = this.data.pages[0];
      return;
    }
    this.getData();
  },
  mounted() {
    Bus.$on('undo', this.handleUndo);
    Bus.$on('redo', this.handleRedo);
    Bus.$on('makeCoverEnd', this.handleMakeCoverEnd);
    Bus.$on('clickMiddle', this.handleClickMiddle);
    Bus.$on('scrollToBottom', this.scrollToBottom);

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    Bus.$off('undo', this.handleUndo);
    Bus.$off('redo', this.handleRedo);
    Bus.$off('makeCoverEnd', this.handleMakeCoverEnd);
    Bus.$off('clickMiddle', this.handleClickMiddle);
    Bus.$off('scrollToBottom', this.scrollToBottom);

    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    this.$router.beforeHooks.pop();
  },
  methods: {
    scrollToBottom() {
      this.$refs.panelMiddle.scrollTo(0, this.canvasHeight * this.scale);
    },
    /**
     * 中间设计区域滚动
     */
    handleScroll(e) {
      this.canvasScrollTop = e.target.scrollTop;
    },
    handleClickMiddle() {
      this.hideTemplate();
    },
    /**
     * 弹出模板选择
     */
    showTemplate() {
      this.showPanelRight = false;
      setTimeout(() => {
        this.showPanelTemplate = true;
      }, 200);
    },
    /**
     * 关闭模板选择
     */
    hideTemplate() {
      if (!this.showPanelTemplate) return;

      this.showPanelTemplate = false;
      setTimeout(() => {
        this.showPanelRight = true;
      }, 200);
    },
    // 修改编辑后  禁止刷新
    handleBeforeUnload(event) {
      event.preventDefault();
      if (this.savedSymbol !== this.currentSymbol) {
        // Older browsers supported custom message
        event.returnValue = '您输入的内容尚未保存，确定离开此页面吗？';
        return '您输入的内容尚未保存，确定离开此页面吗？';
      }
    },
    /**
     * 获取H5作品数据
     */
    getData() {
      getOne({ id: this.projectId || this.refProjectId })
        .then((res) => {
          if (res == null) {
            //  当id 没有数据的时候
            this.data = creator('poroject');
            this.currentPage = this.data.pages[0];
          } else {
            this.data = res.data;
            this.productName = res.name;
            this.currentPage = this.data.pages[0];
            this.useFont();
            this.currentSymbol = this.savedSymbol = Symbol(Date.now());
          }
        })
        .catch((err) => {
          console.log('err', err);
          this.$message({
            type: 'error',
            message: err,
          });
        });
    },
    /**
     * 保存当前页 封面图之后的回调
     */
    async handleMakeCoverEnd(type) {
      console.log('handleMakeCoverEnd', type)
      try {
        await this.fontAnalyze();

        const res = await save({
          id: this.projectId,
          directory: 0,
          name: this.productName,
          data: this.data,
        })


        this.savedSymbol = this.currentSymbol;
        if (!this.projectId) {
          this.projectId = res;
          this.$router.replace(`${this.$route.path}?id=${res}`);
        }

        Bus.$emit('saveEnd');

        this.$message('保存成功');

        // 如果类型为预览 则打开预览弹窗
        if (type === 'preview') this.showPreview = true;
      } catch (e) {
        Bus.$emit('saveEnd');
        this.$message({
          type: 'error',
          message: e,
        });
      }
    },
    /**
     * 退出
     */
    handleExit() {},
    handleMouseDown() {},
    /**
     * 鼠标拖动
     */
    handleMouseMove(e) {
      Bus.$emit('mousemove', e);
    },
    /**
     * 结束拖动
     */
    handleMouseLeave(e) {
      Bus.$emit('mouseleave', e);
    },
    handleChooseImg(img, width = 300, height = 180, top = 0, left = 0) {
      const imgLayer = creator('Image');
      this.addLayer(
        Object.assign(imgLayer, {
          width,
          height,
          img,
          top,
          left,
        })
      );
    },
    /**
     * 修改当前图层属性统一方法
     */
    handleModifyLayer(name, value) {
      console.log('handleModifyLayer', name, value);
      this.saveHistory();
      this.currentLayer[name] = value;
    },
    /**
     * 撤销
     */
    handleUndo() {
      if (!this.operationList.length) return;

      this.currentLayer = null;
      const record = this.operationList.pop();
      const {
        data,
        type,
      } = record.data;

      // 判断是否是其他类型
      if (this.data[type]) {
        this.undoList.push({
          symbol: this.currentSymbol,
          data: {
            type,
            data: JSON.stringify(this.data[type]),
          },
        });
        this.data[type] = JSON.parse(data);
      } else {
      this.undoList.push({
        symbol: this.currentSymbol,
        data: {
          type: 'page',
          data: JSON.stringify(this.currentPage),
        },
      });
        this.currentPage = JSON.parse(data);
      }
      this.currentSymbol = record.symbol;
      // console.log('handleUndo', this.operationList);
    },
    /**
     * 重做
     */
    handleRedo() {
      if (!this.undoList.length) return;

      this.currentLayer = null;

      const record = this.undoList.pop();

      const {
        data,
        type,
      } = record.data;

      // 判断是否是其他类型
      if (this.data[type]) {
        this.operationList.push({
          symbol: this.currentSymbol,
          data: {
            type,
            data: JSON.stringify(this.data[type])
          },
        });
        this.data[type] = JSON.parse(data);
      } else {
        this.operationList.push({
          symbol: this.currentSymbol,
          data: {
            type: 'page',
            data: JSON.stringify(this.currentPage)
          },
        });
        this.currentPage = JSON.parse(data);
      }

      this.currentSymbol = record.symbol;
    },
    /**
     * 保存操作历史
     * @param {Object} originData 原数据
     */
    saveHistory(originData) {
      let data = JSON.stringify(this.currentPage);
      if (originData) {
        const copyData = JSON.parse(data);
        for (let layer of copyData.layers) {
          if (layer.id === originData.id) {
            Object.assign(layer, originData);
            break;
          }
        }
        data = {
          type: 'page',
          data: JSON.stringify(copyData),
        };
      }
      this.operationList.push({
        symbol: this.currentSymbol,
        data,
      });

      this.currentSymbol = Symbol(Date.now());
      this.undoList = [];
      // console.log('saveHistory', this.operationList)
    },
    /**
     * 保存操作历史
     * @param {String} type 类型  music pages等
     */
    saveHistoryWithType(type) {
      const data = {
        type,
        data: JSON.stringify(this.data[type]),
      }

      this.operationList.push({
        symbol: this.currentSymbol,
        data,
      });

      this.currentSymbol = Symbol(Date.now());
      // console.log(data)
      this.undoList = [];
      // console.log('saveHistory', this.operationList)
    },
    /**
     * 添加图层
     */
    addLayer(layer) {
      // console.log('layer', layer)
      this.saveHistory();
      layer.id = this.genarateLayerId();
      if (layer.type === 'EvForm') {
        layer.formName = layer.formName + new Date().getTime();
        layer.modelNumber = layer.id;
      }
      this.currentPage.layers.push(layer);
    },
    // 加载json时获取font,添加新的style标签
    useFont() {
      const fontList = this.data.fontList.map((font) => {
        return {
          name: font.fontFamily,
          url: font.fontUrl,
        };
      });
      this.loadFont(fontList);
    },
    /**
     * 字体解析
     */
    fontAnalyze() {
      const fontList = [];
      const fontMap = {};

      const analyzeList = [];
      const analyzeMap = {};

      this.data.pages.forEach((page) => {
        page.layers.forEach((layer) => {
          if (layer.type === 'Text' && layer.fontFamily && layer.originFontId) {
            if (analyzeMap[layer.fontFamily]) {
              analyzeMap[layer.fontFamily].content += layer.content;
            } else {
              analyzeMap[layer.fontFamily] = {
                content: layer.content,
                fontId: layer.originFontId,
                fontType: layer.formatType,
                fontFamily: layer.fontFamily,
              };
            }

            if (!fontMap[layer.originFontId]) {
              fontMap[layer.originFontId] = {
                fontFamily: layer.fontFamily,
                formatType: layer.formatType,
                fontUrl: layer.fontUrl,
              };
            }
          }
        });
      });

      for (let font in analyzeMap) {
        analyzeList.push(analyzeMap[font]);
      }

      for (let font in fontMap) {
        fontList.push(fontMap[font]);
      }

      return new Promise((resolve, reject) => {
        if (!analyzeList.length) {
          resolve();
          return;
        }

        /**
         * 文字提取
         */
        extractBatch(analyzeList)
          .then((res) => {
            res.forEach((font) => {
              fontMap[font.fontId].fontUrl = font.url;
            });
            this.data.fontList = fontList;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * 生成图层id
     */
    genarateLayerId() {
      let maxId = 1;
      this.currentPage.layers.forEach((layer) => {
        console.log('layer', layer);
        if (+layer.id > maxId) maxId = +layer.id;
      });
      return maxId + 1;
    },
    /**
     * 加载字体
     */
    loadFont(fontList) {
      let html = '';

      fontList.forEach((font) => {
        html += `@font-face {
          font-family: '${font.name}';
          src: url(${font.url});
          font-weight: normal;
          font-style: normal;
        }`;
      });
      let style = document.createElement('style');
      let body = document.querySelector('head');
      body.append(style);
      style.innerHTML = html;
    },
    /**
     * 路由离开前判断是否有更改
     */
    beforeRouteLeave(to, from, next) {
      console.log('?id=5ff54714f74efcaa0a5a2f1e', this.currentSymbol, this.savedSymbol)
      if (this.currentSymbol !== this.savedSymbol) {
        this.$confirm({
          content: '未保存的修改将会丢失，是否确认离开',
          onOk: () => {
            next();
          },
        });
        return;
      }

      next();
    },
  },
};
</script>

<style lang="less" src="./global.less" />
<style lang="less" src="./index.less" scoped />
