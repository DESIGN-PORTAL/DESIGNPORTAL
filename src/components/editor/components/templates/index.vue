<template>
  <div class="templates-wrapper">
    <BTabs>
      <!-- h5模板 -->
      <div class="templates-list templates-h5" key="h5" name="标准页面">
        <div class="template template-h5 empty" @click="handleClickTemplate('h5')">
          <div class="icon"><i class="iconfont iconic_tianjiayemian"></i></div>
          <div class="title">空白页面</div>
        </div>
      </div>

      <!-- 长页面模板 -->
      <div class="templates-list templates-long" key="long" name="长页面">
        <div class="template template-long empty" @click="handleClickTemplate('long')">
          <div class="icon"><i class="iconfont iconic_tianjiayemian"></i></div>
          <div class="title">空白页面</div>
        </div>
      </div>

      <!-- 趣味页面模板 -->
      <div class="templates-list templates-funny" key="funny" name="趣味页面">
        <div class="template template-h5 empty" @click="handleClickTemplate('funny')">
          <div class="icon"><i class="iconfont iconic_tianjiayemian"></i></div>
          <div class="title">空白页面</div>
        </div>
      </div>
    </BTabs>
  </div>
</template>

<script>
import { creator } from '../../factory';

export default {
  inject: ['editor'],
  methods: {
    /**
     * 选择模板
     */
    handleClickTemplate(type, data) {
      const { currentPage } = this.editor;

      const pageData = data || creator('page', type);
      pageData.id = currentPage.id;

      if (!currentPage.layers.length) {
        this.editor.saveHistory();
        Object.assign(currentPage, pageData);
        return;
      }

      this.$confirm({
        content: '此操作将覆盖原页面！',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        onOk: () => {
          this.editor.saveHistory();
          Object.assign(currentPage, pageData);
        },
      });
    },
  },
};
</script>

<style lang="less">
.templates-wrapper {
  height: 100%;
  width: 100%;

  .templates-list {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 0;
    align-items: flex-start;
    justify-content: flex-start;
    align-content: flex-start;

    .template {
      width: 86px;
      background-color: #f6f7fb;
      cursor: pointer;
      margin-left: 10px;
      border: 1px solid #cbcbcb;
      box-sizing: border-box;
      &:nth-child(3n + 1) {
        margin-left: 0;
      }

      &:nth-child(n + 4) {
        margin-top: 10px;
      }

      &.empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #3e3e3e;
        border-style: dashed;
        .icon {
          > i {
            font-size: 21px;
          }
        }

        .title {
          font-size: 12px;
          margin-top: 13px;
          line-height: 17px;
        }
      }
    }
  }

  .template-h5 {
    height: 138px;
  }

  .template-long {
    height: 187px;
  }
}
</style>
