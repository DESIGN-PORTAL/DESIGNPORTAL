<template>
  <BModal v-model="musicState" @close="beforeClose">
    <div class="music-modal">
      <div class="panel-left">
        <div class="title">
          音乐素材
        </div>

        <ul>
          <li><i class="iconfont iconic_yinle"></i>音乐库</li>
        </ul>
      </div>
      <div class="panel-right">
        <BInput
          v-if="param.jurisdictionType === '2'"
          v-model="param.name"
          placeholder="搜索一下"
          @keyup.enter.native="onSubmit"
          style="width: 370px;"
        >
          <i class="iconfont iconicon_sousuo" slot="suffix" @click="onSubmit"> </i>
        </BInput>

        <ul class="list" v-if="musicList.length > 0">
          <li v-for="(item, index) in musicList" :key="index" @click="musicItemClick(item)">
            <!-- iconic_zanting -->
            <i class="left"><i class="iconfont" :class="item.id === playedMusic ? 'iconic_zanting' : 'iconic_bofang'"></i></i>
            <div>
              <h4>{{ item.name }}</h4>
              <p>{{ item.duration }}</p>
            </div>
            <span class="right"></span>
          </li>
        </ul>
      </div>
      <musicPlay
        v-if="musicItem"
        class="musicPlay"
        :musicItemVal="musicItem"
        :playedMusic="playedMusic"
        @playId="playIdFun"
        @dialog="beforeClose"
      />
    </div>
  </BModal>
</template>
<script>
import musicPlay from './components/musicPlay';
import { getAllMusic } from '../../services/music';

export default {
  data() {
    return {
      musicState: true,
      musicItem: null,
      playDuration: {
        playDuration: '',
      },
      state: '',
      musicList: [],
      param: {
        limit: 100,
        name: '',
        page: 1,
        jurisdictionType: '2',
      },
      playedMusic: null,
    };
  },
  components: {
    musicPlay,
  },
  computed: {},
  methods: {
    musicItemClick(obj) {
      if (this.playedMusic === obj.id) {
        this.playedMusic = null;
      } else {
        this.playedMusic = obj.id;
      }
      this.musicItem = obj;
    },
    tabsChange(e) {
      if (e.name === '1') {
        this.param.name = '';
      }
      this.musicListFun();
    },
    playIdFun(id) {
      this.playedMusic = id;
    },
    beforeClose() {
      this.$emit('close', false);
    },

    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    // 请求列表数据
    musicListFun() {
      getAllMusic({
        page: 1,
        limit: 100000,
        name: this.param.name,
      }).then((res) => {
        this.musicList = res.list;
      });
    },
    // 搜索
    onSubmit() {
      console.log(123);
      this.musicListFun();
    },
  },
  mounted() {
    this.musicListFun();
  },
};
</script>
<style lang="less" scoped>
.music-modal {
  width: 750px;
  height: 576px;
  .panel-left {
    float: left;
    width: 200px;
    height: 100%;
    background: #f6f7fb;

    .title {
      height: 90px;
      line-height: 50px;
      font-size: 22px;
      font-weight: bold;
      padding: 20px;
      color: #333;
    }

    li {
      height: 40px;
      line-height: 40px;
      background-color: #ffffff;
      i {
        margin: 0 20px;
      }
    }
  }
  .panel-right {
    overflow: hidden;
    padding: 20px;
    height: 100%;
  }
}
ul,
li {
  list-style: none;
}
p {
  margin: 0px;
  padding: 0px;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.musicPlay {
  position: absolute;
  width: calc(100% - 200px);
  bottom: 0px;
  margin-left: 200px;
}
.list {
  margin-top: 20px;
  li {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #f6f7fb;
    }
    & > .left {
      background: url('../../assets/img/music1.png');
      background-size: 100%;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      text-align: center;
      cursor: pointer;
      i {
        color: #fff;
        line-height: 40px;
      }
    }
    & > div {
      text-align: left;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      h4 {
        font-size: 14px;
        color: #3e3e3e;
        margin: 0px;
      }
      p {
        color: #707070;
      }
    }
    & > .right {
      width: 18px;
      height: 20px;
      background: url('../../assets/img/music2.png');
      background-size: 100%;
    }
  }
}
.musicNull {
  padding: 100px 0px;
  img {
    width: 150px;
  }
  p {
    font-weight: 400;
    color: #8c8c8c;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  button {
    background: rgba(245, 99, 0, 0.05);
    box-shadow: 0px -2px 0px 0px rgba(245, 99, 0, 0.17);
    border-radius: 4px;
    border: 1px solid @color-main;
    color: @color-main;
  }
}
.iconicon_sousuo {
  font-size: 20px;
  color: @color-main;
  line-height: 40px;
  margin-right: 20px;
  cursor: pointer;
}
.iconicon_fushanchu-copy-copy {
  cursor: pointer;
}
</style>
<style lang="less">
* {
  &:focus {
    outline: none;
  }
}
.musicDialog {
  text-align: center;
  .el-dialog {
    border-radius: 4px;
    overflow: hidden;
  }
  .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
    border: 0px;
    margin: 0px;
  }
  .el-dialog__header {
    padding: 0px;
    header {
      display: flex;
      align-items: center;
      & > h3 {
        font-size: 22px;
        color: #3e3e3e;
        line-height: 90px;
        padding-left: 20px;
        margin: 0px;
        background: #f6f7fb;
        width: 200px;
        text-align: left;
      }
      & > .el-input {
        // flex: 1;
        .el-input__inner {
          background: #f6f7fb;
          border-radius: 20px;
        }
        margin-left: 40px;
        width: 240px;
        .el-input--suffix .el-input__inner {
          border: 0px;
          padding-left: 20px;
          width: 240px;
        }
      }
      .updataBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 40px;
        flex: 1;
        h3 {
          font-size: 22px;
          font-weight: 500;
          color: #3e3e3e;
        }
        p {
          flex: 1;
          text-align: left;
          margin-left: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #8c8c8c;
        }
        button {
          background: rgba(245, 99, 0, 0.05);
          box-shadow: 0px -2px 0px 0px rgba(245, 99, 0, 0.17);
          border-radius: 4px;
          border: 1px solid @color-main;
          color: @color-main;
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0px;
    .el-tabs--border-card {
      border: none;
      box-shadow: none;
      background: #f6f7fb;
    }
    .el-tabs--border-card > .el-tabs__content {
      padding: 0px;
      background: #fff;
      min-height: 300px;
    }
  }
  .el-tabs__nav-scroll {
    width: 200px;
  }
  .el-tabs--left.el-tabs--border-card .el-tabs__header.is-left {
    margin-right: 0px;
    border: 0px;
    &:focus {
      outline: none;
    }
  }
  .el-tabs--left .el-tabs__item.is-left {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 40px;
    font-size: 14px;
    color: #3e3e3e;

    .iconfont {
      margin-right: 20px;
      color: #3e3e3e;
    }
  }
}
</style>
