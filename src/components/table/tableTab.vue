<template>
  <div class="component-table-tab-wrapper">
    <ul ref="tableTab" class="table-tab">
      <li
        v-for="(tab, index) in dataSource"
        :key="index"
        class="table-tab-item"
        :class="{
          'table-tab-item-activated': tab.key === value,
        }"
        @click="handleClickItem(tab, index, $event)"
      >
        {{ tab.text }}
      </li>

      <!-- 当前tab指示器 -->
      <li class="indicator" :style="indicatorStyle" />
    </ul>

    <!-- 显示方式 -->
    <div class="view-types">
      <div
        v-for="(type, index) in viewTypes"
        :key="index"
        class="view-type"
        :class="viewType === type.name && 'view-type-activated'"
        :title="type.title"
        @click="handleChangeViewType(type.name)"
      >
        <i class="iconfont" :class="type.icon" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 当前tab
     */
    value: {
      type: [String, Number],
      default: '',
    },
    /**
     * 展示模式 默认以列表形式展示 list(列表), chart(图表)
     */
    viewType: {
      type: String,
      default: 'list',
    },
    /**
     * 数据源
     */
    dataSource: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      indicatorLeft: 0,
      nodeIndex: 0,
      viewTypes: [
        {
          name: 'chart',
          icon: 'icontubiao',
          title: '以图表形式展示',
        },
        {
          name: 'list',
          icon: 'iconliebiao1',
          title: '以表格形式展示',
        },
      ],
    };
  },
  computed: {
    indicatorStyle() {
      return `left: ${this.indicatorLeft}px;`;
    },
  },
  mounted() {
    // 如果默认选中的不是第一个 则重置指示面板的位置
    if (this.value !== this.dataSource[0].key) this.handleInit();
    window.addEventListener('resize', this.handleResizeThrottle);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResizeThrottle);
  },
  methods: {
    /**
     * 选中tab
     */
    handleClickItem(item, index, e) {
      this.indicatorLeft = e.currentTarget.offsetLeft;
      this.nodeIndex = index;
      this.$emit('input', item.key);
      this.$emit('change', item.key);
    },
    /**
     * 初始化tab
     */
    handleInit() {
      let nodeIndex = -1;
      for (const index in this.dataSource) {
        if (this.dataSource[index].key === this.value) nodeIndex = index;
      }
      const node = this.$refs.tableTab.children[nodeIndex];
      this.indicatorLeft = node && node.offsetLeft;
      this.nodeIndex = nodeIndex;
    },
    /**
     * 网页窗口大小改变事件处理
     */
    handleResize() {
      const node = this.$refs.tableTab.children[this.nodeIndex];
      this.indicatorLeft = node && node.offsetLeft;
    },
    handleResizeThrottle() {
      this.$common.throttle(this.handleResize, 50)();
    },
    /**
     * 切换展示类型
     */
    handleChangeViewType(type) {
      this.$emit('changeView', type);
    },
  },
};
</script>

<style lang="less">
.component-table-tab-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  line-height: 48px;
  background-color: #f9fafb;
  .table-tab {
    display: flex;
    font-size: 14px;
    color: #8c8c8c;
    position: relative;
    > li {
      list-style: none;
    }
    .table-tab-item {
      width: 112px;
      position: relative;
      cursor: pointer;
      user-select: none;
      z-index: 2;
      text-align: center;
      &:hover {
        color: @color-main;
      }
    }

    .table-tab-item-activated {
      background-color: #ffffff;
      color: @color-main;
      &:hover {
        opacity: 1;
      }
    }

    .indicator {
      position: absolute;
      width: 112px;
      z-index: 3;
      transition: left 0.1s linear;
      height: 2px;
      background-color: @color-main;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .view-types {
    width: auto;
    height: 100%;
    padding-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    .view-type {
      padding: 0 8px;
      cursor: pointer;
      color: #cbcbcb;
      &:hover {
        color: #3e3e3e;
      }
      i {
        font-size: 18px;
      }
    }

    .view-type-activated {
      color: #3e3e3e;
    }
  }
}
</style>
