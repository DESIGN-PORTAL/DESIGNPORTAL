<template>
  <BModal v-model="resourceState" width="750px" class="resourceDialog" @close="toClose">
    <div class="dialog-box">
      <div class="d-b-left">
        <div class="d-b-title">图片素材</div>
        <ul class="d-b-menu">
          <li :class="{ active: currIndex === index }" v-for="(item, index) in menuList" :key="index" @click="menuClick(index)">
            <i :class="item.icon"></i>
            {{ item.name }}
          </li>
        </ul>

        <div class="upload-wrapper" @click="isShow = true">
          <BUpload accept="image/jpeg,image/png" :limit="2" @change="handleFileChange">
            <BButton type="primary" style="width: 160px;">
              本地上传
            </BButton>
          </BUpload>
        </div>
      </div>
      <div class="d-b-right">
        <div v-if="currIndex === 0">
          <BInput
            class="query"
            v-model="param.name"
            placeholder="搜索一下"
            @keyup.enter.native="onSubmit"
            style="width: 240px;"
          />
          <div class="d-b-tabs">
            <ul v-if="resourceList.length != 0" class="img-list">
              <li v-for="(item, index) in resourceList" :key="index">
                <img @click="urlToImg(item.url)" :src="item.url" />
              </li>
            </ul>
            <div style="height:300px;text-align:center;padding-top:100px;" v-else>
              <img style="width:150px;" src="../../assets/img/resourcenull.png" />
              <p style="font-size:12px;margin-top:20px;color:#8C8C8C;">还没上传图片哦~</p>
            </div>
          </div>
        </div>
        <div v-else>
          <ul class="img-list">
            <li class="upload-li" @click="isShow = false">
              <Upload accept="image/jpeg,image/png" :limit="2" @change="handleFileChange">
                <i class="iconfont iconic_tianjiayemian" style="display:block;"></i>
              </Upload>
            </li>
            <li v-for="(item, index) in resourceList" :key="index">
              <img :src="item.url" @click="urlToImg(item.url)" />
              <i @click="delImg(item.id)" class="iconfont iconguanbi"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </BModal>
</template>
<script>
import { fileToBlob, getImageInfo } from '../../assets/js/utils';
import { getList } from '../../services/file';

export default {
  inject: ['editor'],
  data() {
    return {
      resourceState: true,
      currIndex: 0,
      resourceList: [],
      isShow: false,
      param: {
        name: '',
        type: '1',
        classification: 0,
      },
      menuList: [
        {
          name: '素材库',
          icon: 'iconfont iconsucaiku',
        },
        // {
        //   name: '我的图片',
        //   icon: 'iconfont icontupian1',
        // }
      ],
      classificationList: ['全部', '动态', '静态'],
    };
  },
  mounted() {
    this.getResourceList();
  },
  methods: {
    toClose() {
      this.$emit('close');
    },
    menuClick(index) {
      this.currIndex = index;
      this.getResourceList();
    },
    onSubmit() {
      this.getResourceList();
    },
    handleClick() {
      if (this.param.type != '1') {
        this.param.classification = 0;
      }
      this.getResourceList();
    },
    updateClassificaction(index) {
      this.param.classification = index;
      this.getResourceList();
    },
    handleFileChange(file) {
      const formData = new FormData();
      formData.append('file', file);
      this.$store.dispatch('common/uploadImg', formData).then((res) => {
        if (this.isShow) {
          this.imgInit(file, res);
          this.toClose();
        } else {
          this.getResourceList();
        }
      });
    },
    urlToImg(url) {
      let imgInfo = new Image();
      imgInfo.src = url;
      imgInfo.onload = () => {
        const imgRatio = imgInfo.width / imgInfo.height;
        const imgCanvas = this.editor.canvasWidth / this.editor.canvasHeight;
        if (imgInfo.width <= this.editor.canvasWidth && imgInfo.height <= this.editor.canvasHeight) {
          const top = (this.editor.canvasHeight - imgInfo.height) / 2;
          const left = (this.editor.canvasWidth - imgInfo.width) / 2;
          this.editor.handleChooseImg(url, imgInfo.width, imgInfo.height, Math.ceil(top), Math.ceil(left));
        } else if (imgRatio > imgCanvas) {
          // 比较宽的时候
          const heightP = imgInfo.height / (imgInfo.width / this.editor.canvasWidth);
          const top = (this.editor.canvasHeight - heightP) / 2;
          this.editor.handleChooseImg(url, this.editor.canvasWidth, heightP, Math.ceil(top), 0);
        } else if (imgRatio < imgCanvas) {
          // 比较高的时候
          const widthP = imgInfo.width / (imgInfo.height / this.editor.canvasHeight);
          const left = (this.editor.canvasWidth - widthP) / 2;
          this.editor.handleChooseImg(url, widthP, this.editor.canvasHeight, 0, Math.ceil(left));
        }
        this.toClose();
      };
    },
    imgInit(file, res) {
      fileToBlob(file).then((blobFile) => {
        getImageInfo(blobFile).then((imgInfo) => {
          // 图片比例
          const imgRatio = imgInfo.width / imgInfo.height;
          const imgCanvas = this.editor.canvasWidth / this.editor.canvasHeight;
          if (imgInfo.width <= this.editor.canvasWidth && imgInfo.height <= this.editor.canvasHeight) {
            const top = (this.editor.canvasHeight - imgInfo.height) / 2;
            const left = (this.editor.canvasWidth - imgInfo.width) / 2;
            this.editor.handleChooseImg(res, imgInfo.width, imgInfo.height, Math.ceil(top), Math.ceil(left));
          } else if (imgRatio > imgCanvas) {
            // 比较宽的时候
            const heightP = imgInfo.height / (imgInfo.width / this.editor.canvasWidth);
            const top = (this.editor.canvasHeight - heightP) / 2;
            this.editor.handleChooseImg(res, this.editor.canvasWidth, heightP, Math.ceil(top), 0);
          } else if (imgRatio < imgCanvas) {
            // 比较高的时候
            const widthP = imgInfo.width / (imgInfo.height / this.editor.canvasHeight);
            const left = (this.editor.canvasWidth - widthP) / 2;
            this.editor.handleChooseImg(res, widthP, this.editor.canvasHeight, 0, Math.ceil(left));
          }
        });
      });
    },
    delImg(id) {
      this.$axios
        .req({
          url: 'api.editor.sourceMaterialDelete',
          data: [id],
          method: 'POST',
        })
        .then(() => {
          this.getResourceList();
        });
    },
    getResourceList() {
      let data = {
        queryType: this.currIndex + 1,
        limit: 999,
        page: 1,
      };
      if (data.queryType === 1) {
        Object.assign(data, this.param);
        data.type = parseInt(data.type);
      }
      getList(data).then((res) => {
        this.resourceList = res.list;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.resourceDialog {
  .dialog-box {
    overflow: hidden;
    height: 576px;
    width: 750px;
    background: #fff;
    border-radius: 4px;
    > div {
      height: 100%;
      &.d-b-left {
        float: left;
        background: #f6f7fb;
        width: 200px;
        position: relative;
        .d-b-title {
          padding: 30px 20px;
          font-size: 22px;
          font-weight: 600;
          color: #3e3e3e;
        }
        .d-b-menu {
          > li {
            height: 40px;
            line-height: 40px;
            position: relative;
            font-size: 14px;
            color: #3e3e3e;
            cursor: pointer;
            padding-left: 50px;
            > i {
              font-size: 25px;
              position: absolute;
              left: 15px;
            }
            &.active {
              background: #fff;
              cursor: auto;
            }
          }
        }
        .upload-wrapper {
          // background: @color-main;
          color: #fff;
          width: 160px;
          position: absolute;
          bottom: 20px;
          left: 50%;
          margin-left: -80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 4px;
          // .component-upload {
          //   display: block;
          // }
        }
      }
      &.d-b-right {
        overflow: hidden;
        padding: 20px;
        .iconicon_sousuo {
          font-size: 20px;
          color: @color-main;
          line-height: 40px;
          margin-right: 20px;
          cursor: pointer;
        }
        .img-list {
          margin-top: 30px;
          height: 510px;
          overflow-y: scroll;
          &::-webkit-scrollbar {
            width: 0px;
          }
          > li {
            width: 94px;
            height: 94px;
            border-radius: 4px;
            overflow: hidden;
            float: left;
            background-color: #d8d8d8;
            border: 1px solid #f6f7fb;
            box-sizing: border-box;
            margin: 0px 10px 20px 0px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            position: relative;
            &.upload-li {
              background: #fff;
              border: 1px dashed #ccc;
              .component-upload {
                width: 100%;
                height: 100%;
                > i {
                  font-size: 20px;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  z-index: 0;
                }
              }
            }
            &:hover {
              border-color: #ccc;
              > i {
                display: block;
              }
            }
            &:nth-child(5n) {
              margin-right: 0;
            }
            > img {
              width: 100%;
              cursor: pointer;
              display: block;
            }
            > i {
              position: absolute;
              right: 5px;
              top: 5px;
              cursor: pointer;
              color: @color-main;
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
&.d-b-right {
  .query.el-input {
    margin-left: 20px;
    width: 240px;
    .el-input__inner {
      background: #f6f7fb;
      border-radius: 20px;
      border: none;
    }
    .el-input--suffix .el-input__inner {
      border: 0px;
      padding-left: 20px;
      width: 240px;
    }
  }
  .d-b-tabs {
    margin-top: 20px;
    .item-tabs {
      overflow: hidden;
      > li {
        float: left;
        font-size: 12px;
        margin-right: 20px;
        cursor: pointer;
        &.active {
          color: @color-main;
          cursor: auto;
        }
      }
    }
  }
}
</style>
