<!-- 参考线 -->
<template>
  <div class="design-lines">
    <!-- 临时参考线 -->
    <div
      class="design-line design-line-temp"
      v-for="(ruler, key) in designView.rulers"
      v-show="ruler.showIndicator"
      :class="`design-line-${key}`"
      :key="key"
      :style="style(key, ruler)"
    >
      <p class="line" :style="lineStyle"></p>
      <span class="value">{{ ((ruler.indicator * 2) / scale).toFixed(0) }}</span>
    </div>

    <!-- 参考线 -->
    <template v-for="(ruler, key) in designView.rulers">
      <div
        class="design-line"
        v-for="(line, index) in ruler.lines"
        :key="`${key}${index}`"
        :class="`design-line-${key}`"
        :style="style(key, line)"
        @mousedown="(e) => handleLineMousedown(line, e)"
        @mouseup="handleLineMouseup"
      >
        <p class="line" :style="lineStyle"></p>
        <span class="value">{{ (line.value * 2).toFixed(0) }}</span>
      </div>
    </template>

    <!-- 全面屏适配 参考线 -->
    <template v-if="designView.renderFull">
      <div class="design-line design-line-fullscreen" key="fullLine" :style="fullStyle"></div>
      <div class="design-line design-line-fullscreen-bottom" key="fullLineBottom" :style="fullStyle"></div>
    </template>

    <!-- 短屏适配 参考线 -->
    <template v-if="designView.renderShort">
      <div class="design-line design-line-shortscreen" key="shortLine" :style="shortStyle"></div>
      <div class="design-line design-line-shortscreen-right" key="shortLineRight" :style="shortStyle"></div>
    </template>

    <!-- 吸附 参考线 -->
    <template v-if="designView.assistTool.adsorb">
      <template v-for="(line, index) in designView.adsorbLines.x">
        <div v-if="line" :key="`adsorbX${index}`" class="design-line design-line-x-adsorb" :style="adsorbXStyle(line)"></div>
      </template>
      <template v-for="(line, index) in designView.adsorbLines.y">
        <div :key="`adsorbY${index}`" class="design-line design-line-y-adsorb" :style="adsorbYStyle(line)"></div>
      </template>
    </template>
  </div>
</template>

<script>
/**
 * vertical 顶部标尺点击创建的线 horizontal 左侧标尺点击创建的线
 */

export default {
  inject: ['Bus', 'editor', 'designView'],
  data() {
    return {
      lineMove: null, // 是否在移动参考线
      pointStart: {
        x: 0,
        y: 0,
      },
      originPosition: {
        value: 0,
      },
    };
  },
  computed: {
    scale() {
      return this.editor.scale;
    },
    /**
     * 辅助线颜色
     */
    lineStyle() {
      return {
        backgroundColor: this.designView.assistTool.lineColor,
      };
    },
    phoneAdapter() {
      return this.designView.phoneAdapter;
    },
    /**
     * 全面屏参考线样式
     */
    fullStyle() {
      let width = null;
      let left = null;
      const { lineColor } = this.phoneAdapter;

      if (this.designView.renderShort) {
        width = this.designView.renderWidth + this.designView.shortValue;
        left = -(this.designView.shortValue / 2);
      }

      return {
        left: left && `${left}px`,
        width: width && `${width}px`,
        borderTop: `1px dashed ${lineColor}`,
      };
    },
    /**
     * 短屏参考线样式
     */
    shortStyle() {
      let height = null;
      let top = null;
      const { lineColor } = this.phoneAdapter;

      if (this.designView.renderFull) {
        height = this.designView.renderHeight + this.designView.fullValue;
        top = -(this.designView.fullValue / 2);
      }

      return {
        top: top && `${top}px`,
        height: height && `${height}px`,
        borderLeft: `1px dashed ${lineColor}`,
      };
    },
  },
  created() {
    this.Bus.$on('mousemove', this.handleMouseMove);
    this.Bus.$on('mouseleave', this.handleLineMouseup);
  },
  beforeDestroy() {
    this.Bus.$off('mousemove', this.handleMouseMove);
    this.Bus.$off('mouseleave', this.handleLineMouseup);
  },
  methods: {
    /**
     * 标准参考线样式
     */
    style(type, line) {
      const value = line.indicator || line.value * this.scale;
      let width = null;
      let height = null;
      let left = null;
      let top = null;

      if (type === 'vertical') {
        left = value;
        if (this.designView.renderFull) {
          height = this.designView.renderHeight + this.designView.fullValue;
          top = -(this.designView.fullValue / 2);
        }
      } else {
        top = value;
        if (this.designView.renderShort) {
          width = this.designView.renderWidth + this.designView.shortValue;
          left = -(this.designView.shortValue / 2);
        }
      }

      return {
        left: left && `${left}px`,
        top: top && `${top}px`,
        width: width && `${width}px`,
        height: height && `${height}px`,
      };
    },
    /**
     * X轴吸附 参考线样式
     */
    adsorbXStyle(line) {
      if (!line) return {};
      const left = line.p1.x;
      const top = line.p1.y;
      const height = Math.abs(line.p2.y - line.p1.y);

      return {
        left: `${left}px`,
        top: `${top}px`,
        height: `${height}px`,
        borderColor: this.designView.assistTool.lineColor,
      };
    },
    /**
     * Y轴吸附 参考线样式
     */
    adsorbYStyle(line) {
      if (!line) return {};
      const left = line.p1.x;
      const top = line.p1.y;
      const width = Math.abs(line.p2.x - line.p1.x);
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        borderColor: this.designView.assistTool.lineColor,
      };
    },
    /**
     * 参考线鼠标按下事件
     */
    handleLineMousedown(line, e) {
      this.moveLine = line;
      this.pointStart = {
        x: e.x,
        y: e.y,
      };
      this.originPosition = {
        ...line,
      };
    },
    /**
     * 鼠标移动事件
     */
    handleMouseMove(e) {
      if (!this.moveLine) return;
      const { x, y } = this.pointStart;
      if (this.moveLine.type === 'vertical') {
        const newX = this.originPosition.value + (e.x - x) / this.scale;
        this.moveLine.value = newX;

        // 移出设计范围就删除参考线
        if (newX < -1 || newX > this.designView.renderWidth) {
          const { lines } = this.designView.rulers[this.moveLine.type];
          const index = lines.indexOf(this.moveLine);
          lines.splice(index, 1);
          this.moveLine = null;
        }
      } else {
        const newY = this.originPosition.value + (e.y - y) / this.scale;
        this.moveLine.value = newY;

        // 移出设计范围就删除参考线
        if (newY < -1 || newY > this.designView.renderHeight) {
          const { lines } = this.designView.rulers[this.moveLine.type];
          const index = lines.indexOf(this.moveLine);
          lines.splice(index, 1);
          this.moveLine = null;
        }
      }
    },
    handleLineMouseup() {
      this.moveLine = null;
    },
  },
};
</script>

<style lang="less">
.design-lines {
  .design-line {
    position: absolute;
    z-index: 999;
    user-select: none;
    .line {
      display: block;
      margin: 0 auto;
      background-color: #528aff;
    }
    .value {
      display: block;
      position: absolute;
      background-color: #000;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
      pointer-events: none;
      display: none;
    }

    &:hover {
      .value {
        display: block !important;
      }
    }
  }

  .design-line-temp {
    .line {
      opacity: 0.6;
    }
    .value {
      display: block !important;
    }
  }

  .design-line-vertical {
    height: 100%;
    width: 5px;
    cursor: e-resize;
    transform: translateX(-2px);
    .line {
      width: 1px;
      height: 100%;
    }
    .value {
      top: -18px;
      width: auto;
      height: 14px;
      line-height: 14px;
      padding: 0 4px;
      transform: translate(-50%);
    }
  }

  .design-line-horizontal {
    height: 5px;
    width: 100%;
    cursor: n-resize;
    transform: translateY(-2px);
    .line {
      width: 100%;
      height: 1px;
      margin-top: 2px;
    }
    .value {
      left: -18px;
      height: auto;
      width: 14px;
      line-height: 14px;
      padding: 2px 0;
      transform: translateY(-50%);
      writing-mode: vertical-rl;
      vertical-align: top;
    }
  }

  .design-line-fullscreen {
    top: 0;
    height: 0;
    width: 100%;
  }
  .design-line-fullscreen-bottom {
    bottom: 0;
    height: 0;
    width: 100%;
  }

  .design-line-shortscreen {
    left: 0;
    height: 100%;
    width: 0;
  }
  .design-line-shortscreen-right {
    right: 0;
    height: 100%;
    width: 0;
  }

  .design-line-x-adsorb {
    width: 0;
    border-right-style: dashed;
    border-right-width: 1px;
    border-color: #000;
    position: fixed;
    pointer-events: none;
  }

  .design-line-y-adsorb {
    height: 0;
    border-top-style: dashed;
    border-top-width: 1px;
    border-color: #000;
    position: fixed;
    pointer-events: none;
  }
}
</style>
