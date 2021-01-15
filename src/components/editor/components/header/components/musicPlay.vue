<template>
  <section class="musicPlay">
    <div class="palyBox" @click="play" id="play" slot="reference">
      <i class="iconfont" :class="music.isPlay ? 'iconic_zanting' : 'iconic_bofang'"> </i>
    </div>
    <main class="title">
      <div class="flex">
        <h4>
          <div>{{ musicItemVal.name }}</div>
          <i class="pic"></i>
        </h4>
        <p>{{ formatTime(music.currentTime) }}/{{ formatTime(music.maxTime) }}</p>
      </div>
      <BSlider
        @change="changeTime"
        :tipFormat="formatTime"
        :max="music.maxTime"
        v-model="music.currentTime"
        style="width: 100%; margin-top: 10px;"
        input-size="mini"
      />
    </main>
    <div @click="sub" class="sub">确定</div>
    <audio ref="music" loop autoplay>
      <source :src="musicItemVal.url" type="audio/mpeg" />
    </audio>
  </section>
</template>
<script>
export default {
  inject: ['editor'],
  props: {
    musicItemVal: {
      type: Object,
      default: null,
    },
    playedMusic: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      music: {
        isPlay: true,
        currentTime: 0,
        maxTime: 0,
        volume: 100,
      },
    };
  },
  watch: {
    playedMusic(val) {
      if (this.$refs.music) {
        if (val != null) {
          this.$refs.music.load();
          this.$refs.music.play();
        } else {
          this.$refs.music.pause();
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      console.log('this.$refs.music', this.$refs.music);
      const musicEle = this.$refs.music;
      musicEle.addEventListener('timeupdate', this.listenMusic);
      musicEle.addEventListener('loadedmetadata', () => {
        this.music.maxTime = +musicEle.duration.toFixed(0);
      });
    });
  },
  methods: {
    /**
     * 确定选择音乐
     */
    sub() {
      this.editor.saveHistoryWithType('music');

      Object.assign(this.editor.data.music, {
        url: this.musicItemVal.url,
        name: this.musicItemVal.name,
      });

      // 确定后关闭Dialog
      this.$emit('dialog', false);
    },
    listenMusic() {
      this.music.currentTime = this.$refs.music.currentTime;
    },
    play() {
      if (this.$refs.music.paused) {
        this.$emit('playId', this.musicItemVal.id);
        this.$refs.music.play();
      } else {
        this.$emit('playId', null);
        this.$refs.music.pause();
      }
      this.music.isPlay = !this.$refs.music.paused;
    },
    changeTime(time) {
      this.$refs.music.currentTime = time;
    },
    formatTime(time) {
      let it = parseInt(time);
      let m = parseInt(it / 60);
      let s = parseInt(it % 60);
      return (m < 10 ? '0' : '') + parseInt(it / 60) + ':' + (s < 10 ? '0' : '') + parseInt(it % 60);
    },
  },
};
</script>
<style lang="less" scoped>
.flex {
  display: flex;
}
.musicPlay {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 66px;
  background: #ffffff;
  box-shadow: 0px 2px 9px 0px rgba(145, 144, 144, 0.13);
  border-radius: 0px 0px 4px 4px;
  p {
    padding: 0px;
    margin: 0px;
  }
  .palyBox {
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 100%;
    border: 2px solid @color-main;
    color: @color-main;
    line-height: 40px;
    margin-left: 40px;
    text-align: center;
    cursor: pointer;
  }
  .title {
    flex: 1;
    margin: 0px 20px;
    .pic {
      width: 18px;
      height: 20px;
      background: url('../../../assets/img/music2.png');
      background-size: 100%;
      margin-left: 10px;
    }
    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h4 {
        margin: 0px;
        font-size: 14px;
        color: #3e3e3e;

        display: flex;
        flex: 1;
        & > div {
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //用省略号显示
          white-space: nowrap; //不换行
        }
      }
      p {
        font-size: 12px;
        color: #707070;
      }
    }
  }
  .sub {
    background: @color-main;
    border-radius: 0px 0px 4px 0px;
    font-size: 14px;
    font-weight: 400;
    color: #f6f7fb;
    width: 100px;
    line-height: 66px;
    cursor: pointer;
    text-align: center;
    transition: background 0.2s linear;
    &:hover {
      background: rgba(@color-main, 0.7);
    }
  }
}
</style>
