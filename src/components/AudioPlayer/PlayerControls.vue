<template>
  <div id="player-controls">
    <div class="player-controls-left">
      <button @click="randomPlay">
        <img v-if="random === 'on'"  src="../../assets/player-controls-random-active.svg" alt="">
        <img v-else src="../../assets/player-controls-random.svg" alt="">
      </button>
      <button @click="prev">
        <img src="../../assets/player-controls-prev.svg" alt="">
      </button>
    </div>
    <div class="player-controls-center">
      <button
        class="player-controls-center-btn"
        title="播放/暂停"
        @click="playChange"
        :disabled="loading"
      >
        <!-- 开始 -->
        <img v-if="playStatus" src="../../assets/player-controls-play.svg" alt="">
        <!-- 暂停 -->
        <img v-else src="../../assets/player-controls-pause.svg" alt="">
      </button>
    </div>
    <div class="player-controls-right">
      <!-- 按钮 下一首 -->
      <button @click="next">
        <img src="../../assets/player-controls-next.svg" alt="">
      </button>
      <!-- 按钮 播放模式 -->
      <button
        @click="audioPlayTypeSwitch"
        :class="`control-button-${audioPlayType}`"
      >
        <!-- 默认 -->
        <img v-if="audioPlayType === 'common'" src="../../assets/player-controls-model-common.svg" alt="">
        <!-- 列表循环  -->
        <img v-else-if="audioPlayType === 'list'" src="../../assets/player-controls-model-list.svg" alt="">
        <!-- 单曲循环 -->
        <img v-else src="../../assets/player-controls-model-repeat.svg" alt="">
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PlayerControls',

  props: {
    // 歌曲加载状态
    loading: Boolean,

    // 音乐是否正在播放
    playStatus: Boolean
  },

  data () {
    return {
      // 随机播放开关
      random: localStorage.getItem('random') || 'off',

      // 播放模式 如: repeat(单曲循环), common(不), list(列表播放)
      audioPlayType: localStorage.getItem('audioPlayType') || 'common'
    }
  },

  methods: {
    ...mapMutations(['setTips']),

    // 开始或暂停播放
    playChange () {
      this.$emit('play-change')
    },

    // 切换播放模式
    audioPlayTypeSwitch () {
      if (this.audioPlayType === 'common') {
        this.audioPlayType = 'list'
        this.setTips('列表循环播放')
      } else if (this.audioPlayType === 'list') {
        this.audioPlayType = 'repeat'
        this.setTips('单曲播放')
      } else if (this.audioPlayType === 'repeat') {
        this.audioPlayType = 'common'
        this.setTips('列表播放')
      }
      this.setLoop()
    },

    // 设置是否循环播放
    setLoop () {
      const loop = this.audioPlayType === 'repeat' ? 'on' : 'off'
      localStorage.setItem('audioPlayType', this.audioPlayType)
      localStorage.setItem('loop', loop)
      this.$emit('loop-change', loop)
    },

    // 切换随机播放
    randomPlay () {
      this.random = this.random === 'on' ? 'off' : 'on'
      this.setTips(this.random === 'on' ? '开启随机播放' : '关闭随机播放')
      localStorage.setItem('random', this.random)
    },

    // 下一首
    next () {
      this.$emit('song-change', 'next')
    },

    // 上一首
    prev () {
      this.$emit('song-change', 'prev')
    }
  }
}
</script>

<style lang="less">

// 控制按钮
#player-controls {
  display: flex;
  width: 40%;
  justify-content: center;

  button {
    width: 32px;
    height: 32px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 6px;
    cursor: pointer;
  }

  .player-controls-left,
  .player-controls-center,
  .player-controls-right{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player-controls-center {
    margin: 0 12px;
    .player-controls-center-btn{
      border-radius: 50%;
      background: rgba(255, 255, 255, 1);
      transition: all 0.2s;
      >svg{
        fill: #141414;
      }
    }

    //&:hover {
    //  transform: translate3d(0, 0, 0) scale(1.08);
    //}
  }

  .player-controls-right {
    position: relative;
    // 列表播放
    .control-button-list {
      &,
      * {
        color: rgba(240, 0, 0, 0.8);
      }

      &::after {
        content: "";
        background-color: currentColor;
        border-radius: 50%;
        bottom: 0;
        display: block;
        height: 4px;
        position: absolute;
        width: 4px;
      }
    }

    // 单曲循环播放
    .control-button-repeat {
      &,
      * {
        color: rgba(240, 0, 0, 0.8);
      }

      &::after {
        content: "";
        background-color: currentColor;
        border-radius: 50%;
        bottom: 0;
        display: block;
        height: 4px;
        position: absolute;
        width: 4px;
      }
    }
  }
}

</style>
