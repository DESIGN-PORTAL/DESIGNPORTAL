<template>
  <div
    ref="objectWrapper"
    class="dp-object-wrapper"
    in-group="1"
    :class="{
      'dp-object-wrapper-selected': currentLayer && item.id === currentLayer.id,
      'dp-object-wrapper-editing': editor.editTextId === item.id,
    }"
    :style="wrapperStyle"
    @click="handleClickItem"
    @mousedown="handleMouseDown"
    @contextmenu="handleContextMenu"
  >
    <div :style="style">
      <component :is="preName + item.type" v-bind.sync="item" :data.sync="item" :scale="scale" />
    </div>

    <ReSize v-if="currentLayer && item.id === currentLayer.id" :disabled="disabledDirection" :data="item" :scale="scale" />
  </div>
</template>

<script>
import ReSize from './reSize';
import { deepCopy } from '../../assets/js/utils';
import { components, preName, disallowDirections } from '../../factory';
import Adsorb from '../../assets/js/utils/adsorb';

let adsorbIns = null;

export default {
  components: {
    ...components,
    ReSize,
  },
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
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      preName,
      pointStart: {
        x: 0,
        y: 0,
      },
      originPosition: null, // 原始位置
      onDrag: false, // 是否在拖拽中
    };
  },
  computed: {
    currentLayer() {
      return this.editor.currentLayer;
    },
    renderWidth() {
      return this.item.width * this.scale;
    },
    renderHeight() {
      return this.item.height * this.scale;
    },
    renderLeft() {
      return this.item.left * this.scale;
    },
    renderTop() {
      return this.item.top * this.scale;
    },
    renderFontSize() {
      return this.item.fontSize * this.scale;
    },
    wrapperStyle() {
      const { item } = this;
      return {
        width: `${this.renderWidth}px`,
        height: `${this.renderHeight}px`,
        left: `${this.renderLeft}px`,
        top: `${this.renderTop}px`,
        transform: `rotate(${item.rotate}deg)`,
        zIndex: this.index,
        opacity: `${item.hide ? 0 : 1}`,
      };
    },
    style() {
      const { item } = this;
      const style = {
        lineHeight: `${item.lineHeight}`,
        opacity: item.opacity / 100,
      };
      return style;
    },
    /**
     * 禁用拉伸的方向
     */
    disabledDirection() {
      return disallowDirections[this.item.type] || [];
    },
  },
  created() {
    this.Bus.$on('mousemove', this.handleMouseMove);
    this.Bus.$on('mouseleave', this.handleMouseOver);
  },
  beforeDestroy() {
    this.Bus.$off('mousemove', this.handleMouseMove);
    this.Bus.$off('mouseleave', this.handleMouseOver);
  },
  methods: {
    /**
     * 右键点击事件
     */
    handleContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      this.designView.handleContextMenu(e, this.item, this.index);
    },
    /**
     * 鼠标按下
     */
    handleMouseDown(e) {
      this.designView.hideContextMenu();
      if (this.item.lock) return false;
      if (this.item.id === this.editor.editTextId) return;
      // e.preventDefault();
      // e.stopPropagation();

      this.pointStart = {
        x: e.x,
        y: e.y,
      };
      this.originPosition = deepCopy(this.item);

      // 初始化
      const list = document.querySelectorAll('#design-view .dp-object-wrapper');
      adsorbIns = new Adsorb(list, this.$refs.objectWrapper);

      this.onDrag = true;
    },
    handleMouseMove(event) {
      if (!this.onDrag) return;

      const { x, y } = this.pointStart;

      const moveX = event.x - x;
      const moveY = event.y - y;

      // 拖拽处理
      let newX = this.originPosition.left + moveX / this.scale;
      let newY = this.originPosition.top + moveY / this.scale;

      // 如果未开启吸附
      if (!this.designView.assistTool.adsorb) {
        Object.assign(this.item, {
          left: newX,
          top: newY,
        });
        return;
      }

      // 计算是否吸附
      const calcRes = adsorbIns.calc(moveX, moveY);

      const { position, xPoints, yPoints } = calcRes;

      if (position.x !== undefined) {
        newX = this.originPosition.left + position.x / this.scale;
      }
      if (position.y !== undefined) {
        newY = this.originPosition.top + position.y / this.scale;
      }

      this.designView.adsorbLines.x = xPoints;
      this.designView.adsorbLines.y = yPoints;

      Object.assign(this.item, {
        left: newX,
        top: newY,
      });
    },
    handleMouseOver() {
      this.onDrag = false;

      if (!this.originPosition) return;

      const compareAttr = ['left', 'top', 'width', 'height', 'rotate'];

      for (let name of compareAttr) {
        if (this.originPosition[name] !== this.item[name]) {
          this.editor.saveHistory(this.originPosition);
          break;
        }
      }

      this.originPosition = null;

      this.designView.adsorbLines.x = [];
      this.designView.adsorbLines.y = [];
    },
    /**
     * 点击对象选中
     */
    handleClickItem(e) {
      if (this.item.lock) return false;
      if (this.editor.currentLayer && this.editor.currentLayer.id !== this.item.id) {
        this.editor.editTextId = null;
      }
      this.editor.currentLayer = this.item;
      e.preventDefault();
      e.stopPropagation();
      this.Bus.$emit('clickMiddle');
    },
  },
};
</script>

<style lang="less" scoped>
.dp-object-wrapper {
  position: absolute;
  box-sizing: border-box;
  user-select: none;
  cursor: move;
  > div {
    width: 100%;
    height: 100%;
  }
  &:hover {
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      border-style: dotted;
      border-image-source: url('../../assets/img/dashborder.png');
      border-image-slice: 1 1;
      border-image-repeat: round;
      border-width: 1px;
    }
  }

  &.dp-object-wrapper-selected {
    // border: 0.01rem solid #ccc;
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border: none;
    }
  }

  &.dp-object-wrapper-editing {
    cursor: text;
  }
}
</style>
