<template>
  <div id="audioPlayerWrap">
    <div class="player-main">
      <!-- 进度条 -->
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
            :style="{ transform: `translateX(-${100 - getPlayProgress}%)` }"
          >
            <!-- 小圆点 -->
            <div class="player-progress-point"></div>
          </div>
        </div>
      </div>
      <!-- 歌曲信息 -->
      <div class="player-song">
        <div>
          <img :src="poster" alt="" />
        </div>
        <div class="player-song-desc">
          <p>{{ name }}</p>
          <p>
            {{ artisis }} •
            {{ pubTime }}
          </p>
        </div>
      </div>
      <!-- 中控 -->
      <div class="player-controls">
        <div class="player-controls-left">
          <button
            style="--button-size: 32px"
            role="switch"
            aria-checked="false"
            aria-label="开启随机播放"
            data-testid="control-button-shuffle"
            aria-expanded="false"
          >
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              class="Svg-sc-1bi12j5-0 hDgDGI"
            >
              <path
                d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z"
              ></path>
              <path
                d="M7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 001.724.804h1.947l-1.017-1.018a.75.75 0 111.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34l-.787-.938z"
              ></path>
            </svg>
          </button>
          <button
            style="--button-size: 32px"
            class="FKTganvAaWqgK6MUhbkx"
            disabled=""
            aria-label="上一首"
            aria-expanded="false"
          >
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              class="Svg-sc-1bi12j5-0 hDgDGI"
            >
              <path
                d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="player-controls-center">
          <button @click="audioPlay">
            <!-- 开始 -->
            <svg
              v-if="getPlayStatus"
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
            >
              <path
                d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"
              ></path>
            </svg>
            <!-- 暂停 -->
            <svg v-else role="img" height="16" width="16" viewBox="0 0 16 16">
              <path
                d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="player-controls-right">
          <!-- 按钮 下一首 -->
          <button
            style="--button-size: 32px"
            class="ARtnAVxkbmzyEjniZXVO"
            disabled=""
            aria-label="下一首"
            data-testid="control-button-skip-forward"
            aria-expanded="false"
          >
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              class="Svg-sc-1bi12j5-0 hDgDGI"
            >
              <path
                d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"
              ></path>
            </svg>
          </button>
          <!-- 按钮 播放模式 -->
          <button
            @click="audioPlayTypeSwitch"
            :class="`control-button-${audioPlayType}`"
          >
            <!-- 默认 -->
            <svg
              v-if="['common', 'list'].includes(audioPlayType)"
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"
              ></path>
            </svg>
            <!-- 单曲循环 -->
            <svg v-else role="img" height="16" width="16" viewBox="0 0 16 16">
              <path
                d="M0 4.75A3.75 3.75 0 013.75 1h.75v1.5h-.75A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5zM12.25 2.5h-.75V1h.75A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25z"
              ></path>
              <path
                d="M9.12 8V1H7.787c-.128.72-.76 1.293-1.787 1.313V3.36h1.57V8h1.55z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <!-- 调整音量 -->
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
              class="Svg-sc-1bi12j5-0 hDgDGI"
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
              class="Svg-sc-1bi12j5-0 hDgDGI"
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
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PlayerAudio',

  props: {
    name: {
      // 歌曲名
      type: String,
      required: true
    },
    poster: {
      // 封面url
      type: String,
      required: true
    },
    artisis: {
      // 作者
      type: String,
      required: true
    },
    pubTime: {
      // 发布时间
      type: [String, Number],
      required: true
    },
    songUrl: {
      // MP3链接
      type: String,
      required: true
    }
  },

  data () {
    return {
      audioPlayType: 'common', // 播放模式 如: repeat(单曲循环), common(不), list(列表播放)
      currentTimeFormat: '', // 鼠标到进度条位置对应的时间 如 3:01
      mouseMoveProgress: '', // 鼠标在进度条的位置 0~100
      mouseMoveX: '', // 鼠标在进度条的位置 X轴
      progress: '', // 播放进度 0~100
      cacheProgress: '', // 已经缓存的进度
      audioLength: '', // 音频总长度
      audioRef: '', // 元素节点引用
      audioSeeking: false, // 是否正在调整视频(拖动进度条)
      volumeProgress: 1, // 音量 0~100
      playStatus: false // 音乐是否正在播放
    }
  },

  mounted () {
    console.log('mounted')
    // 监听调整音量
    const volumeProgressRef = this.$refs['player-volume-progress']
    // 事件 -> 鼠标拖动时计算调整音量
    const volumeMouseMove = (e) => {
      let x = e.clientX - volumeProgressRef.offsetLeft
      if (x <= 0) x = 0
      else if (x >= 100) x = 100
      this.audioRef.volume = x / 100
      this.volumeProgress = x // 0~100区间的音量值
    }
    // 鼠标按下时，监听鼠标移动
    volumeProgressRef.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', volumeMouseMove)
    })
    //
    //
    //
    // 监听音频进度
    const playerProgressRef = this.$refs['player-progress']
    // 事件 -> 鼠标在进度条上方移动时显示当前时间
    const progressMousedMove = (e) => {
      let x = (e.clientX / playerProgressRef.offsetWidth) * 100 // 鼠标移动的百分比
      if (x <= 1) x = 0
      else if (x >= 99) x = 100
      const _moment = moment.duration(this.audioLength * (x / 100), 'seconds') // moment将秒转换为格式 -> 分钟:秒
      // 转换格式为 mm:ss
      this.currentTimeFormat = `${
        _moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()
      }:${_moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()}`
      // 获取提示显示的位置，X轴坐标
      let mouseX = e.clientX
      const mouseXMin = 30
      const mouseXmax = playerProgressRef.offsetWidth - 30
      if (mouseX < mouseXMin) mouseX = mouseXMin
      else if (mouseX > mouseXmax) mouseX = mouseXmax
      this.mouseMoveX = mouseX // 保存X坐标
    }
    // 鼠标拖拽进度条时
    const progressMousedrag = (e) => {
      const x = e.clientX / playerProgressRef.offsetWidth
      const curTime = this.audioLength * x
      this.audioRef.currentTime = curTime
    }
    const progressMouseEvent = (e) => {
      progressMousedMove(e)
      progressMousedrag(e)
    }
    const removeEvents = () => {
      this.audioSeeking = false
      this.audioRef.muted = false
      this.audioRef.play()
      document.removeEventListener('mousemove', volumeMouseMove)
      document.removeEventListener('mousemove', progressMouseEvent)
      document.removeEventListener('mouseup', removeEvents)
    }
    // 鼠标移动时显示鼠标所在的时间点
    playerProgressRef.addEventListener('mousemove', progressMousedMove)
    // 在进度条按下鼠标时,监听鼠标移动
    playerProgressRef.addEventListener('mousedown', (e) => {
      this.audioSeeking = true
      this.audioRef.muted = true
      this.audioRef.pause()
      // 单击切换时间
      progressMousedrag(e)
      document.addEventListener('mousemove', progressMouseEvent)
      // 鼠标松开时，停止监听鼠标移动
      document.addEventListener('mouseup', removeEvents)
    })
  },

  methods: {
    // 创建audio 加载mp3
    createAudio () {
      this.audioRef = document.createElement('audio')
      this.audioRef.controls = 'controls'
      this.audioRef.preload = 'auto'
      this.audioRef.loop = false
      // this.audioRef.autoplay = 'autoplay'
      // this.audioRef.muted = 'muted'
      this.audioRef.src = this.$props.songUrl
      this.audioRef.load()
      // 开始播放
      this.audioRef.addEventListener('play', (e) => {
        this.playStatus = true
      })
      // 暂停播放
      this.audioRef.addEventListener('pause', (e) => {
        this.playStatus = false
      })
      // 获取音频总时长
      this.audioRef.addEventListener('durationchange', (e) => {
        this.audioLength = this.audioRef.duration
      })
      // 计算当前缓存进度
      this.audioRef.addEventListener('progress', (e) => {
        // 方法1
        // this.cacheProgress =
        //   (this.audioRef.buffered.end(0) / this.audioLength) * 100
        // 方法2
        let cacheLength = 0
        for (let i = 0; i < this.audioRef.buffered.length; i++) {
          cacheLength +=
            this.audioRef.buffered.end(i) - this.audioRef.buffered.start(i)
        }
        this.cacheProgress = (cacheLength / this.audioLength) * 100
      })
      // 计算当前播放进度
      this.audioRef.addEventListener('timeupdate', (e) => {
        this.progress = (this.audioRef.currentTime / this.audioLength) * 100
      })
    },
    // 开始或暂停播放
    audioPlay () {
      // 如果正在播放
      if (this.playStatus) {
        this.playStatus = false
        this.audioRef.pause()
      } else {
        this.playStatus = true
        this.audioRef.play()
      }
    },
    // 调整音量(切换静音)
    switchVolume () {
      if (this.volumeProgress > 0) {
        this.volumeProgress = 0
      } else {
        this.volumeProgress = 30
      }
    },
    // 切换播放模式
    audioPlayTypeSwitch () {
      if (this.audioPlayType === 'common') {
        this.audioPlayType = 'list'
        this.audioRef.loop = false
      } else if (this.audioPlayType === 'list') {
        this.audioPlayType = 'repeat'
        this.audioRef.loop = true
      } else if (this.audioPlayType === 'repeat') {
        this.audioPlayType = 'common'
        this.audioRef.loop = false
      }
    }
  },

  computed: {
    // 获取音量值
    getVolumeProgress () {
      return `${this.volumeProgress - 100}px`
    },
    // 获取播放状态
    getPlayStatus () {
      return this.playStatus
    },
    // 获取播放进度
    getPlayProgress () {
      return this.progress
    },
    // 获取缓存进度
    getCacheProgress () {
      return this.cacheProgress
    }
  },

  watch: {
    // 监听props中url是否传入且不为undefined
    '$props.songUrl': {
      handler (url) {
        if (url) this.createAudio()
      }
    }
  }
}
</script>

<style lang="less" scoped>
#audioPlayerWrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(24, 24, 24, 1);
  box-shadow: 0px 0px 1px rgba(255, 255, 255, 1);
  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  // 通用按钮
  button {
    width: 32px;
    height: 32px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 8px;
    cursor: pointer;
    * {
      color: #535353;
      transition: color 0.2s;
    }
    svg {
      fill: currentcolor;
      height: 16px;
      width: 16px;
    }
    &:hover {
      * {
        color: #ccc;
      }
    }
  }
  .player-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 24px 0 12px;
    box-sizing: border-box;
    position: relative;
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
        // transition: transform 0.4s;
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
    // 歌曲信息
    .player-song {
      flex: 1;
      height: 100%;
      display: flex;
      > div {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        img {
          height: 48px;
          border-radius: 3px;
          margin-right: 12px;
          cursor: pointer;
        }
        &[class="player-song-desc"] {
          p:hover {
            cursor: pointer;
            text-decoration: underline;
          }
          p:first-child {
            font-size: 14px;
          }
          p:last-child {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
    // 控制按钮
    .player-controls {
      display: flex;
      justify-content: center;
      flex: 1;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
        &[class="player-controls-center"] {
          border-radius: 50%;
          background: #535353;
          margin: 0 12px;
          transition: all 0.2s;
          * {
            color: #141414;
          }
          button {
            margin: 0;
          }
          &:hover {
            background: #ccc;
            transform: scale(1.08);
          }
        }
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
        }
      }
    }
    // 音量控制
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
  }
}
</style>
