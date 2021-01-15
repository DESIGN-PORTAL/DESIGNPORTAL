<template>
  <section class="bg-config">
    <BTabs>
      <div class="content" name="背景" key="1">
        <template v-if="currentPage">
          <div class="configure">
            <BUpload class="avatar-uploader" accept=".png,.jpg,.jpeg" @change="handleFileChange" v-if="currentPage.bg.url === ''">
              <div class="noBG">
                <i class="iconfont iconic_tianjiayemian"></i>
                <div>点击添加背景</div>
              </div>
            </BUpload>
            <div v-else>
              <bgCropper />
            </div>
          </div>
        </template>
      </div>
      <div class="content" name="音乐" key="2">
        <div class="mb20 music" v-if="music.url">
          <span> <i class="iconfont iconic_yinle"></i>{{ music.name }} </span>
          <BButton @click="handleClearMusic" style="float: right; height: 28px;">清除</BButton>
        </div>
        <BButton type="outline" @click="handleChooseMusic" style="width: 100%;">{{ music.url ? '替换' : '选择' }}音乐</BButton>
      </div>
    </BTabs>
  </section>
</template>

<script>
import bgCropper from './components/bgCropper';
import { uploadResource } from '../../services/file';

export default {
  components: {
    bgCropper,
  },
  inject: ['editor', 'Bus'],
  data() {
    return {};
  },
  computed: {
    currentPage() {
      return this.editor.currentPage;
    },
    music() {
      return this.editor.data.music;
    },
  },
  methods: {
    clickIMG() {
      this.BGVisible = false;
    },
    handleFileChange(e) {
      const formData = new FormData();
      formData.append('file', e);
      formData.append('type', 'image');

      uploadResource(formData).then((res) => {
        this.editor.saveHistory();
        this.currentPage.bg.url = res;
      });
    },
    /**
     * 选择背景音乐
     */
    handleChooseMusic() {
      this.Bus.$emit('chooseMusic');
    },
    /**
     * 清除背景音乐
     */
    handleClearMusic() {
      this.editor.saveHistoryWithType('music');
      this.music.url = '';
      this.music.name = '';
    },
  },
};
</script>

<style lang="less" scoped>
.mb20 {
  margin-bottom: 20px;
}
.flex-c {
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    flex: 1;
  }
}
.tool {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 0 5px #ccc;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}
.w-100 {
  width: 100%;
}

.bg-config {
  .content {
    padding: 20px;
  }
  .configure {
    margin: 0px 0px 12px;
    vertical-align: top;
    overflow: hidden;
    border-radius: 2px;
    padding: 0px;
    .component-upload {
      display: block;
    }
    .noBG {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: 1px dashed #ddd;
      font-size: 12px;
      color: #999;
      height: 132px;
      cursor: pointer;
      i {
        margin-bottom: 10px;
      }
    }
  }
  .opacity {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .slider {
      flex: 1;
    }
    .el-input-number {
      width: 90px;
    }
  }

  .music {
    font-size: 13px;
    height: 28px;
    line-height: 28px;
    color: #333;
    i {
      margin-right: 5px;
      margin-top: 5px;
    }
  }
}
</style>
