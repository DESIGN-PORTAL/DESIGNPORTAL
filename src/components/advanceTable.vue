<template>
  <div class="component-advance-table" :class="{ 'advance-table-search': searchFields.length }">
    <!-- 头部搜索组件 -->
    <TableSearch
      v-if="searchFields.length"
      :fields="searchFields"
      :form.sync="searchForm"
      :exportAble="exportAble"
      @search="handleSearch"
    />

    <section>
      <div class="table-tools" v-if="$slots.tools">
        <slot name="tools" />
      </div>

      <!-- 表格 -->
      <Table :columns="columns" :dataSource="dataSource" :haveNoData="haveNoData" :size="size" />
    </section>

    <!-- 分页组件 -->
    <Pagination
      v-if="dataSource.length > 0"
      :size.sync="pageSize"
      :page.sync="page"
      :total="total"
      :sizeVariable="size !== 'mini'"
      @change="handleChangePage"
      @changeSize="handleChangechangeSize"
    />
  </div>
</template>

<script>
import TableSearch from './table/tableSearch';
import Pagination from './table/pagination';
import Table from './table';

export default {
  components: {
    TableSearch,
    Pagination,
    Table,
  },
  props: {
    /**
     * 搜索字段
     */
    searchFields: {
      type: Array,
      default: () => [],
    },
    /**
     * 搜索form对象
     */
    searchForm: {
      type: Object,
      default: () => {},
    },
    payload: {
      type: Object,
      default: () => {},
    },
    /**
     * 表格列集合
     */
    columns: {
      type: Array,
      default: () => [],
    },
    /**
     * 数据源
     */
    dataSource: {
      type: Array,
      default: () => [],
    },
    /**
     * 总数
     */
    total: {
      type: [Number, String],
      default: () => [],
    },
    /**
     * 暂无数据
     */
    haveNoData: {
      type: Boolean,
      default: () => [],
    },
    /**
     * vuex action名称
     */
    dispatchName: {
      type: String,
      default: '',
    },
    /**
     * 是否支持导出
     */
    exportAble: {
      type: Boolean,
      default: false,
    },
    /**
     * 大小
     */
    size: {
      type: String,
      default: 'normal',
    },
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
    };
  },
  created() {
    // if (!this.dispatchName) throw new Error('advanceTable 组件 dispatchName 是必须参数')
    this.getList();
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      const data = {
        page: this.page,
        limit: this.pageSize,
        ...this.searchForm,
        ...this.payload,
      };

      this.$store.dispatch(this.dispatchName, data);
    },
    /**
     * 切换页面
     */
    handleChangePage(page) {
      this.page = page;
      this.getList();
    },
    /**
     * 切换分页条数
     */
    handleChangechangeSize(size) {
      this.page = 1;
      this.pageSize = size;
      this.getList();
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    /**
     * 刷新
     */
    reload() {
      this.handleSearch();
    },
  },
};
</script>

<style lang="less" scoped>
.component-advance-table {
  > section {
    margin-top: 20px;
    background-color: #ffffff;
    .table-tools {
      padding: 10px 20px;
      text-align: right;
    }
  }
}
.component-table-wrapper {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
