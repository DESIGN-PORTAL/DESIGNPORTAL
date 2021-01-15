<template>
  <div class="component-table-wrapper">
    <!-- 表头 -->
    <table class="component-table" :class="`component-table—${size}`" cellspacing="0">
      <thead class="table-header">
        <th
          v-for="column in columns"
          :key="column.key"
          class="column"
          :class="{
            'column-sort': column.sortAble,
            'column-sort-asc': sortField.key === column.key && sortField.type === 'asc',
            'column-sort-desc': sortField.key === column.key && sortField.type === 'desc',
          }"
          :style="{
            'text-align': column.align,
          }"
          @click="handleClikColumn(column)"
        >
          <span>{{ column.title }}</span>
        </th>
      </thead>
      <!-- 表内容 -->
      <tbody class="table-body">
        <tr v-for="data in dataSource" :key="data.key" class="table-row">
          <td
            v-for="(column, index) in columns"
            :key="column.key"
            class="table-cell"
            :style="{
              'text-align': column.align,
              width: `${column.width}px`,
            }"
          >
            <template v-if="column.render">
              <table-expand :row="data" :column="data[column.key]" :index="index" :render="column.render" />
            </template>
            <template v-else>
              {{ data[column.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="haveNoData" class="have-no-data">
      暂无数据
    </div>
  </div>
</template>

<script>
import TableExpand from './expand';

export default {
  components: {
    TableExpand,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    /**
     * 没有数据
     */
    haveNoData: {
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
      // 排序字段
      sortField: {
        key: '',
        type: '',
      },
    };
  },
  methods: {
    handleClikColumn(col) {
      const sortTypeMap = {
        '': 'desc',
        desc: 'asc',
        asc: '',
      };
      this.sortField.key = col.key;
      this.sortField.type = sortTypeMap[this.sortField.type];
      console.log('this', this.sortField);
    },
  },
};
</script>

<style lang="less">
.component-table-wrapper {
  background-color: #ffffff;
  border-radius: 4px;
  .component-table {
    width: 100%;

    .table-header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-left: none;
      border-right: none;
      box-sizing: border-box;
      justify-content: space-between;
      .column {
        width: auto;
        flex: 1;
        padding: 0;
        font-size: 14px;
        border-top: 1px solid #f4f4f4;
        border-bottom: 1px solid #f4f4f4;
        font-weight: 500;
        &:first-child {
          padding-left: 20px;
          text-align: left;
        }
        &:last-child {
          text-align: right;
          padding-right: 20px;
        }
      }

      .column-sort {
        user-select: none;
        span {
          cursor: pointer;
          display: inline-block;
          padding-right: 14px;
          line-height: 20px;
          position: relative;
          &::before,
          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            position: absolute;
            right: 0;
            border-width: 4.5px;
            border-style: solid;
            border-color: transparent;
          }

          &::before {
            top: 50%;
            border-bottom-color: #cbcbcb;
            transform: translateY(-100%);
          }

          &::after {
            top: 50%;
            border-top-color: #cbcbcb;
            transform: translateY(30%);
          }
        }
      }

      .column-sort-asc {
        span {
          &::before {
            border-bottom-color: @color-main;
          }
        }
      }

      .column-sort-desc {
        span {
          &::after {
            border-top-color: @color-main;
          }
        }
      }
    }

    .table-body {
      color: #666;
      .table-row {
        height: 75px;
        font-size: 14px;
        &:hover {
          background-color: rgba(@color-main, 0.05);
        }
        &:not(:last-child) {
          .table-cell {
            border-bottom: 1px solid #f4f4f4;
          }
        }

        .table-cell {
          padding: 20px 0px;
          box-sizing: border-box;
          &:first-child {
            padding-left: 20px;
          }
          &:last-child {
            text-align: right;
            padding-right: 20px;
          }
          a {
            white-space: nowrap;
            color: #0276ff;
            font-size: 14px;
          }
        }
      }
    }
  }

  .component-table—mini {
    .table-header {
      height: 52px;
      background: #f6f7fb;
    }

    .table-body {
      .table-row {
        height: 60px;
      }
    }
  }

  .have-no-data {
    width: 100%;
    height: 202px;
    line-height: 222px;
    text-align: center;
    font-size: 14px;
  }
}
</style>
