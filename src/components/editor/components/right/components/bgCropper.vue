<template>
  <section>
    <div class="img-container">
      <div v-show="cropperState" class="bgCanvasBox">
        <div :style="bgStyle" class="bgCanvas"></div>
      </div>
      <div class="bgCanvas" style="height: 100%" v-show="!cropperState">
        <img ref="image" v-if="currentPage" :src="currentPage.bg.url" />
      </div>
    </div>
    <div v-if="cropperState">
      <div class="flex-c">
        <BUpload class="avatar-uploader" @change="handleFileChange">
          <BButton class="w-100">替换背景</BButton>
        </BUpload>
        <BButton @click="handle('tailor')">裁剪图片</BButton>
      </div>
      <!-- <BButton @click="handle('remove')">移除背景</BButton> -->
      <div class="sliderBox">
        <div class="text">不透明</div>
        <BSlider class="slider" v-model="currentPage.bg.opacity" :step="1" :min="0" :max="100" @change="modifyAttr" />
        <BInput class="num" v-model="currentPage.bg.opacity" @keyup.enter.native="handleClick">
          <div slot="suffix">%</div>
        </BInput>
      </div>
    </div>
    <div v-else class="cropperButton">
      <BButton @click="cancel()">取消</BButton>
      <BButton @click="confirmCropper()">确定裁剪</BButton>
    </div>
  </section>
</template>

<script>
import Cropper from 'cropperjs';
export default {
  name: 'ImageCropper',
  inject: ['editor'],
  data() {
    return {
      cropperState: true,
      cropper: null,
      destination: '',
      image: {},
      bgConfig: '',
      cropperBG: document.getElementById('bigBg'),
      opacity: {
        role: 'opacity',
        title: '不透明',
        units: '%',
        defaultVal: 100,
        min: 0,
        max: 100,
      },
    };
  },
  computed: {
    currentPage() {
      return this.editor.currentPage;
    },
    bgStyle() {
      if (!this.currentPage) return;
      const { x, y, width, height, naturalWidth, naturalHeight, url, opacity } = this.currentPage.bg;

      const backgroundSizeWidth = 177 / (width / naturalWidth);
      const backgroundSizeHeight = 280 / (height / naturalHeight);
      return {
        opacity: opacity / 100,
        backgroundImage: 'url(' + url + ')',
        backgroundSize: `${backgroundSizeWidth}px ${backgroundSizeHeight}px`,
        backgroundPositionX: (backgroundSizeWidth / naturalWidth) * x * -1 + 'px',
        backgroundPositionY: (backgroundSizeHeight / naturalHeight) * y * -1 + 'px',
      };
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 替换成功后
    handleAvatarSuccess(res) {
      this.editor.saveHistory();
      this.currentPage.bg.url = res.data;
      this.currentPage.bg.opacity = 100;
      if (this.cropper) {
        this.cropper.reset();
        this.cropper.replace(res.data, false);
        // this.cropper.destroy()
        // this.cropperImg()
      }
    },
    handleFileChange(e) {
      this.$parent.handleFileChange(e);
    },
    // 计算小图

    // 裁剪图片
    cropperImg() {
      this.image = this.$refs.image;
      this.cropper = new Cropper(this.image, {
        aspectRatio: 140 / 220,
        zoomable: false,
        scalable: false,
        autoCropArea: 1,
        viewMode: 1,
        autoCrop: true,
        minContainerWidth: 280,
        minContainerHeight: 280,
        responsive: false,
        crop: () => {
          const data = this.cropper.getData();
          const imageData = this.cropper.getImageData();
          console.log('裁剪图片', data);
          // 传给 主组件
          Object.assign(this.currentPage.bg, {
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            naturalWidth: imageData.naturalWidth,
            naturalHeight: imageData.naturalHeight,
          });
        },
      });
    },
    // 裁剪和移除背景
    handle(test) {
      if (test === 'tailor') {
        if (!this.cropper) {
          this.cropperImg();
        }
        this.cropperState = false;
      } else {
        // 移除背景 初始化
        this.cropper.destroy();
        this.currentPage.bg.url = '';
      }
    },
    // 取消裁剪
    cancel() {
      this.cropper.reset();
      //销毁裁剪对象
      this.cropperState = true;
    },

    // 确定裁剪
    confirmCropper() {
      this.cropperState = true;
    },
    // 汇集数据
    modifyAttr(val) {
      console.log('opacity', val);
      this.currentPage.bg.opacity = val;
    },
  },
};
</script>
<style lang="less" scoped></style>
<style lang="less">
.sliderBox {
  .slider {
    margin: 0px 20px;
  }
}
.flex-c {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  & > button {
    flex-grow: 1;
  }
  .avatar-uploader {
    flex-grow: 1;
    margin-right: 10px;
    button {
      width: 100%;
    }
  }
}
.cropperButton {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  button {
    flex: 1;
  }
}
.canvas {
  width: 340px;
  height: 536px;
  border: 1px red solid;
  margin-left: 300px;
  overflow: hidden;
}
.bgCanvasBox {
  height: 100%;
  .bgCanvas {
    width: 177px;
    height: 100%;
    margin: 0px auto;
  }
}
.bgCanvas {
  height: 100%;
  background-repeat: no-repeat;
  margin: 0px auto;
  background-position: center;
  background-size: auto 100%;
}
.cropper-container {
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cropper-container img {
  display: block;
  height: 100%;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
  width: 100%;
}
.cropper-canvas,
.cropper-crop-box,
.cropper-drag-box,
.cropper-modal,
.cropper-wrap-box {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.cropper-canvas,
.cropper-wrap-box {
  overflow: hidden;
}
.cropper-drag-box {
  background-color: #fff;
  opacity: 0;
}
.cropper-modal {
  background-color: #000;
  opacity: 0.5;
}
.cropper-view-box {
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}
.cropper-dashed {
  border: 0 dashed #eee;
  display: block;
  opacity: 0.5;
  position: absolute;
}
.cropper-dashed.dashed-h {
  border-bottom-width: 1px;
  border-top-width: 1px;
  height: 33.33333%;
  left: 0;
  top: 33.33333%;
  width: 100%;
}
.cropper-dashed.dashed-v {
  border-left-width: 1px;
  border-right-width: 1px;
  height: 100%;
  left: 33.33333%;
  top: 0;
  width: 33.33333%;
}
.cropper-center {
  display: block;
  height: 0;
  left: 50%;
  opacity: 0.75;
  position: absolute;
  top: 50%;
  width: 0;
}
.cropper-center:after,
.cropper-center:before {
  background-color: #eee;
  content: ' ';
  display: block;
  position: absolute;
}
.cropper-center:before {
  height: 1px;
  left: -3px;
  top: 0;
  width: 7px;
}
.cropper-center:after {
  height: 7px;
  left: 0;
  top: -3px;
  width: 1px;
}
.cropper-face,
.cropper-line,
.cropper-point {
  display: block;
  height: 100%;
  opacity: 0.1;
  position: absolute;
  width: 100%;
}
.cropper-face {
  background-color: #fff;
  left: 0;
  top: 0;
}
.cropper-line {
  background-color: #39f;
}
.cropper-line.line-e {
  cursor: ew-resize;
  right: -3px;
  top: 0;
  width: 5px;
}
.cropper-line.line-n {
  cursor: ns-resize;
  height: 5px;
  left: 0;
  top: -3px;
}
.cropper-line.line-w {
  cursor: ew-resize;
  left: -3px;
  top: 0;
  width: 5px;
}
.cropper-line.line-s {
  bottom: -3px;
  cursor: ns-resize;
  height: 5px;
  left: 0;
}
.cropper-point {
  background-color: #39f;
  height: 5px;
  opacity: 0.75;
  width: 5px;
}
.cropper-point.point-e {
  cursor: ew-resize;
  margin-top: -3px;
  right: -3px;
  top: 50%;
}
.cropper-point.point-n {
  cursor: ns-resize;
  left: 50%;
  margin-left: -3px;
  top: -3px;
}
.cropper-point.point-w {
  cursor: ew-resize;
  left: -3px;
  margin-top: -3px;
  top: 50%;
}
.cropper-point.point-s {
  bottom: -3px;
  cursor: s-resize;
  left: 50%;
  margin-left: -3px;
}
.cropper-point.point-ne {
  cursor: nesw-resize;
  right: -3px;
  top: -3px;
}
.cropper-point.point-nw {
  cursor: nwse-resize;
  left: -3px;
  top: -3px;
}
.cropper-point.point-sw {
  bottom: -3px;
  cursor: nesw-resize;
  left: -3px;
}
.cropper-point.point-se {
  bottom: -3px;
  cursor: nwse-resize;
  height: 20px;
  opacity: 1;
  right: -3px;
  width: 20px;
}
@media (min-width: 768px) {
  .cropper-point.point-se {
    height: 15px;
    width: 15px;
  }
}
@media (min-width: 992px) {
  .cropper-point.point-se {
    height: 10px;
    width: 10px;
  }
}
@media (min-width: 1200px) {
  .cropper-point.point-se {
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }
}
.cropper-point.point-se:before {
  background-color: #39f;
  bottom: -50%;
  content: ' ';
  display: block;
  height: 200%;
  opacity: 0;
  position: absolute;
  right: -50%;
  width: 200%;
}
.cropper-invisible {
  opacity: 0;
}
.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}
.cropper-hide {
  display: block;
  height: 0;
  position: absolute;
  width: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
.img-container {
  width: 280px;
  height: 280px;
  text-align: center;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  img {
    height: 100%;
  }
}
.img-preview {
  width: 420px;
  height: 675px;
  float: left;
  margin-left: 10px;
}
</style>
