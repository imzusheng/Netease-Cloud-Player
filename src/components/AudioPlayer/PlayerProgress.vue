<!--
  播放器的播放进度组件
  支持点击和拖动快进、回溯，显示当前播放时间、缓存进度

  :progress="progress" // 播放进度
  :cache-progress="cacheProgress" // 缓存进度
  :audioLength="audioLength" // 歌曲长度
  @set-current-time="setCurTime" // 设置时间的回调
  @seeking-change="seekingChange" // 是否调整状态的回调
-->

<template>
  <div
    class="player-progress"
    ref="player-progress"
    :class="{ 'player-seeking': audioSeeking }"
  >
    <!-- 时间提示 -->
    <span
      class="player-progress-hover-tips"
      :style="{ left: `${mouseMoveX}px` }"
    >{{ currentTimeFormat }}
        </span>
    <!-- 滑轨 深灰色-->
    <div class="player-progress-rail">
      <!-- 缓存进度 浅灰色-->
      <div
        class="player-progress-cache"
        :style="{ transform: `translateX(-${100 - getCacheProgress}%)` }"
      ></div>
      <!-- 播放进度 红色 -->
      <div
        class="player-progress-bg"
        :class="{ 'player-progress-bg-animate': !audioSeeking }"
        :style="{ transform: `translateX(-${100 - getPlayProgress}%)` }"
      >
        <!-- 小圆点 -->
        <div class="player-progress-point"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { durationConvert } from '@/util'

// TODO 调整功能还未实现，用emit让父组件来调整进度吧

export default {
  name: 'PlayerProgress',

  props: ['progress', 'cacheProgress', 'audioLength'],

  data () {
    return {
      // 鼠标x坐标
      mouseMoveX: 0,

      // 是否是调整状态
      audioSeeking: false,

      // 提示框显示当前播放时间
      currentTimeFormat: '',

      // HTMLElement
      playerProgressRef: null
    }
  },

  mounted () {
    /**
     * 调整音乐播放进度
     */
    this.playerProgressRef = this.$refs['player-progress']

    // 鼠标在进度条上移动时调用(1)显示当前播放时间
    this.playerProgressRef.addEventListener('mousemove', this.progressMousedMove)

    // 在进度条按下鼠标时 -------------------------------------开始调整进度条
    this.playerProgressRef.addEventListener('mousedown', () => {
      const mouseupHandle = (e) => {
        this.progressMousedrag(e) // 单击时触发调整进度,因为单击没有触发mousemove
        document.removeEventListener('mousemove', this.mousemoveHandle)
        document.removeEventListener('mouseup', mouseupHandle)
        // 恢复播放状态
        this.audioSeeking = false
      }

      // 设置播放状态
      this.audioSeeking = true // 调整时标记状态为调整中(seeking)

      document.addEventListener('mousemove', this.mousemoveHandle) // 监听鼠标移动
      document.addEventListener('mouseup', mouseupHandle) // 监听鼠标松开 ---------------------------结束调整进度条
    })
  },

  methods: {
    /**
     * 1.
     * 鼠标在进度条上方移动时显示当前时间
     * @param e event
     */
    progressMousedMove (e) {
      // 鼠标移动的百分比
      let x = (e.clientX / this.playerProgressRef.offsetWidth) * 100

      // 处理临界值
      if (x <= 1) {
        x = 0
      } else if (x >= 99) {
        x = 100
      }

      // 转换格式为 mm:ss
      this.currentTimeFormat = durationConvert(this.getAudioLength * (x / 100))

      // 获取提示框显示的位置，X轴坐标
      let mouseX = e.clientX
      const mouseXMin = 30
      const mouseXmax = this.playerProgressRef.offsetWidth - 30
      if (mouseX < mouseXMin) {
        mouseX = mouseXMin
      } else if (mouseX > mouseXmax) {
        mouseX = mouseXmax
      }
      this.mouseMoveX = mouseX // 保存X坐标
    },

    /**
     * 2.
     * 鼠标拖拽进度条时
     * @param e
     */
    progressMousedrag (e) {
      // 鼠标移动的百分比
      const xRatio = e.clientX / this.playerProgressRef.offsetWidth
      // 改变歌曲时间
      this.$emit('set-current-time', this.getAudioLength * xRatio)
    },

    /**
     * 3.
     * 一起调用,当在进度条上按下鼠标并拖动时
     * @param e
     */
    mousemoveHandle (e) {
      this.progressMousedMove(e)
      this.progressMousedrag(e)
    }

  },

  computed: {
    // 获取歌曲长度
    getAudioLength () {
      return this.$props.audioLength || 0
    },
    // 获取播放进度
    getPlayProgress () {
      return this.$props.progress || 0
    },
    // 获取缓存进度
    getCacheProgress () {
      return this.$props.cacheProgress || 0
    }
  },

  watch: {
    audioSeeking (status) {
      this.$emit('seeking-change', status)
    }
  }
}
</script>

<style lang="less" scoped>
// 进度条
.player-progress {
  // 透明区域高度
  --player-progress-height: 36px;
  width: 100%;
  // 透明区域，鼠标进入后可以调整进度条
  height: var(--player-progress-height);
  background: transparent;
  position: absolute;
  top: calc(var(--player-progress-height) / -2);
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  cursor: pointer;

  .player-progress-hover-tips {
    display: none;
    position: absolute;
    top: 4px;
    left: 50%;
    padding: 4px 8px;
    border-radius: 2px;
    background: rgb(33, 33, 33);
    font-size: 12px;
    transform: translate3d(-50%, -100%, 0);
  }

  .player-progress-rail {
    --progress-rail-height: 3px;
    width: 100%;
    height: var(--progress-rail-height);
    background: rgb(40, 40, 40);
    position: relative;
  }

  // 缓存进度
  .player-progress-cache {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background: rgb(69, 69, 69);
  }

  // 播放进度
  .player-progress-bg {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    background: rgba(240, 0, 0, 0.8);
    transform: translateX(-90%);
    // 小圆点
    .player-progress-point {
      display: none;
      --progress-point-size: 16px;
      height: var(--progress-point-size);
      width: var(--progress-point-size);
      background: #fff;
      position: absolute;
      right: calc(var(--progress-point-size) * -1);
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      z-index: 3;
    }
  }

  player-progress-bg-animate {
    transition: transform 0.25s linear 0s;
  }

  &:hover {
    .player-progress-hover-tips {
      display: block;
    }

    .player-progress-rail {
      width: 100%;
      height: 8px;

      .player-progress-point {
        display: block;
      }
    }
  }
}

// 正在拖动状态的进度条
.player-seeking {
  .player-progress-hover-tips {
    display: block;
  }

  .player-progress-rail {
    width: 100%;
    height: 8px;

    .player-progress-point {
      display: block;
    }
  }
}
</style>
