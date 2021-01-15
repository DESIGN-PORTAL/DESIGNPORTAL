<template>
  <div class="page-font-list">
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

const moduleName = 'font';

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
          title: '字体名称',
          width: 230,
          render: (h, record) => {
            this.loadFont(record.row);
            return <div style={{ fontFamily: `'${record.row.name}'` }}>{record.row.name}</div>;
          },
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
          label: '字体名称',
        },
      ];
    },
  },
  filters: {},
  methods: {
    /**
     * 加载字体
     */
    loadFont(font) {
      const existDom = document.querySelector(`head style[data-id="${font.id}"]`);

      let html = `@font-face {
        font-family: '${font.name}';
        src: url(${font.url});
        font-weight: normal;
        font-style: normal;
      }`;

      if (existDom) {
        existDom.innerHTML = html;
        return;
      }

      let style = document.createElement('style');
      let body = document.querySelector('head');
      body.append(style);
      style.innerHTML = html;
      style.setAttribute('data-id', font.id);
    },
  },
};
</script>

<style lang="less">
.page-fonts-list {
  // width: 100%;
}
</style>
