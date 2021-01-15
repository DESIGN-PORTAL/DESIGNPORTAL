<template>
  <div class="layout-home">
    <div class="menu-wrapper">
      <a
        class="menu"
        v-for="menu in menus"
        :key="menu.url"
        :class="$route.path.indexOf(menu.url) > -1 && 'actived'"
        :href="`#${menu.url}`"
      >
        {{ menu.title }}
      </a>
    </div>
    <div class="pages-wrapper">
      <header class="page-header">
        <!-- <BButton style="height: 50px; border-radius: 25px;font-size: 20px" type="primary" shape="round">创建新作品</BButton> -->
        <!-- <iframe src="https://ghbtns.com/github-btn.html?user=eggjs&repo=egg&type=star&count=true" frameborder="0"></iframe> -->
      </header>

      <main>
        <ul class="breadcrumb">
          <li></li>
        </ul>

        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMenu: null,
      menus: [
        {
          url: '/manage/project',
          title: '作品列表',
        },
        {
          url: '/manage/font',
          title: '字体列表',
        },
        // {
        //   url: '/manage/picture',
        //   title: '图片素材',
        // },
        {
          url: '/manage/music',
          title: '音乐素材',
        },
        {
          url: '/manage/about',
          title: '关于',
        },
      ],
    };
  },
  mounted() {
    this.currentMenu = this.$route.path;
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

ul,
li {
  list-style: none;
  margin: 0px;
  padding: 0px;
}

a {
  text-decoration: none;
}

.layout-home {
  width: 100vw;
  height: 100vh;
  background: #f6f7fb;
  .menu-wrapper {
    float: left;
    width: 240px;
    height: 100%;
    border-right: 1px solid #f4f4f4;
    background-color: @color-main;
    padding-top: 100px;
    color: #ffffff;
    padding: 100px 20px 40px;
    .menu {
      display: block;
      position: relative;
      width: 100%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      cursor: pointer;
      transition: all 0.1s linear;
      font-weight: bold;
      font-size: 16px;
      box-sizing: border-box;
      user-select: none;
      color: #ffffff;
      // overflow: hidden;
      &:not(:first-child) {
        margin-top: 20px;
      }
      &::before,
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border: 2px solid #fff;
        transition: all 0.3s linear;
        box-sizing: border-box;
      }

      .iconfont {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 0;
        display: block;
        width: 0;
        height: 0;
        overflow: hidden;
        // transform: translate(30px, -30px);
        transition: all 0.1s linear;
      }

      &:hover,
      &.actived {
        font-size: 17px;
        color: #9ce9fb;
        &::before {
          transform: translate(-2px, 2px);
          border-color: #9ce9fb;
          border-width: 3px;
        }
        &::after {
          transform: translate(2px, -2px);
          border-color: #9ce9fb;
          border-width: 3px;
        }

        .iconfont {
          width: 40px;
          height: 40px;
          font-size: 25px;
          transform: translate(-10px, 0);
        }
      }
    }
  }

  .pages-wrapper {
    overflow: hidden;
    > header {
      height: 70px;
      line-height: 70px;
      box-shadow: 0 0 5px 0 #ccc;
      background-color: #ffffff;
      text-align: right;
    }

    > main {
      // box-shadow: 0 0 3px 0 #ccc;
      // background-color: #ffffff;
      padding: 24px;
      height: calc(100vh - 70px);
      overflow-y: auto;
    }
  }
}
</style>
