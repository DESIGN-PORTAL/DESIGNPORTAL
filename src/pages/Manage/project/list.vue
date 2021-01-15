<template>
  <!-- 项目列表 -->
  <div class="page-project-list">

    <div class="project-list">
      <div class="project project-none" @click="handleClickCreate">
        <div class="btn-create">
        </div>
        <span class="title">创建项目</span>
      </div>
      <div class="project" v-for="project in list" :key="project.id">
        <img :src="project.coverImg" alt="">
        <div class="options">
          <div class="option" @click="previewId = project.id">
            <i class="iconfont iconyulan"></i>预览
          </div>
          <div class="option" @click="$router.push(`/editor?id=${project.id}`)">
            <i class="iconfont iconbianji1"></i>编辑
          </div>
          <div class="option" @click="$router.push(`/editor?refId=${project.id}`)">
            <i class="iconfont iconlianxiwomen"></i>引用
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页组件 -->
    <Pagination
      v-if="list.length > 0"
      :size.sync="pageSize"
      :page.sync="page"
      :total="total"
    />

    <ProjectPreview
      v-if="previewId"
      :id="previewId"
      @closed="previewId = null"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import list from '@/mixins/list';
import Pagination from '@/components/table/pagination';
import ProjectPreview from '@/components/editor/components/preview';

const moduleName = 'project';

export default {
  mixins: [list],
  components: {
    Pagination,
    ProjectPreview,
  },
  data() {
    return {
      moduleName,
      page: 1,
      pageSize: 20,
      previewId: null,
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
  created() {
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
      };

      this.$store.dispatch(`${moduleName}/getList`, data);
    },
    handleClickCreate() {
      this.$router.push('/editor');
    },
  },
};
</script>

<style lang="less" scoped>
.page-project-list {
  .project-list {
    display: flex;
    align-items: flex-start;
    flex-grow: 0;
    flex-shrink: 1;
    flex-wrap: wrap;
    .project {
      width: 240px;
      height: 360px;
      background-color: #ffffff;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      border-radius: 2px;
      position: relative;
      margin-bottom: 20px;
      img {
        width: 100%;
        height: calc(100% - 40px);
        display: block;
      }

      .options {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 40px;
        width: 100%;
        line-height: 40px;
        display: flex;
        .option {
          flex: 1;
          text-align: center;
          color: #666;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-in-out;
          i {
            margin-right: 5px;
          }

          &:hover {
            color: @color-main;
            background-color: #f5f5f5;
          }
        }
      }

      &:not(:last-child) {
        margin-right: 20px;
      }
      &:hover {
        box-shadow: 0 3px 8px 0 #ccc;
        transform: scale(1.02);
        .options {
          border-top: 1px solid #ccc;
        }
      }
    }

    .project-none {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .title {
        margin-top: 16px;
        font-size: 17px;
        color: @color-main;
      }

      .btn-create {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid @color-main;
        position: relative;
        transition: all 0.2s ease-in-out;
        &::before, &::after {
          content: '';
          display: block;
          width: 3px;
          height: 3px;
          background-color: @color-main;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.2s ease-in-out;
        }

        &::before {
          width: 80%;
        }

        &::after {
          height: 80%;
        }
      }


      &:hover {
        .btn-create {
          border-color: @color-main;
          &::before, &::after {
            background-color: @color-main;
          }
        }

        .title {
          color: @color-main;
        }
      }
    }
  }
}
</style>
