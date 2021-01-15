<template>
  <div>
    <!-- 预览弹窗 -->
    <BModal v-model="showPreview" @close="handleClosed">
      <div class="preview-modal">
        <div class="mobile-area">
          <BButtonGroup>
            <BButton :type="currentNav === 'full' ? 'primary' : 'outline'" @click="currentNav= 'full'">全面屏</BButton>
            <BButton :type="currentNav === 'normal' ? 'primary' : 'outline'" @click="currentNav= 'normal'">常规屏</BButton>
            <BButton :type="currentNav === 'short' ? 'primary' : 'outline'" @click="currentNav= 'short'">短屏</BButton>
          </BButtonGroup>
          
          <!-- 手机屏幕 -->
          <div class="phone-wrapper" :class="`phone-screen-${currentNav}`">
            <div class="phone-bar-wrapper">
              <div class="title">{{ socialShareData.title }}</div>
            </div>
            <div class="view-wrapper">
              <iframe ref="phoneFrame" :src="previewUrl + '&type=preview'" frameborder="0"></iframe>
              <!-- <iframe ref="phoneFrame" src="https://viewerdev.5680.cn/?id=88" frameborder="0"></iframe> -->
            </div>

            <!-- 手机壳样式 -->
            <div class="phone-style-cover"></div>
          </div>

          <!-- 操作栏 -->
          <div class="operate-bar">
            <div class="page-btn reverse" @click="changePage(currentPage - 1)">
              <i class="iconfont iconjiantou1"></i>
            </div>
            <span class="pages"> {{ currentPage + 1 }} / {{ totalPage }} </span>
            <div class="page-btn" @click="changePage(currentPage + 1)">
              <i class="iconfont iconjiantou1"></i>
            </div>
          </div>
        </div>

        <div class="setting-area">
          <div class="title">设置作品标题</div>
          <div class="setting-item">
            <div class="sub-title">分享设置</div>
            <div class="share-setting">
              <div class="share-img">
                <img v-if="socialShareData.image" :src="socialShareData.image" alt="">
                <div class="cover-desc">
                  <BUpload accept=".jpg,.png,.jpeg" @change="handleUploadFile">
                    更新封面
                  </BUpload>
                </div>
              </div>
              <div class="share-content">
                <BInput class="title" v-model="socialShareData.title" @blur="saveSocialShareData" placeholder="请输入标题" />
                <BTextarea class="description" v-model="socialShareData.remark" @blur="saveSocialShareData" placeholder="请输入分享描述" />
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="sub-title">扫码分享<span class="desc">支持微信、QQ、浏览器等扫码</span></div>
            <div class="qrcode">
              <qrcode-vue :size="130" :value="previewUrl"></qrcode-vue>
            </div>
          </div>

          <div class="setting-item">
            <div class="sub-title">
              其他分享方式
            </div>
            <div class="src-wrapper">
              {{ previewUrl }}
              <div class="btn-copy" @click="handleCopy">
                复制链接
              </div>
            </div>
          </div>
        </div>
      </div>
    </BModal>
  </div>
</template>

<script>
// import QRCode from 'qrcode';
import QrcodeVue from 'qrcode.vue';
import { edit, getOne } from '../services/project';
import { upload } from '../services/file';

// 预览地址
const previewHost = process.env.VUE_APP_VIEWER_URL;

export default {
  components: {
    QrcodeVue,
  },
  props: {
    id: {
      type: [String, Number],
      default: () => {},
    },
  },
  data() {
    return {
      showPreview: false,
      currentNav: 'normal',
      // 导航tab
      navTabs: [
        {
          key: 'full',
          text: '全面屏',
        },
        {
          key: 'normal',
          text: '常规屏',
        },
        {
          key: 'short',
          text: '短屏',
        },
      ],
      jsonData: null,
      socialShareData: {},
      currentPage: 0, // 当期页
    };
  },
  computed: {
    totalPage() {
      if (!this.jsonData) return 0;
      return this.jsonData.pages.length;
    },
    previewUrl() {
      return `${previewHost}/?id=${this.id}`;
    },
  },
  created() {
    this.getData();
  },
  mounted() {
    this.showPreview = true;
    window.addEventListener('message', this.handleMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    handleChangeTab() {},
    handleCopy() {
      this.$copyText(this.previewUrl);
      this.$message('复制成功!');
    },
    handleClosed() {
      this.$emit('closed');
    },
    /**
     * iframe消息处理
     */
    handleMessage(message) {
      const { type, data } = message.data
      const typeMap = {
        onPageChange: () => {
          this.currentPage = data
        },
      }

      typeMap[type] && typeMap[type]()

      console.log('message', message)
    },
    changePage(page) {
      if (page >= this.totalPage || page < 0) return;

      this.sendMessage({
        type: 'changePage',
        data: page,
      });
    },
    /**
     * 发送消息
     */
    sendMessage(data) {
      this.$refs.phoneFrame.contentWindow.postMessage(data, '*');
    },
    /**
     * 获取H5作品数据
     */
    getData() {
      getOne({ id: this.id }).then((res) => {
        this.socialShareData = res.socialShare || {};
        this.jsonData = res.data;
      });
    },
    /**
     * 保存社会化分享数据
     */
    saveSocialShareData() {
      edit({
        id: this.id,
        socialShare: this.socialShareData,
      });
    },
    /**
     * 修改分享logo图片
     */
    handleUploadFile(e) {
      const formData = new FormData();
      formData.append('file', e);
      upload(formData).then(res => {
        this.socialShareData.image = res;
        this.saveSocialShareData();
      });
    },
  },
};
</script>

<style lang="less">
.preview-modal {
  width: 750px;
  height: 576px;

  .mobile-area {
    width: 366px;
    height: 100%;
    float: left;
    background: #f6f7fb;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;
    position: relative;
    .phone-wrapper {
      width: 216px;
      height: 427px;
      margin: 30px auto;
      padding: 27px 8px 30px;
      box-sizing: border-box;
      position: relative;

      .phone-bar-wrapper {
        width: 100%;
        height: 49px;
        position: relative;
        background-image: url('../assets/img/phoneBar.png');
        background-size: 100% 100%;
        background-position: center;
        .title {
          font-size: 12px;
          height: 13px;
          line-height: 13px;
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%) scale(0.8);
          color: #3e3e3e;
          // transform-origin: center;
        }
      }

      .view-wrapper {
        width: 100%;
        height: 321px;
        iframe {
          width: 100%;
          height: 100%;
        }
      }

      .phone-style-cover {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 3;
        left: 0;
        top: 0;
        background-image: url('../assets/img/normalScreen.png');
        background-size: 100% 100%;
        background-position: center;
        pointer-events: none;
      }
    }

    .phone-screen-full {
      height: 449px;
      padding: 7px 8px 11px;

      .phone-bar-wrapper {
        height: 47px;
        background-image: url('../assets/img/phoneBarFullScreen.png');
      }

      .view-wrapper {
        height: 383px;
      }

      .phone-style-cover {
        background-image: url('../assets/img/fullScreen.png');
      }
    }

    .phone-screen-short {
      height: 412px;
      padding: 29px 8px 49px;

      .phone-bar-wrapper {
        height: 40px;
        background-image: url('../assets/img/phoneBarShortScreen.png');
      }

      .view-wrapper {
        height: 295px;
      }

      .phone-style-cover {
        background-image: url('../assets/img/shortScreen.png');
      }
    }

    .operate-bar {
      position: absolute;
      left: 0;
      bottom: 22px;
      width: 100%;
      height: 15px;
      line-height: 15px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .pages {
        padding: 0 15px;
      }

      .page-btn {
        height: 15px;
        width: 15px;
        line-height: 15px;
        background-color: #8c8c8c;
        transition: all 0.2s ease-in-out;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          background-color: @color-main;
        }
      }
      .iconfont {
        font-size: 14px;
        color: #fff;
      }

      .reverse {
        transform: rotate(180deg);
      }
    }
  }

  .setting-area {
    width: 384px;
    float: left;
    padding: 21px 21px 0 29px;
    box-sizing: border-box;

    .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 24px;
      vertical-align: bottom;
    }

    .setting-item {
      margin-top: 20px;
      .sub-title {
        font-size: 14px;
        color: #8c8c8c;
        line-height: 24px;
        .desc {
          font-size: 12px;
          margin-left: 5px;
        }
      }

      .share-setting {
        margin-top: 10px;
        .share-img {
          width: 100px;
          height: 100px;
          background-color: #d8d8d8;
          position: relative;
          float: left;
          img {
            width: 100%;
            height: 100%;
          }
          .cover-desc {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 24px;
            line-height: 24px;
            background-color: rgba(0, 0, 0, 0.5);
            text-align: center;
            color: #fff;
            font-size: 12px;
          }
        }

        .share-content {
          width: 224px;
          margin-left: 10px;
          float: left;
          .title {
            width: 224px;
          }

          .description {
            height: 54px;
            margin-top: 10px;
          }
        }
      }

      .qrcode {
        display: inline-block;
        width: 150px;
        height: 150px;
        margin-top: 10px;
        background-color: #fff;
        border: 1px solid #d8d8d8;
        display: flex;
        align-items: center;
        justify-content: center;
        canvas {
          display: block;
        }
      }

      .src-wrapper {
        height: 36px;
        line-height: 36px;
        background-color: #f6f7fb;
        padding: 0 75px 0 12px;
        position: relative;
        border-radius: 4px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin-top: 10px;

        .btn-copy {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: auto;
          padding: 0 9px;
          color: #fff;
          background-color: @color-main;
          cursor: pointer;
          &:hover {
            background-color: rgba(@color-main, 0.7);
          }
        }
      }

      &::after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }
}
</style>
