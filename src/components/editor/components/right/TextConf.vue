<template>
  <section class="font-config">
    <BTabs v-model="activeName" type="card" class="tabs">
      <div name="文本">
        <div class="base-config">
          <div class="flex mb20">
            <BSelect
              class="flex1"
              :value="currentLayer.originFontId"
              placeholder="字体"
              valueKey="id"
              textKey="name"
              :render="fontRender"
              :dataSource="fontList"
              @change="fontChange"
            />

            <BColorPicker
              v-model="currentLayer.color"
              @change="modifyAttr('color', currentLayer.color)"
              :style="{
                height: `36px`,
                width: `52px`,
                marginLeft: `10px`,
              }"
            />
          </div>
          <div class="flex mb20">
            <BSelect class="flex1" v-model="currentLayer.fontSize" placeholder="字号" :dataSource="fontSizes" valueKey="value" textKey="label" />

            <BButtonGroup class="flex" style="margin-left: 10px;">
              <BButton type="outline" @click="modifyFontSize('add')">A+</BButton>
              <BButton type="outline" @click="modifyFontSize('sub')">A-</BButton>
            </BButtonGroup>
          </div>

          <!-- 文字形状及修饰 -->
          <BButtonGroup class="flex mb20">
            <BButton type="outline" @click="modifyAttr('fontWeight', currentLayer.fontWeight === 'bold' ? 'normal' : 'bold')">
              <i class="iconfont iconic_jiacu" :class="currentLayer.fontWeight === 'bold' && 'active'"></i>
            </BButton>

            <BButton type="outline" @click="modifyAttr('fontStyle', currentLayer.fontStyle === 'italic' ? 'normal' : 'italic')">
              <i class="iconfont iconic_qingxie" :class="currentLayer.fontStyle === 'italic' && 'active'"></i>
            </BButton>

            <BButton type="outline" @click="modifyAttr('textDecoration', currentLayer.textDecoration === 'underline' ? 'none' : 'underline')">
              <i class="iconfont iconic_xiahuaxian" :class="currentLayer.textDecoration === 'underline' && 'active'"></i>
            </BButton>
          </BButtonGroup>

          <sliderInput :sliderObj="opacity" @val="(res) => modifyAttr('opacity', res / 100)" />
        </div>

        <BCollapse v-model="configuration" accordion>
          <BCollapseItem title="对齐" name="alight" activated>
            <div class="item">
              <BButtonGroup class="flex mb20">
                <BButton type="outline" @click="modifyAttr('textAlign', 'left')">
                  <i class="iconfont iconic_zuoduiqi" :class="currentLayer.textAlign === 'left' && 'active'"></i>
                </BButton>
                <BButton type="outline" @click="modifyAttr('textAlign', 'center')">
                  <i class="iconfont iconic_juzhongduiqi" :class="currentLayer.textAlign === 'center' && 'active'"></i>
                </BButton>
                <BButton type="outline" @click="modifyAttr('textAlign', 'right')">
                  <i class="iconfont iconic_youduiqi-42" :class="currentLayer.textAlign === 'right' && 'active'"></i>
                </BButton>
              </BButtonGroup>

              <!-- 行间距 -->
              <sliderInput class="mb20" :sliderObj="lineHeight" @val="(res) => modifyAttr('lineHeight', res)" />

              <!-- 字间距 -->
              <sliderInput :sliderObj="letterSpacing" @val="(res) => modifyAttr('letterSpacing', currentLayer.fontSize * (res / 100))" />
            </div>
          </BCollapseItem>
          <locationSize />
        </BCollapse>
      </div>
    </BTabs>
  </section>
</template>

<script>
import sliderInput from './components/sliderInput';
import locationSize from './components/locationSize';
import { getAllFont } from '../../services/font';
// import { debounce } from '../../assets/js/utils';

const fontSizeList = [12, 16, 20, 24, 28, 32, 36, 40, 48, 60, 72, 96, 120, 144, 168, 192, 216, 240, 288, 336, 384, 448, 512];

const fontSizes = fontSizeList.map((size) => {
  return {
    value: size,
    label: `${size}px`,
  };
});

export default {
  inject: ['editor'],
  data() {
    return {
      a: 0,
      activeName: '1',
      sliderVal: 100,
      configuration: '1',
      fontSizes,
      value: '',
      sizeval: '12',
      opacity: {
        role: 'opacity',
        title: '不透明',
        units: '%',
        defaultVal: 100,
        min: 0,
        max: 100,
      },
      lineHeight: {
        role: 'lineHeight',
        title: '行间距',
        units: '倍',
        min: 0,
        max: 4,
        step: 0.1,
        defaultVal: 0,
      },
      letterSpacing: {
        role: 'letterSpacing',
        title: '字间距',
        max: 200,
        units: '%',
        defaultVal: 0,
      },
      fontList: [],
    };
  },
  components: {
    sliderInput,
    locationSize,
  },
  computed: {
    currentLayer() {
      return this.editor.currentLayer;
    },
  },
  mounted() {
    this.lineHeight.defaultVal = this.currentLayer.lineHeight * 1;
    this.opacity.defaultVal = this.currentLayer.opacity * 100;
    this.letterSpacing.defaultVal = this.currentLayer.letterSpacing * 1;
    // 请求字体数据
    getAllFont().then((res) => {
      console.log('res', res);
      this.fontList = res;
    });
  },
  methods: {
    fontRender(h, ctx) {
      this.loadFont(ctx.data);
      return <div style={{ fontFamily: `'${ctx.data.name}'` }}>{ctx.data.name}</div>;
    },
    // 当修改字体,添加新的style标签
    fontChange(val, row) {
      const name = row.name.split('.')[0];
      this.editor.saveHistory();
      Object.assign(this.currentLayer, {
        fontFamily: name,
        formatType: row.type,
        originFontId: row.id,
      });
    },
    //修改文字大小
    modifyFontSize(par) {
      const _this = this;
      var index = 0;
      _this.sizes.forEach((element, i) => {
        if (element.value === _this.currentLayer.fontSize) {
          index = i;
        }
      });
      if (par === 'add') {
        if (index < _this.sizes.length - 1) {
          _this.currentLayer.fontSize = _this.sizes[index + 1].value;
        }
      } else {
        if (index > 0) {
          _this.currentLayer.fontSize = _this.sizes[index - 1].value;
        }
      }
      this.modifyAttr('fontSize', this.currentLayer.fontSize);
    },
    // 汇集数据
    modifyAttr(name, val) {
      console.log('name', name);
      console.log('val', val);
      this.editor.handleModifyLayer(name, val);
      // this.currentLayer[name] = val
    },
    /**
     * 下拉框隐藏时 横向滚动复原
     */
    handleVisibleChange(e) {
      if (!e && window.scrollX > 0) window.scrollTo(0, window.scrollY);
    },
    /**
     * 加载字体
     */
    loadFont(font) {
      const existDom = document.querySelector(`head style[data-id="${font.id}"]`);

      let html = `@font-face {
        font-family: '${font.name}';
        src: url(${font.url});
        font-weight: normal;
        font-style: normal;
      }`;

      if (existDom) {
        existDom.innerHTML = html;
        return;
      }

      let style = document.createElement('style');
      let body = document.querySelector('head');
      body.append(style);
      style.innerHTML = html;
      style.setAttribute('data-id', font.id);
    },
  },
};
</script>

<style lang="less" scoped>
.font-config {
  height: 100%;
  .iconfont.active {
    color: @color-main;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      flex: 1;
    }

    .flex1 {
      flex: 1;
    }
  }

  .base-config {
    padding: 20px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .item {
    padding: 20px;
  }
}
</style>
