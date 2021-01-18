<template>
  <div>
    <BModal v-model="showModal" :closeOnMask="false" :showClose="!importing" @close="$emit('close')">
      <!-- 文件选择 -->
      <div v-show="!importing" class="import-modal">
        <h2 class="title">导入PSD</h2>
        <BUpload class="btn-import" accept=".psd" :limit="55" toUrl @change="handleFileChange">
          <div>+<span>导入PSD源文件</span></div>
        </BUpload>
        <div class="option">
          <BCheckbox v-model="textToImage" label="文本转换为图片" />
          <div class="desc">*非图片文本仅保留字号、颜色, 导入后请重新调整样式</div>
        </div>

        <div class="notice">
          <div class="title">上传须知</div>
          <pre class="upload-hint-message">
  1.建议导入标准页面PSD尺寸为810*1436px,主内容区域为750*1206px.
  2.建议导入长页面PSD尺寸为750*N(1809≤N≤12060).
  3.必须使用RGB/8通道模式,为保证图片质量,建议导入前尽量将效果合并或转为智能对象至图层中.</pre>
        </div>
      </div>

      <!-- 导入进度 -->
      <div v-show="importing" class="importing">
        <div class="import-progress">
          <div class="icon icon-psdfile">
            <div class="corner"></div>
            <div class="type-psd">
              PSD
            </div>
          </div>

          <div class="loading-animation"></div>

          <div class="icon icon-app">
            <div class="corner"></div>
            <div class="type-app"></div>
          </div>
        </div>

        <!-- 百分比 -->
        <div class="percent">{{ currentLayerIndex }}/{{ totalLayers }}</div>

        <div style="font-weight: bold; margin-top: 30px;">
          正在导入,请稍后
        </div>
      </div>
    </BModal>
  </div>
</template>

<script>
import { creator } from '../../factory';
import { dataURLtoFile } from '../../assets/js/utils';
import { uploadResource } from '../../services/file';

let PSD = null;

export default {
  inject: ['editor'],
  data() {
    return {
      showModal: false,
      textToImage: true, // 文字转图片
      scale: 1, // 设计图缩放比例
      importing: false, // 是否正在导入
      totalLayers: 0, // psd文件总图层数
      currentLayerIndex: 0, // 当前导入的图层
    };
  },
  mounted() {
    this.showModal = true;
    require.ensure([], function() {
      PSD = require('../../assets/js/psd.min.js');
    });
  },
  methods: {
    async handleFileChange(e) {
      const psdFile = await PSD.fromURL(e);
      const docTree = psdFile.tree();

      const psdDoc = docTree.export().document;

      const { width } = psdDoc;

      this.scale = width / 375;

      this.editor.saveHistory();

      this.parsingPSD(docTree, psdFile);
    },
    /**
     * 解析psd json对象
     */
    async parsingPSD(docTree, psdFile) {
      this.importing = true;
      try {
        const childrens = docTree.descendants();
        childrens.reverse();
        this.totalLayers = childrens.length;

        const layers = [];
        let id = 1;

        for (let layer of childrens) {
          this.currentLayerIndex++;
          const layerExport = layer.export();
          console.log('export', layer.export());
          const { type, visible, text, left, top, width, height, opacity } = layerExport;

          if (type === 'group' || !visible) {
            console.log('groupinfo', layer.descendants());
            continue;
          }

          const layerInfo = {
            id,
            left: left / this.scale,
            top: top / this.scale,
            width: width / this.scale,
            height: height / this.scale,
            opacity: opacity * 100,
          };

          // 如果是文本 且没有勾选文本转图片，则解析文本
          if (text && !this.textToImage) {
            const obj = this.fontParsing(layerExport);
            layers.push(Object.assign(obj, layerInfo));
          } else {
            const png = layer.toPng();
            const file = dataURLtoFile(png.src, `psdImport${layer.name}.png`);
            const formData = new FormData();
            formData.append('file', file);
            const imgUrl = await uploadResource(formData);

            const imgLayer = creator('Image');
            layers.push(
              Object.assign(imgLayer, layerInfo, {
                img: imgUrl,
              })
            );
          }

          id++;

          console.log('layers', layers);
        }

        this.editor.currentPage.layers.push(...layers);

        this.importing = false;
        this.$emit('close');
      } catch (e) {
        this.handleError(docTree, psdFile);
      }
    },
    /**
     * psd中文本对象解析
     */
    fontParsing(layer) {
      const { transform, font, value } = layer.text;
      const { xy, xx } = transform;

      let rotate = Math.round(Math.atan(xy / xx) * (180 / Math.PI));

      if (xx < 0) {
        rotate += 180;
      } else if (rotate < 0) {
        rotate += 360;
      }

      const {
        alignment,
        colors,
        // lengthArray,
        sizes,
        // styles,
        // textDecoration,
        weights,
      } = font;

      // let subIndex = 0;
      // let content = '';

      let textObj = creator('Text');

      // lengthArray.forEach((len, index) => {

      //   const psdSize = Math.round((sizes[index] * yy) * 100) * 0.01;
      //   const color = `color: rgba(${colors[index]});`;
      //   const fontSize = `font-size: ${psdSize / this.scale}px;`;
      //   const fontWeight = `font-weight: ${weights[index]}`;

      //   content += `<span style="${color + fontSize + fontWeight}">${value.substr(subIndex, len)}</span>`

      //   subIndex += len;
      // })

      Object.assign(textObj, {
        content: value,
        textAlign: alignment[0],
        rotate,
        fontSize: +(sizes[0] / this.scale).toFixed(0),
        color: colors[0],
        fontWeight: weights[0],
      });

      return textObj;
    },
    /**
     * 处理图层出错时 直接把整个psd转换成图片
     */
    async handleError(docTree, psdFile) {
      //
      const layers = [];
      // let id = 1;

      const psdDoc = docTree.export().document;

      const { width, height } = psdDoc;
      const layerInfo = {
        id: 1,
        left: 0,
        top: 0,
        width: width / this.scale,
        height: height / this.scale,
      };
      const img = psdFile.image.toPng();

      const file = dataURLtoFile(img.src, `psdImport.png`);
      const formData = new FormData();
      formData.append('file', file);
      const imgUrl = await uploadResource(formData);

      const imgLayer = creator('Image');
      layers.push(
        Object.assign(imgLayer, layerInfo, {
          img: imgUrl,
        })
      );

      this.editor.currentPage.layers.push(...layers);

      this.importing = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="less">
.import-modal {
  width: 750px;
  height: 420px;
  padding: 40px 30px;
  color: #3e3e3e;
  .title {
    font-size: 22px;
    line-height: 1;
    margin: 0;
  }
  .btn-import {
    margin-top: 20px;
    width: 100%;
    height: 132px;
    line-height: 132px;
    text-align: center;
    border: 1px solid #cbcbcb;
    background: #f6f7fb;
    font-size: 30px;
    transition: all 0.2s ease-in-out;
    > div {
      > span {
        margin-left: 21px;
        font-size: 20px;
      }
    }

    &:hover {
      color: @color-main;
      border: 1px solid @color-main;
    }
  }

  .option {
    margin-top: 20px;
    line-height: 14px;
    .desc {
      float: right;
      font-size: 12px;
      color: @color-main;
      margin-top: 2px;
    }
  }

  .notice {
    .title {
      font-size: 14px;
      line-height: 20px;
      margin: 20px 0 7px;
      font-weight: bold;
    }
    .upload-hint-message {
      color: #8c8c8c;
      font-size: 14px;
      line-height: 1.8;
    }
  }
}

.importing {
  width: 370px;
  height: 300px;
  padding: 60px 0;
  text-align: center;
  font-size: 14px;
  color: @color-main;
  .import-progress {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .icon {
      background-color: @color-main;
      border-radius: 4px;
      position: relative;
      width: 58px;
      height: 70px;
      .corner {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 0;
        top: 0;
        border-bottom-left-radius: 4px;
        background-color: rgba(0, 0, 0, 0.1);
        overflow: hidden;
        &:before {
          content: '';
          display: block;
          width: 0;
          height: 0;
          border: 14px solid transparent;
          border-left-color: #fff;
          position: absolute;
          right: -14px;
          top: -14px;
          transform: rotate(-45deg);
        }
        &:after {
          content: '';
          display: block;
          width: 0;
          height: 0;
          border: 14px solid transparent;
          border-right-color: #fff;
          position: absolute;
          left: -14px;
          bottom: -14px;
          transform: rotate(-45deg);
        }
      }
    }
    .icon-psdfile {
      .type-psd {
        position: absolute;
        left: -7px;
        bottom: 14px;
        width: 50px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #fef0e6;
        border-radius: 4px;
        color: @color-main;
        letter-spacing: 4px;
        font-size: 14px;
      }
    }

    .loading-animation {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: relative;
      animation: loadingAnimation 1.5s linear infinite;
      background-color: #8c8c8c;
      animation-delay: 1.5s;
      &:after,
      &:before {
        content: '';
        float: left;
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
      }
      &:before {
        left: -16px;
        animation: loadingAnimation 1.5s linear infinite;
        background-color: #d8d8d8;
        animation-delay: 1s;
      }
      &:after {
        right: -16px;
        background-color: #f6f7fb;
        animation: loadingAnimation 1.5s linear infinite;
        animation-delay: 0.5s;
      }
    }
  }

  .percent {
    margin-top: 40px;
  }
}

@keyframes loadingAnimation {
  0% {
    background-color: #f6f7fb;
  }
  25% {
    background-color: #d8d8d8;
  }
  50% {
    background-color: #8c8c8c;
  }
  75% {
    background-color: #d8d8d8;
  }
  100% {
    background-color: #f6f7fb;
  }
}
</style>
