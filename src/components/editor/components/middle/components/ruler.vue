<!-- 标尺 -->
<template>
  <div class="rulers" v-show="designView.assistTool.ruler">
    <div
      class="ruler ruler-top"
      v-for="(ruler, key) in designView.rulers"
      :key="key"
      :class="`ruler-${key}`"
      :style="style(key)"
      @mouseenter="(e) => handleRulerMouseEnter(key, e)"
      @mousemove="(e) => handleRulerMouseMove(key, e)"
      @mouseleave="(e) => handleRulerMouseLeave(key, e)"
      @click="(e) => handleAddLine(key, e)"
    >
      <!-- 全面屏时 顶部多出来的尺寸 -->
      <template v-if="key === 'horizontal' && designView.renderFull">
        <p :key="-100" :style="calibrationStyle('horizontal')">
          <span>-100</span>
        </p>
        <p :key="-50" :style="calibrationStyle('horizontal')">
          <span></span>
        </p>
      </template>

      <template v-for="item in ruler.length">
        <p :key="item" :style="calibrationStyle(key)">
          <span>{{ (item - 1) % 2 === 0 ? ((item - 1) / 2) * 100 : '' }}</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['editor', 'designView'],
  methods: {
    style(type) {
      const { shortValue, fullValue, scale } = this.designView;
      let width = null;
      let height = null;
      let top = null;
      let left = null;
      let paddingLeft = null;
      let marginLeft = null;
      let paddingTop = null;
      let marginTop = null;

      // 左侧
      if (type === 'horizontal') {
        left = -18;
        height = this.designView.renderHeight;

        if (this.designView.renderShort) {
          left -= this.designView.shortValue / 2;
        }
        // 如果是全面屏
        if (this.designView.renderFull) {
          marginTop = -(fullValue / 2); // margin顶部要加上 负的 全面屏半值
          paddingTop = 9 * scale;
          height += fullValue; // 高度要加上全面屏的高度
        }
      } else {
        // 顶部
        top = -18;
        width = this.designView.renderWidth;

        if (this.designView.renderFull) {
          top -= this.designView.fullValue / 2;
        }
        if (this.designView.renderShort) {
          marginLeft = -(shortValue / 2);
          paddingLeft = shortValue / 2;
          width += shortValue;
        }
      }

      return {
        width: width && `${width}px`,
        height: height && `${height}px`,
        top: top && `${top}px`,
        left: left && `${left}px`,
        marginTop: marginTop && `${marginTop}px`,
        marginLeft: marginLeft && `${marginLeft}px`,
        paddingTop: paddingTop && `${paddingTop}px`,
        paddingLeft: paddingLeft && `${paddingLeft}px`,
      };
    },
    calibrationStyle(type) {
      return {
        width: `${type === 'vertical' ? (50 * this.designView.renderWidth) / this.designView.designWidth : null}px`,
        height: `${type === 'horizontal' ? (50 * this.designView.renderHeight) / this.designView.designHeight : null}px`,
      };
    },
    /**
     * 标尺鼠标进入事件
     */
    handleRulerMouseEnter(type, e) {
      const { rulers, top, left } = this.designView;

      rulers[type].showIndicator = true;

      let value = e[type === 'horizontal' ? 'pageY' : 'pageX'];

      if (type === 'horizontal') {
        value = value - (this.editor.headerHeight + top);
      } else {
        value = value - (this.editor.leftPanelWidth + left);
      }
      rulers[type].indicator = value;
    },
    /**
     * 标尺鼠标移动事件
     */
    handleRulerMouseMove(type, e) {
      const { rulers, top, left } = this.designView;

      let value = e[type === 'horizontal' ? 'pageY' : 'pageX'];
      if (type === 'horizontal') {
        value = value - (this.editor.headerHeight + top) + this.editor.canvasScrollTop;
      } else {
        value = value - (this.editor.leftPanelWidth + left);
      }

      rulers[type].indicator = value;
    },
    /**
     * 标尺鼠标离开事件
     */
    handleRulerMouseLeave(type) {
      this.designView.rulers[type].showIndicator = false;
    },
    /**
     * 添加参考线
     */
    handleAddLine(type, e) {
      const { rulers, top, left, scale } = this.designView;

      let value = e[type === 'horizontal' ? 'pageY' : 'pageX'];
      if (type === 'horizontal') {
        value = value - (this.editor.headerHeight + top) + this.editor.canvasScrollTop;
      } else {
        value = value - (this.editor.leftPanelWidth + left);
      }
      console.log('value', value);
      const line = {
        type,
        value: value / scale,
      };

      rulers[type].lines.push(line);
    },
  },
};
</script>

<style lang="less">
.rulers {
  .ruler {
    position: absolute;
    white-space: nowrap;
    overflow: hidden;
    user-select: none;
    p {
      font-size: 12px;
      color: #707070;
      pointer-events: none;
    }
  }
  .ruler-vertical {
    height: 16px;
    line-height: 16px;
    top: -18px;
    p {
      display: inline-block;
      height: 100%;
      margin: 0;
      border-left: 1px solid #707070;
      box-sizing: border-box;
      vertical-align: bottom;
      text-align: left;
      padding-left: 4px;
      line-height: 10px;
      &:nth-of-type(even) {
        height: 30%;
      }
    }
  }
  .ruler-horizontal {
    width: 16px;
    line-height: 16px;
    left: -18px;
    p {
      display: block;
      float: right;
      width: 100%;
      margin: 0;
      border-top: 1px solid #707070;
      box-sizing: border-box;
      line-height: 10px;
      text-align: left;
      padding-top: 3px;
      span {
        line-height: 10px;
        writing-mode: vertical-rl;
        vertical-align: top;
      }
      &:nth-of-type(even) {
        width: 30%;
      }
    }
  }
}
</style>
