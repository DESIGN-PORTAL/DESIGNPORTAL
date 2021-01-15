<template>
  <div ref="select" class="component-select" :class="activated && 'component-select-activated'" @click="handleClick">
    <!-- 选中的内容 -->
    <div class="text" v-if="value">
      <template v-if="render && choosedItem">
        <RenderFunc :data="choosedItem" :render="render" />
      </template>
      <template v-else>
        {{ showText }}
      </template>
    </div>

    <!-- placeholder -->
    <div class="text placeholder" v-else>
      {{ placeholder }}
    </div>

    <!-- 下拉列表 -->
    <ul class="list-wrapper" :class="reverse && 'list-wrapper-reverse'" ref="list">
      <li v-for="(item, index) in dataList" :key="index" @click="handleClickItem(item, $event)">
        <template v-if="render">
          <RenderFunc :data="item" :render="render" :index="index" />
        </template>
        <template v-else>
          {{ dataType === 'object' ? item[textKey] : item }}
        </template>
      </li>
    </ul>
    <i class="arrow" :class="activated ? 'arrow-up' : 'arrow-down'" />

    <!-- 隐藏域 -->
    <input type="hidden" :name="name" :value="value" />
  </div>
</template>

<script>
import RenderFunc from './render';

export default {
  components: {
    RenderFunc,
  },
  props: {
    value: {
      type: [String, Object, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '全部',
    },
    /**
     * 显示文本字段
     */
    textKey: {
      type: String,
      default: 'text',
    },
    /**
     * 值字段
     */
    valueKey: {
      type: String,
      default: 'value',
    },
    /**
     * 数据源
     */
    dataSource: {
      type: [Array, Object],
      default: () => [],
    },
    render: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      activated: false,
      dataType: 'object',
      reverse: false, // 反向显示
      choosedItem: null,
    };
  },
  computed: {
    showText() {
      if (this.dataType !== 'object') return this.value || this.placeholder;

      let text = '';
      this.dataSource.forEach((item) => {
        if (item[this.valueKey] === this.value) {
          text = item[this.textKey];
        }
      });
      return text || this.value || this.placeholder;
    },
    dataList() {
      const data = this.dataSource;
      if (this.reverse) {
        return data.reverse();
      }
      return data;
    },
  },
  created() {
    if (!this.dataSource.length) return;
    const data = this.dataSource[0];
    this.dataType = typeof data;

    if (this.value) {
      for (let item of this.dataSource) {
        if (item[this.valueKey] === this.value) {
          this.choosedItem = item;
          break;
        }
      }
    }
  },
  mounted() {
    document.body.addEventListener('click', this.handleDocumentClick);
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.handleDocumentClick);
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.activated) return (this.activated = false);

      const rect = this.$refs.select.getBoundingClientRect();
      if (rect.bottom + rect.height * 2 + 40 > window.innerHeight) this.reverse = true;
      else this.reverse = false;

      this.activated = true;
    },
    /**
     * 点击下拉选项
     */
    handleClickItem(item, e) {
      e.preventDefault();
      e.stopPropagation();

      this.activated = false;
      this.choosedItem = item;
      this.$emit('input', this.dataType === 'object' ? item[this.valueKey] : item);

      console.log('this.dataType', this.dataType);
      this.$emit('change', this.dataType === 'object' ? item[this.valueKey] : item, item);
    },
    /**
     * 点击下拉框外的元素 收起下拉框
     */
    handleDocumentClick() {
      this.activated = false;
    },
  },
};
</script>

<style lang="less">
.component-select {
  display: inline-block;
  width: auto;
  min-width: 32px;
  height: 36px;
  line-height: 36px;
  position: relative;
  border-radius: 4px;
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s ease-in-out;
  padding: 0 32px 0 8px;
  background-color: #ffffff;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(@color-main, 0.8);
    .arrow {
      &::after {
        border-right-color: @color-main;
        border-bottom-color: @color-main;
      }
    }
  }

  &:focus {
    border: 1px solid @color-main;
    box-shadow: 0 0 6px 0 rgba(@color-main, 0.5);
  }

  .text {
    font-size: 14px;
  }

  .placeholder {
    color: #999;
  }

  .arrow {
    position: absolute;
    right: 9px;
    top: 50%;
    transform-origin: center center;
    transform: translateY(-60%);
    pointer-events: none;
    transition: all 0.3s ease-in-out;
    transform-origin: 5px 5px;
    &::after {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border: 2px solid transparent;
      border-right-color: #999;
      border-bottom-color: #999;
      transform: scale(0.8);
    }
  }

  .arrow-down {
    transform: translateY(-60%) rotate(45deg);
  }

  .arrow-up {
    transform: translateY(-40%) rotate(-135deg);
  }

  .list-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    max-height: 500px;
    width: 100%;
    background-color: #ffffff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    height: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    z-index: 10;
    transform: translateY(1px);
    li {
      height: 100%;
      list-style: none;
      padding: 0 8px;
      &:hover {
        background-color: #f6f7fb;
      }
    }
  }
  .list-wrapper-reverse {
    transform: translateY(-100%);
    top: -1px;
  }
}

.component-select-activated {
  border: 1px solid @color-main;
  box-shadow: 0 0 6px 0 rgba(@color-main, 0.5);
  .list-wrapper {
    height: auto;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  }
  .arrow {
    &::after {
      border-right-color: @color-main;
      border-bottom-color: @color-main;
    }
  }
  // .arrow {
  //   transform: translateY(-50%) rotate(-90deg);
  // }
}
</style>
