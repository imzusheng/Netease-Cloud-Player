<template>
  <div class="player-volume">
    <div>
      <!-- 单击切换静音 -->
      <button @click="switchVolume">
        <!-- 静音icon -->
        <svg
          v-if="volumeProgress === 0"
          role="presentation"
          height="16"
          width="16"
          aria-label="Volume off"
          id="volume-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M13.86 5.47a.75.75 0 00-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 008.8 6.53L10.269 8l-1.47 1.47a.75.75 0 101.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 001.06-1.06L12.39 8l1.47-1.47a.75.75 0 000-1.06z"
          ></path>
          <path
            d="M10.116 1.5A.75.75 0 008.991.85l-6.925 4a3.642 3.642 0 00-1.33 4.967 3.639 3.639 0 001.33 1.332l6.925 4a.75.75 0 001.125-.649v-1.906a4.73 4.73 0 01-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 01-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"
          ></path>
        </svg>
        <!-- 低音量icon -->
        <svg
          v-else-if="volumeProgress <= 25"
          role="presentation"
          height="16"
          width="16"
          aria-label="Volume low"
          id="volume-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 010 4.88z"
          ></path>
        </svg>
        <!-- 中音量icon -->
        <svg
          v-else-if="volumeProgress <= 75"
          role="presentation"
          height="16"
          width="16"
          aria-label="Volume medium"
          id="volume-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 000-8.474v1.65a2.999 2.999 0 010 5.175v1.649z"
          ></path>
        </svg>
        <!-- 高音量icon -->
        <svg
          v-else
          role="presentation"
          height="16"
          width="16"
          aria-label="Volume high"
          id="volume-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 010 4.88z"
          ></path>
          <path
            d="M11.5 13.614a5.752 5.752 0 000-11.228v1.55a4.252 4.252 0 010 8.127v1.55z"
          ></path>
        </svg>
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
      volumeProgress: localStorage.getItem('volumeProgress') || 50 // 0~100区间的音量值
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
    },
    updateVolume (x) {
      if (this.volumeProgress !== x) this.$emit('volume-change', x / 100)
      localStorage.setItem('volumeProgress', x)
      this.volumeProgress = x
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

<style lang="less" scoped>
.player-volume {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
