<template>
  <div
    :style="style"
    ref="text"
    class="dp-text"
    :contenteditable="editor.editTextId === data.id"
    @mousedown="handleMouseDown"
    @paste="handlePaste"
    v-html="textContent"
  ></div>
</template>

<script>
import { extract } from '../../../services/font';

export default {
  inject: {
    Bus: {
      type: Object,
      default: () => {},
    },
    editor: {
      type: Object,
      default: () => {},
    },
    designView: {
      type: Object,
      default: () => {},
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      observer: null, // dom监听
      mousedownTime: Date.now(),
    };
  },
  computed: {
    textContent() {
      // return this.data.content.indexOf('<div>') < 0 ? `<div>${this.data.content}</div>` : this.data.content;
      return this.data.content;
    },
    style() {
      return {
        fontFamily: `${this.data.fontFamily}`,
        fontSize: `${this.data.fontSize * this.scale}px`,
        textAlign: this.data.textAlign,
        color: this.data.color,
        letterSpacing: `${this.data.letterSpacing * this.scale}px`,
        fontWeight: this.data.fontWeight,
        fontStyle: this.data.fontStyle,
        textDecoration: this.data.textDecoration,
        fontImg: this.data.fontImage,
      };
    },
  },
  mounted() {
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, attributeOldValue: true, childList: true, subtree: true, characterData: true };
    // 创建一个观察器实例并传入回调函数
    this.observer = new MutationObserver(this.handleObserver);
    // 以上述配置开始观察目标节点
    this.observer.observe(this.$refs.text, config);
  },
  beforeDestroy() {
    // 停止观察
    this.observer.disconnect();
  },
  methods: {
    handlePaste(e) {
      this.data.content = e.clipboardData.getData('text').replace(/\n/gi, '<br>');
      e.preventDefault();
    },
    /**
     * 鼠标点击事件
     */
    handleMouseDown() {
      if (this.data.lock) return false;
      if (this.data.id === this.editor.editTextId) return;
      // 双击实现
      if (Date.now() - this.mousedownTime < 200) {
        this.editor.editTextId = this.data.id;
        this.$nextTick(() => {
          this.selectAll();
        });
      }

      this.mousedownTime = Date.now();
    },
    /**
     * dom监听事件
     */
    handleObserver(mutationsList) {
      // 不显示时不监听
      if (this.data.hide) return;

      let breakPoint = false; // 是否打断运行
      let needLoadFont = false; // 是否需要加载提取后的文字
      const mutationMap = {};
      mutationsList.forEach((item) => {
        // 结束编辑
        if (item.type === 'attributes') {

          if (item.attributeName === 'contenteditable' && item.oldValue === 'true') {
            const content = this.$refs.text.innerHTML;
            if (this.data.content !== content) {
              this.editor.saveHistory();
              needLoadFont = true;
            }
            this.data.content = content;
          }

          // 当存在重复修改时 打断运行 避免死循环
          if (mutationMap[item.attributeName]) {
            breakPoint = true;
          }
          mutationMap[item.attributeName] = true;

          if (item.attributeName === 'fontfamily') {
            needLoadFont = true;
          }
        }
      });

      // 当存在重复修改时 打断运行 避免死循环
      if (breakPoint) return;

      if (needLoadFont) this.loadFont();

      const newWidth = this.$refs.text.offsetWidth / this.designView.scale;
      const newHeight = this.$refs.text.offsetHeight / this.designView.scale;

      if (newWidth !== this.data.width || newHeight !== this.data.height) {
        Object.assign(this.data, {
          width: newWidth,
          height: newHeight,
        });
      }
    },
    /**
     * 选中全部
     */
    selectAll() {
      const range = document.createRange();
      range.selectNodeContents(this.$refs.text);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    },
    loadFont() {
      if (!this.data.originFontId) return;

      this.fontExtract({
        content: this.data.content,
        id: this.data.originFontId,
        type: this.data.formatType,
        fontFamily: this.data.fontFamily,
      });
    },
    fontExtract(data) {
      extract(data).then((res) => {
        let style = document.createElement('style');
        let body = document.querySelector('head');
        body.append(style);
        style.innerHTML = res;
      });
    },
  },
};
</script>

<style lang="less">
.dp-text {
  word-break: break-word;
  outline: none;
  width: 100%;
  height: auto;
}
</style>
