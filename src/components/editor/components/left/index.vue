<template>
  <div class="pages-list-wrapper">
    <!-- <div class="tabs">
      <div class="tab">
        页面
      </div>
    </div> -->
    <div class="page-list common-scroll">
      <draggable
        class=""
        tag="div"
        :list="editor.data.pages"
        v-bind="{ group: 'title', animation: 150 }"
        no-transition-on-drag
      >
        <transition-group class="" type="transition" :css="true">
          <div
            class="page"
            v-for="(page, index) in pages"
            :key="page.id"
            :class="`${currentPage && page.id === currentPage.id && 'page-selected'} page-type-${page.type || 'h5'}`"
            @click="handleClickPage(page)"
          >
            <div class="index">
              {{ index + 1 }}
            </div>
            <div class="cover-image">
              <!-- <ViewPortal :page="page" :scale="scale" /> -->
              <img v-if="page.coverImg" :src="page.coverImg" alt="" />
            </div>

            <div class="options">
              <div class="option" @click="handleAddPage(index)">
                <i class="iconfont iconic_tianjia"></i>
              </div>
              <div class="option" @click="handleCopay(page, index)">
                <i class="iconfont iconfuzhi"></i>
              </div>
              <div class="option" @click="handleRemove(page, index)">
                <i class="iconfont iconshanchu"></i>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <div class="btn-wrapepr">
      <div class="btn btn-add-page" @click="handleAddPage">+ 添加页面</div>
      <div class="btn btn-import" @click="showUpload = true">从PSD导入</div>
    </div>

    <PsdImport v-if="showUpload" @close="showUpload = false" />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { creator } from '../../factory';
import { deepCopy } from '../../assets/js/utils';
import PsdImport from './psdImport';

export default {
  components: {
    draggable,
    PsdImport,
  },
  inject: ['editor', 'Bus'],
  data() {
    return {
      showUpload: false,
    };
  },
  computed: {
    pages() {
      return (this.editor.data && this.editor.data.pages) || [];
    },
    currentPage() {
      return this.editor.currentPage;
    },
  },
  methods: {
    /**
     * 选中页
     */
    handleClickPage(page) {
      this.editor.currentLayer = null;
      if (this.editor.operationList.length) {
        console.log('legnth', this.editor.operationList.length, this.editor.operationList);
        this.Bus.$emit('makeCover', {
          type: 'changePage',
          page: deepCopy(this.currentPage),
        });
      }
      this.editor.currentPage = page;
      this.editor.operationList = [];
    },
    /**
     * 添加页面
     */
    handleAddPage(index) {
      const page = Object.assign(creator('page'), { id: this.genaratePageId() });
      if (typeof index === 'number') return this.pages.splice(index + 1, 0, page);
      this.pages.push(page);
    },
    /**
     * 删除页面
     */
    handleRemove(page, index) {
      if (this.pages.length === 1) {
        this.$message({ type: 'error', message: '最后一页不能删除' });
        return;
      }

      if (!this.pages[index].layers.length) {
        this.pages.splice(index, 1);
        if (this.currentPage.id === page.id)
          this.editor.currentPage = this.pages.length > index ? this.pages[index] : this.pages[index - 1];

        this.$message('删除成功!');
        return;
      }
      this.$confirm({
        content: '此操作将删除当前页所有图层, 是否继续?',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        onOk: () => {
          this.pages.splice(index, 1);
          // 如果删除的是当前选中页 则把后面一页或前面一页(当后面没有时)作为当前选中页
          if (this.currentPage.id === page.id)
            this.editor.currentPage = this.pages.length > index ? this.pages[index] : this.pages[index - 1];

          this.$message('删除成功!');
        },
      });
    },
    /**
     * 复制页
     */
    handleCopay(page, index) {
      const pageCopay = deepCopy(page);
      deepCopy(Object.assign(pageCopay, { id: this.genaratePageId() }));
      this.pages.splice(index + 1, 0, pageCopay);
    },
    genaratePageId() {
      let maxId = 1;
      this.pages.forEach((page) => {
        if (+page.id > maxId) maxId = +page.id;
      });
      return maxId + 1;
    },
  },
};
</script>

<style lang="less">
// 设计工具区域
.pages-list-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background: #ffffff;
  z-index: 2;
  box-sizing: border-box;
  padding-bottom: 50px;

  .tabs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    color: #3e3e3e;
    background-color: #f6f7fb;
    .tab {
      float: left;
      width: 105px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
    }
  }

  .page-list {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .page {
      width: 100%;
      height: auto;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
      background-color: #fff;
      position: relative;
      padding: 20px 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #dfdfdf;
      transition: all 0.1s ease-in-out;

      .cover-image {
        width: 90px;
        height: 144.72px;
        background-color: #fff;
        border: 1px solid #ededed;
        box-sizing: border-box;
        pointer-events: none;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .index {
        position: absolute;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        background: #f5f5f5;
        color: #8c8c8c;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
      }

      .options {
        position: absolute;
        width: 20px;
        height: 100%;
        top: 0;
        right: 24px;
        text-align: center;
        opacity: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .option {
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 50%;
          transition: all 0.2s ease-in-out;
          &:not(:first-child) {
            margin-top: 12px;
          }
          &:hover {
            background-color: #fff;
            color: @color-main;
          }
        }
      }

      &:not(:last-child) {
      }

      &:hover,
      &.page-selected {
        background: #f6f7fb;
        .index {
          background-color: @color-main;
          color: #fff;
        }
        .options {
          opacity: 1;
        }

        .cover-image {
          border: none;
        }
      }

      &.page-type-h5 {
      }
      &.page-type-long {
        > .cover-image {
          height: 216.95px;
        }
      }
      &.page-type-h5 {
      }
    }
  }

  .btn-wrapepr {
    width: 210px;
    height: 50px;
    background: #ffffff;
    box-shadow: 0px 2px 9px 0px rgba(145, 144, 144, 0.13);
    // padding: 12px 10px;
    box-sizing: border-box;
    font-size: 16px;
    position: relative;
    .btn {
      cursor: pointer;
      user-select: none;
      text-align: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: white;
      background-color: @color-main;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: rgba(@color-main, 0.7);
      }
    }

    .btn-add-page {
      position: relative;
      z-index: 2;
    }

    .btn-import {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    &:hover {
      .btn-import {
        transform: translateY(-100%);
      }
    }
  }
}
</style>
