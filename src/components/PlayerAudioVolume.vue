<template>
  <div class="player-volume">
    <div class="btn-row">
      <!-- 播放队列 -->
      <button
        title="播放队列"
        class="play-queue"
        :class="{ 'play-queue-open': $store.state.playQueueStatus }"
        @click="toPlayQueue"
      >
        <img v-if="!$store.state.playQueueStatus" src="../assets/player-controls-queue.svg" alt="">
        <img v-else src="../assets/player-controls-queue-action.svg" alt="">
      </button>
      <!-- 单击切换静音 -->
      <button title="静音" class="switch-volume" @click="switchVolume">
        <!-- 静音icon -->
        <img v-if="volumeProgress === 0" src="../assets/player-controls-volume-muted.svg" alt="">
        <!-- 低音量icon -->
        <img v-else-if="volumeProgress <= 25" src="../assets/player-controls-volume-low.svg" alt="">
        <!-- 中音量icon -->
        <img v-else-if="volumeProgress <= 75" src="../assets/player-controls-volume-medium.svg" alt="">
        <!-- 高音量icon -->
        <img v-else src="../assets/player-controls-volume-high.svg" alt="">
      </button>
    </div>

    <!-- 音量调整滑轨 -->
    <div class="player-volume-progress" ref="player-volume-progress">
      <!-- 滑轨小圆点 -->
      <div
        class="player-volume-point"
        :style="{ transform: `translateX(${getVolumeProgress})` }"
      ></div>
      <!-- 滑轨背景 s -->
      <div class="player-progress-bg">
        <!-- 滑轨前景 s -->
        <div
          class="player-progress-fg"
          :style="{ transform: `translateX(${getVolumeProgress})` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerAudioVolume',

  data () {
    return {
      // 0~100 区间的音量值
      volumeProgress: localStorage.getItem('volumeProgress') || 50
    }
  },

  mounted () {
    /**
     * 调整音量
     */
    const volumeProgressRef = this.$refs['player-volume-progress']
    // 1.鼠标拖动时计算调整音量
    const volumeMouseMove = (e) => {
      let x = e.clientX - volumeProgressRef.offsetLeft
      if (x <= 0) x = 0
      else if (x >= 100) x = 100
      this.updateVolume(x)
    }
    const volumeMouseMoveHandle = (e) => {
      volumeMouseMove(e)
      document.removeEventListener('mousemove', volumeMouseMove)
      document.removeEventListener('mouseup', volumeMouseMoveHandle)
    }
    // 2.鼠标按下时，监听鼠标移动 -------------------------------------开始调整进度条
    volumeProgressRef.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', volumeMouseMove)
      document.addEventListener('mouseup', volumeMouseMoveHandle) // ---------------------------结束调整进度条
    })

    this.$emit('volume-change', this.volumeProgress / 100)
  },

  methods: {
    // 切换静音
    switchVolume () {
      if (this.volumeProgress > 0) {
        this.volumeProgress = 0
      } else {
        this.volumeProgress = localStorage.getItem('volumeProgress') || 50
      }
      this.$emit('volume-change', this.volumeProgress / 100)
    },
    updateVolume (x) {
      if (this.volumeProgress !== x) {
        this.$emit('volume-change', x / 100)
      }
      localStorage.setItem('volumeProgress', x)
      this.volumeProgress = x
    },
    // 前往播放列表
    toPlayQueue () {
      if (!this.$store.state.playQueueStatus) {
        this.$store.commit('setLoading', true)
        this.$router.push({ name: 'playqueue' })
      } else {
        this.$router.go(-1)
      }
    }
  },

  computed: {
    // 获取音量值
    getVolumeProgress () {
      return `${this.volumeProgress - 100}px`
    }
  }
}
</script>

<style lang="less">
.player-volume {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

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

  .btn-row {
    display: flex;
    .play-queue,
    .switch-volume {
      position: relative;
      margin: 0 4px 0 0 !important;
    }
    .play-queue-open {
      &::after {
        content: "";
        background-color: rgba(240, 0, 0, 0.8);
        border-radius: 50%;
        bottom: 0;
        display: block;
        height: 4px;
        position: absolute;
        width: 4px;
      }
    }
  }

  .player-volume-progress {
    height: 12px;
    width: 100px;
    display: flex;
    align-items: center;
    position: relative;
    .hidden-label {
      visibility: hidden;
      width: 0;
      height: 0;
    }
    .player-volume-point {
      height: 12px;
      width: 12px;
      background: #f2f2f2;
      border-radius: 50%;
      position: absolute;
      right: -6px;
      left: 94px;
      z-index: 100;
      cursor: pointer;
    }
    .player-progress-bg {
      width: 100px;
      height: 4px;
      border-radius: 4px;
      position: relative;
      background: #535353;
      overflow: hidden;
      .player-progress-fg {
        height: 100%;
        width: 100%;
        transform: translateX(-100%);
        background: #ffffff;
      }
    }
  }
}
</style>
