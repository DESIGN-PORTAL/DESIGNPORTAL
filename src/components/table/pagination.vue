<template>
  <div class="component-pagination">
    <template v-if="sizeVariable">
      <span>
        当前页面显示
      </span>
      <BSelect v-model="pageSize" style="height: 32px;line-height: 32px;" :dataSource="pageList" @change="handleChangeSize" />
      <span>条</span>
    </template>

    <div class="flex1"></div>

    <span>第{{ page }}/{{ totalPage }}页 共{{ total }}条记录</span>

    <!-- 上一页 -->
    <div class="button button-pre-page" :class="page <= 1 && 'button-disabled'" @click="handlePrePage">
      <i class="arrow arrow-left"></i>
    </div>
    <div class="button">{{ page }}</div>

    <!-- 下一页 -->
    <div class="button button-next-page" :class="page >= totalPage && 'button-disabled'" @click="handleNextPage">
      <i class="arrow arrow-right"></i>
    </div>

    <span>跳至</span>
    <BInput :value="page" style="height: 32px; width: 48px;" @enter="handleEnter" />
    <span>页</span>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 当前页
     */
    page: {
      type: [Number, String],
      default: 1,
    },
    // /**
    //  * 共多少页
    //  */
    // total: {
    //   type: [Number, String],
    //   default: 1,
    // },
    /**
     * 总数据条数
     */
    total: {
      type: [Number, String],
      default: 1,
    },
    /**
     * 总数据条数
     */
    size: {
      type: [Number, String],
      default: 10,
    },
    /**
     * 分页数 集合
     */
    pageList: {
      type: Array,
      default: () => [10, 15, 20],
    },
    /**
     * 分页数可变
     */
    sizeVariable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pageInput: '',
      pageSize: this.size,
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.size) || 1;
    },
  },
  methods: {
    handleChangeSize(size) {
      this.$emit('update:size', size);
      this.$emit('changeSize', size);
    },
    /**
     * 跳转到别的页
     */
    handleChangePage(page) {
      this.$emit('update:page', page);
      this.$emit('change', page);
    },
    handleEnter(e) {
      let value = parseInt(e.target.value);
      if (value > this.totalPage) value = this.totalPage;
      if (value < 1) value = 1;

      e.target.value = value;
      this.handleChangePage(value);
    },
    /**
     * 下一页
     */
    handleNextPage() {
      if (this.page >= this.totalPage) return;
      this.handleChangePage(this.page + 1);
    },
    /**
     * 上一页
     */
    handlePrePage() {
      if (this.page <= 1) return;
      this.handleChangePage(this.page - 1);
    },
  },
};
</script>

<style lang="less" scoped>
.component-pagination {
  padding: 20px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #707070;
  .component-select {
    margin: 0 20px;
  }

  .button {
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 6px;
    background-color: #ffffff;
    border: 1px solid #f4f4f4;
    margin-right: 12px;
    padding: 0 12px;
    // &:last-of-type {
    //   margin-right: 20px;
    // }


    &:hover {
      .arrow {
        &::after {
          border-right-color: @color-main;
          border-bottom-color: @color-main;
        }
      }
    }
  }

  .button-pre-page,
  .button-next-page {
    position: relative;
    cursor: pointer;
    .iconfont {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .button-pre-page {
    margin-left: 20px;
    .iconjiantou1 {
      transform-origin: center center;
      transform: translate(-50%, -50%) rotate(-180deg);
    }
  }

  .button-disabled {
    cursor: not-allowed;
  }

  .component-input {
    margin: 0 12px;
  }

  .flex1 {
    flex: 1;
  }

  .arrow {
    position: absolute;
    right: 9px;
    top: 50%;
    transform-origin: center center;
    transform: translateY(-60%);
    pointer-events: none;
    transition: all 0.3s ease-in-out;
    transform-origin: 5px 5px;
    &::after {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border: 2px solid transparent;
      border-right-color: #999;
      border-bottom-color: #999;
      transform: scale(0.8);
    }
  }

  .arrow-left {
    transform: translateY(-60%) rotate(135deg);
  }

  .arrow-right {
    transform: translateY(-40%) rotate(-45deg);
  }
}
</style>
