<template>
  <div class="component-table-search">
    <form ref="form" class="search-form">
      <template v-for="(item, index) in fields">
        <div :key="index" class="search-item">
          <FormItem :label="item.label">
            <!-- 普通输入框 -->
            <template v-if="item.type === 'input'">
              <BInput v-model="form[item.name]" />
            </template>

            <!-- 下拉框 -->
            <template v-if="item.type === 'select'">
              <BSelect v-model="form[item.name]" :style="`width: ${item.width};`" :dataSource="item.dataSource" />
            </template>
          </FormItem>
        </div>
      </template>
      <div class="buttons flex-center">
        <BButton type="primary" @click="handleSearch">搜索</BButton>
        <BButton style="margin-left: 20px" @click="handleClear">重置</BButton>
      </div>
    </form>
  </div>
</template>

<script>
import FormItem from '@/components/table/searchFormItem';

export default {
  components: {
    FormItem,
  },
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
    },
    exportAble: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      indicatorLeft: 0,
      date: '',
    };
  },
  mounted() {},
  methods: {
    /**
     * 搜索
     */
    handleSearch() {
      this.$emit('search');
    },
    /**
     * 清空查询条件
     */
    handleClear() {
      for (const key in this.form) {
        this.form[key] = '';
      }
      this.handleSearch();
    },
    // 当日期修改时
    dateChange(row) {
      this.form.startTime = row[0];
      this.form.endTime = row[1];
    },
  },
};
</script>

<style lang="less">
.component-table-search {
  padding: 20px 20px 0;
  background-color: #ffffff;
  // box-shadow: 0 0 3px 0 #ccc;
  // min-height: 80px;
  // line-height: 80px;
  .search-form {
    display: flex;
    flex-wrap: wrap;
  }
  .search-item {
    margin-bottom: 20px;
    &:not(:first-child) {
      margin-left: 20px;
    }
  }

  .buttons {
    margin-left: 40px;
    display: flex;
    justify-content: flex-start;
    // align-items: center;
    .button {
      width: 76px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #f6f7fb;
      font-size: 14px;
      color: #707070;
      border-radius: 4px;
      margin-right: 20px;
      float: left;
      cursor: pointer;
      transition: all 0.2s linear;
      &:last-child {
        margin-right: 40px;
      }
    }

    .btn-filter {
      background-color: @color-main;
      color: #ffffff;
      &:hover {
        background-color: rgba(@color-main, 0.8);
        color: #ffffff;
        // box-shadow: 0 0 8px 0 rgba(@color-main, 0.7);
      }
    }

    .btn-clear {
      &:hover {
        color: #3e3e3e;
        // box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
