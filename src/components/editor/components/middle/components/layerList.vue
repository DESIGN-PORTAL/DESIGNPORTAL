<template>
  <div class="layer-list-wrapper" :style="style">
    <div class="header" @mousedown="handleMousedown">
      图层管理
      <div class="btn-close" @click="designView.showLayerManage = false"></div>
    </div>

    <div class="content">
      <div class="layer-list" v-if="currentPage">
        <!-- 可拖拽修改图层层次 -->
        <draggable
          class="syllable_ul"
          tag="ul"
          :list="currentPage.layers"
          v-bind="{ group: 'title', animation: 150 }"
          no-transition-on-drag
          filter=".undraggable"
        >
          <transition-group class="" type="transition" :css="true">
            <div
              class="layer"
              v-for="(item, index) in currentPage.layers"
              :key="item.id"
              :class="{
                undraggable: item.lock,
                actived: currentLayer === item,
              }"
              @click="editor.currentLayer = item"
            >
              <i :class="(item.hide && 'iconyincang1') || 'iconzhengyan'" class="iconfont" @click="item.hide = !item.hide"></i>
              <span>{{ item.layerName || '未命名' }}</span>
              <i :class="item.lock ? 'iconic_suo' : 'iconunlock2'" class="suo iconfont" @click="item.lock = !item.lock"></i>
              <i class="iconfont iconshanchu" title="删除图层" @click="handleRemoveLayer(item, index)"></i>
            </div>
          </transition-group>
        </draggable>

        <!-- 背景层 -->
        <div @click="editor.currentLayer = null" class="undraggable layer fixed">
          <i class="iconfont iconzhengyan"></i>
          <span>背景</span>
          <i class="suo iconfont iconic_suo"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  inject: ['editor', 'designView', 'Bus'],
  data() {
    return {
      left: null,
      top: null,
      originPoint: null,
      startPoint: null,
      onDrag: false,
    };
  },
  computed: {
    currentLayer() {
      return this.editor.currentLayer;
    },
    currentPage() {
      return this.editor.currentPage;
    },
    defaultLeft() {
      let left = this.editor.leftPanelWidth + this.designView.left + this.designView.renderWidth + 80;
      if (this.designView.renderShort) left += this.designView.shortValue / 2;
      return left;
    },
    defaultTop() {
      return this.editor.headerHeight + 40;
    },
    style() {
      if (this.left !== null) {
        return {
          left: `${this.left}px`,
          top: `${this.top}px`,
        };
      }
      return {
        left: `${this.defaultLeft}px`,
        top: `${this.defaultTop}px`,
      };
    },
  },
  mounted() {
    this.Bus.$on('mousemove', this.handleMousemove);
    this.Bus.$on('mouseleave', this.handleMouseleave);
  },
  beforeDestroy() {
    this.Bus.$off('mousemove', this.handleMousemove);
    this.Bus.$off('mouseleave', this.handleMouseleave);
  },
  methods: {
    handleMousedown(e) {
      this.startPoint = {
        x: e.pageX,
        y: e.pageY,
      };
      this.originPoint = {
        x: this.left || this.defaultLeft,
        y: this.top || this.defaultTop,
      };
      this.onDrag = true;
    },
    handleMousemove(e) {
      if (!this.onDrag) return;
      const { x, y } = this.startPoint;
      const moveX = e.pageX - x;
      const moveY = e.pageY - y;

      this.left = this.originPoint.x + moveX;
      this.top = this.originPoint.y + moveY;
    },
    handleMouseleave() {
      if (!this.onDrag) return;
      this.onDrag = false;
    },
    /**
     * 移除图层
     */
    handleRemoveLayer(item, index) {
      this.editor.saveHistory();
      this.currentPage.layers.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../../assets/css/mixins.less';

.layer-list-wrapper {
  width: 245px;
  height: 300px;
  position: fixed;
  z-index: 1002;
  left: 300px;
  top: 300px;
  // border: 1px solid #ededed;
  background-color: #ffffff;
  user-select: none;
  box-shadow: 0 0 3px 0 #999;
  border-radius: 2px;
  .header {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding: 0 10px;
    background-color: #ededed;
    cursor: move;

    .btn-close {
      #btnClose();
      position: absolute;
      right: 10px;
      top: 7px;
      width: 15px;
      height: 15px;
    }
  }
  .content {
    overflow-y: auto;
    height: calc(100% - 30px);
    background-color: #fdfdfd;
    .layer-list {
      .layer {
        display: flex;
        align-items: center;
        height: 25px;
        font-size: 12px;
        cursor: pointer;
        padding: 10px;
        border-bottom: 1px solid #f2f2f2;
        &:hover,
        &.actived {
          // color: @color-main;
          background-color: #f2f2f2;

          .iconfont {
            opacity: 1;
          }
        }
        .iconic_suo {
        }

        i {
          width: 25px;
          display: inline-block;
          text-align: center;
          &:hover {
            color: @color-main;
          }
          &:first-child {
            margin-right: 5px;
            opacity: 1;
          }
        }
        .iconyincang1 {
          font-size: 19px;
        }

        .iconunlock2 {
          font-size: 14px;
        }

        .iconfont {
          opacity: 0;
        }

        span {
          flex: 1;
        }
      }
      .undraggable {
        cursor: not-allowed;
      }
      .fixed {
        span {
          color: #9e9e9e;
        }
        i {
          color: #9e9e9e;
          pointer-events: none;
        }

        .iconic_suo {
          opacity: 1;
        }
      }
    }
  }
}
</style>
