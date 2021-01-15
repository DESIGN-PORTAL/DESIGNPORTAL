<template>
  <div class="component-tabs">
    <ul class="tab-navs">
      <li
        class="tab-nav"
        v-for="(nav, index) in navs"
        :key="nav.key"
        :class="currentNav === nav.key && 'tab-nav-actived'"
        @click="handleClickNav($event, nav, index)"
      >
        {{ nav.title }}
      </li>
    </ul>
    <div class="tab-panels">
      <div class="panels-wrapper" :style="panelsWrapperStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 默认tab
     */
    defaultActiveKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      navs: [],
      currentNav: this.defaultActiveKey,
      currentNavIndex: 0,
    };
  },
  computed: {
    panelsWrapperStyle() {
      return {
        transform: `translateX(-${this.currentNavIndex * 100}%)`,
      };
    },
  },
  mounted() {
    this.analyzeTabs();
  },
  methods: {
    /**
     * 解析tabs
     */
    analyzeTabs() {
      this.$slots.default.forEach((node) => {
        if (!node.tag || !node.elm) return;
        this.navs.push({
          key: node.key,
          title: node.elm.getAttribute('name'),
        });

        // 初始化index
        if (node.key === this.currentNav) this.currentNavIndex = this.navs.length - 1;
      });

      if (!this.currentNav && this.navs.length) this.currentNav = this.navs[0].key;
    },
    handleClickNav(e, nav, index) {
      e.preventDefault();
      e.stopPropagation();
      this.currentNav = nav.key;
      this.currentNavIndex = index;
      this.$emit('change', nav.key, index);
    },
  },
};
</script>

<style lang="less">
.component-tabs {
  width: 100%;
  height: 100%;
  position: relative;
  .tab-navs {
    height: 40px;
    line-height: 40px;
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: left;
    background: #f6f7fb;
    color: #3e3e3e;
    font-size: 14px;
    font-weight: bold;
    .tab-nav {
      display: inline-block;
      width: auto;
      list-style: none;
      text-align: center;
      padding: 0 20px;
      cursor: pointer;
      &.tab-nav-actived {
        background-color: #ffffff;
      }
    }
  }
  .tab-panels {
    width: 100%;
    height: calc(100% - 40px);
    position: relative;
    overflow: hidden;
    .panels-wrapper {
      width: 100%;
      height: 100%;
      transition: transform 0.2s ease-in-out;
      display: flex;
      flex-direction: row;
      > div {
        width: 100%;
        height: 100%;
        flex-shrink: 0;
        box-sizing: border-box;
      }
    }
  }
}
</style>
