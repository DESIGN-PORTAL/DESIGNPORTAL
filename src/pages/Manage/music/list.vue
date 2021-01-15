<template>
  <div class="page-music-list">
    <!-- 字体列表 -->
    <AdvanceTable
      :searchFields="searchFields"
      :searchForm.sync="searchForm"
      :columns="tableColumns"
      :dataSource="list"
      :total="total"
      :haveNoData="haveNoData"
      :dispatchName="`${moduleName}/getList`"
    >
      <div slot="tools">
        <BButton type="primary" @click="handleEdit('add')">+ 新增</BButton>
      </div>
    </AdvanceTable>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import list from '@/mixins/list';
import AdvanceTable from '@/components/advanceTable';

const moduleName = 'music';

export default {
  mixins: [list],
  components: {
    AdvanceTable,
  },
  data() {
    return {
      moduleName,
      searchForm: {
        name: '',
      },
      // 表格列集合
      tableColumns: [
        {
          key: 'name',
          title: '音乐名称',
          width: 230,
        },
        {
          key: 'createUser',
          align: 'center',
          title: '创建人',
        },
        {
          key: 'createAt',
          align: 'center',
          title: '创建时间',
          render: (h, record) => {
            return <div>{this.formatTime(record.row.createAt)}</div>;
          },
        },
        {
          key: 'remark',
          title: '备注',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      list: (state) => state[moduleName].list,
      total: (state) => state[moduleName].total,
      haveNoData: (state) => state[moduleName].haveNoData,
    }),
    /**
     * 搜索列集合
     */
    searchFields() {
      return [
        {
          type: 'input',
          name: 'name',
          label: '音乐名称',
        },
      ];
    },
  },
};
</script>

<style lang="less">
.page-music-list {
  // width: 100%;
}
</style>
