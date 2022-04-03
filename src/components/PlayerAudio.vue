<!--
  这是播放器组件，集成

  localStorage:
  1.audioLength
  2.currentTime
  3.volumeProgress

  切歌有延迟
  离开页面久了，有时候会触发暂停，但是歌还在放
-->

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
            :class="{ 'player-progress-bg-animate': !audioSeeking }"
            :style="{ transform: `translateX(-${100 - getPlayProgress}%)` }"
          >
            <!-- 小圆点 -->
            <div class="player-progress-point"></div>
          </div>
        </div>
      </div>
      <!-- 歌曲信息 -->
      <div class="player-song">
        <!-- 封面 -->
        <div class="player-song-pic">
          <img v-if="!loading" :src="curSongPic" alt="" />
          <TheLoadingCircle v-else class="pic-loading" />
        </div>
        <!-- 歌曲信息 -->
        <div class="player-song-desc">
          <p :title="curSongName">
            {{ loading ? "正在加载..." : curSongName }}
          </p>
          <p
            v-if="!loading"
            :title="`${curSongArtisis}${
              curSongPubtime ? ' • ' : ''
            }${curSongPubtime}`"
          >
            {{ curSongArtisis }}
            <span v-if="curSongPubtime">&nbsp;•&nbsp;</span>
            {{ curSongPubtime }}
          </p>
          <p v-else>&nbsp;</p>
        </div>
      </div>
      <!-- 中控 -->
      <div class="player-controls">
        <div class="player-controls-left">
          <button>
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              <path
                d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z"
              ></path>
              <path
                d="M7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 001.724.804h1.947l-1.017-1.018a.75.75 0 111.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34l-.787-.938z"
              ></path>
            </svg>
          </button>
          <button @click="prev">
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
          <button title="播放/暂停" @click="audioPlay" :disabled="loading">
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
          <button @click="next" style="--button-size: 32px">
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
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
      <PlayerAudioVolume @volume-change="updateVolume" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import PlayerAudioVolume from '@/components/PlayerAudioVolume'
import TheLoadingCircle from '@/components/TheLoadingCircle'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { pickUpName } from '@/util'

export default {
  name: 'PlayerAudio',

  components: {
    PlayerAudioVolume,
    TheLoadingCircle
  },

  data () {
    return {
      // 歌曲加载状态
      loading: false,

      // 播放模式 如: repeat(单曲循环), common(不), list(列表播放)
      audioPlayType: 'common',

      // 鼠标到进度条位置对应的时间 如 3:01
      currentTimeFormat: '',

      // 鼠标在进度条的位置 0~100
      mouseMoveProgress: '',

      // 鼠标在进度条的位置 X轴
      mouseMoveX: '',

      // 播放进度 0~100
      progress: '',

      // 音频总长度
      audioLength: '',

      // 已经缓存的进度
      cacheProgress: '',

      // 元素节点引用
      audioRef: '',

      // 是否正在调整视频(拖动进度条)
      audioSeeking: false,

      // 音量 0~100
      volumeProgress: 0,

      // 音乐是否正在播放
      playStatus: false,

      // 刷新时恢复播放进度
      currentTime: '',

      // 当前播放的歌曲信息
      curSongInfo: {
        name: '',
        picUrl: '',
        artisis: '',
        publishTime: ''
      },

      // 出现错误的次数， 每一首歌有一次重连机会
      errorNum: 0
    }
  },

  methods: {
    ...mapGetters(['playQueue', 'playQueueIndex']),
    ...mapActions(['getSongDetail', 'getSongUrl']),
    ...mapMutations(['setCurSongid', 'setCurSongurlInfo']),
    // 创建audio 加载mp3
    createAudio (url, autoplay) {
      // 重置播放器信息,删除上一首歌播放进度
      localStorage.removeItem('audioLength')
      localStorage.removeItem('currentTime')
      // 设置是否自动播放
      this.audioRef.autoplay = autoplay
      // this.audioRef.muted = 'muted'
      this.audioRef.src = url
      // this.audioRef.src = 'www.baidu.com' // 测试错误
      this.audioRef.load()
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
    // 更新音量
    updateVolume (volume) {
      if (typeof volume !== 'undefined') this.audioRef.volume = volume
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
    },
    // 通过歌曲id获取MP3 url
    idToUrl (songid, autoplay) {
      // 获取歌曲详情，返回只有一个元素的songs
      this.getSongDetail(songid).then((res) => {
        const data = res.songs[0]
        const curSongInfo = {
          name: data.name,
          picUrl: data.al.picUrl,
          artisis: data.ar,
          publishTime: data.publishTime
        }
        // 赋值到this.curSongInfo
        Object.keys(curSongInfo).forEach((key) => {
          this.curSongInfo[key] = curSongInfo[key]
        })
        localStorage.setItem('curSongInfo', JSON.stringify(curSongInfo))
        // 通过歌曲的id获取MP3的url
        this.getSongUrl(songid).then((res) => {
          this.createAudio(res.data[0].url, autoplay)
        })
      })
    },
    next () {
      const playQueue = this.playQueue()
      const playQueueIndex = this.playQueueIndex()
      // 如果播放到尾，则从头开始
      const nextIndex =
        playQueueIndex === playQueue.length - 1 ? 0 : playQueueIndex + 1
      this.setCurSongid(playQueue[nextIndex].id)
    },
    prev () {
      const playQueue = this.playQueue()
      const playQueueIndex = this.playQueueIndex()
      // 如果播放到尾，则从头开始
      const prevIndex =
        playQueueIndex === 0 ? playQueue.length - 1 : playQueueIndex - 1
      this.setCurSongid(playQueue[prevIndex].id)
    }
  },

  created () {
    // 配置audio
    this.audioRef = document.createElement('audio')
    this.audioRef.controls = 'controls'
    this.audioRef.preload = 'auto'
    this.audioRef.loop = false
    this.audioRef.currentTime = localStorage.getItem('currentTime') || 0
    this.audioLength = localStorage.getItem('audioLength')
    this.progress = (this.audioRef.currentTime / this.audioLength) * 100

    // 监听错误
    this.audioRef.addEventListener('error', (e) => {
      this.audioRef.pause()
      this.loading = true
      if (this.errorNum === 0) {
        this.errorNum = 1
        setTimeout(() => {
          this.idToUrl(songid, true)
        }, 3000)
      } else {
        // TODO 重新加载一次都不行，这时候页面就是显示错误了，可能是url过期等网络问题
        console.error(e, '玩了，芭比Q了.直接刷新页面吧')
      }
    })
    // 可以开始播放，加载完毕
    this.audioRef.addEventListener('canplay', () => {
      // 加载成功之后就再给他一次重连的机会
      this.errorNum = 0
      this.loading = false
    })
    // 开始播放
    this.audioRef.addEventListener('play', (e) => {
      this.playStatus = true
      console.log('触发开始')
    })
    // 暂停播放
    this.audioRef.addEventListener('pause', (e) => {
      this.playStatus = false
      console.log('触发暂停')
    })
    // 获取音频总时长
    this.audioRef.addEventListener('durationchange', (e) => {
      this.audioLength = this.audioRef.duration
      localStorage.setItem('audioLength', this.audioLength)
    })
    // 计算当前缓存进度
    this.audioRef.addEventListener('progress', (e) => {
      // 计算缓存进度
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
      // 保存进度到localStorage
      localStorage.setItem('currentTime', this.audioRef.currentTime)
    })

    // 用户代理试图获取媒体数据，但数据意外地没有进入。
    this.audioRef.addEventListener('stalled', (e) => {
      console.log('stalled', e)
    })
    // 因为暂时性缺少数据，播放暂停。
    this.audioRef.addEventListener('waiting', (e) => {
      console.log('waiting', e)
    })

    // 读取音量
    this.volumeProgress = localStorage.getItem('volumeProgress') || 50
    if (this.volumeProgress) this.updateVolume()

    // 读取上次播放的歌曲id
    const songid = localStorage.getItem('songid')
    if (songid) this.idToUrl(songid, false)

    // 读取上次播放的歌曲
    const curSongInfo = localStorage.getItem('curSongInfo')
    if (curSongInfo) {
      Object.keys(JSON.parse(curSongInfo)).forEach((key) => {
        this.curSongInfo[key] = curSongInfo[key]
      })
    }
  },

  // 挂在后开始监听一些调整操作
  mounted () {
    /**
     * 调整音乐播放进度
     */
    const playerProgressRef = this.$refs['player-progress']
    // 1.鼠标在进度条上方移动时显示当前时间
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
    // 2.鼠标拖拽进度条时
    const progressMousedrag = (e) => {
      const x = e.clientX / playerProgressRef.offsetWidth
      const curTime = this.audioLength * x
      this.audioRef.currentTime = curTime
    }
    // 3.鼠标移动时调用(1)显示当前事件
    playerProgressRef.addEventListener('mousemove', progressMousedMove)
    // 4.一起调用,因为拖动的同时还要显示当前事件
    const mousemoveHandle = (e) => {
      progressMousedMove(e)
      progressMousedrag(e)
    }
    // 5.在进度条按下鼠标时 -------------------------------------开始调整进度条
    playerProgressRef.addEventListener('mousedown', () => {
      const paused = !!this.audioRef.paused // 视频是否正在暂停状态,用来保存当前状态.调整完成后恢复为当前状态
      const mouseupHandle = (e) => {
        progressMousedrag(e) // 单击时触发,因为单击没有触发mousemove
        document.removeEventListener('mousemove', mousemoveHandle)
        document.removeEventListener('mouseup', mouseupHandle)
        this.audioSeeking = false
        this.audioRef.muted = false
        if (!paused) this.audioRef.play() // 如果调整前时播放状态,那就继续播放
      }
      this.audioSeeking = true // 调整时标记状态为调整中(seeking)
      this.audioRef.muted = true // 静音
      this.audioRef.pause() // 暂停歌曲
      document.addEventListener('mousemove', mousemoveHandle) // 监听鼠标移动
      document.addEventListener('mouseup', mouseupHandle) // 监听鼠标松开 ---------------------------结束调整进度条
    })
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
    },

    // 以下歌曲信息
    curSongName () {
      return this.curSongInfo.name || ''
    },
    curSongPic () {
      return this.curSongInfo.picUrl || ''
    },
    curSongArtisis () {
      return pickUpName(this.curSongInfo.artisis) ?? null
    },
    curSongPubtime () {
      const timeStamp = this.curSongInfo.publishTime
      if (!timeStamp) return ''
      return moment(timeStamp).format('YYYY') || ''
    }
  },

  watch: {
    // ID改变，相当于切歌
    '$store.getters.curSongid': {
      handler (songid) {
        if (songid) {
          localStorage.setItem('songid', songid)
          this.idToUrl(songid, true)
          this.audioRef.pause()
          this.loading = true
        }
      }
    }
  }
}
</script>

<style lang="less">
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
    margin: 0 6px;
    cursor: pointer;
    * {
      color: rgba(255, 255, 255, 1);
    }
    svg {
      fill: currentcolor;
      height: 16px;
      width: 16px;
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
    // 歌曲信息
    .player-song {
      width: 30%;
      height: 100%;
      display: flex;
      align-items: center;
      .player-song-pic {
        height: 48px;
        width: 48px;
        margin-right: 12px;
        img {
          height: 48px;
          border-radius: 3px;
          cursor: pointer;
        }
        .pic-loading {
          padding: 6px;
          box-sizing: border-box;
        }
      }
      .player-song-desc {
        display: flex;
        height: 100%;
        justify-content: center;
        flex-direction: column;
        overflow: hidden;
        white-space: nowrap;
        p:hover {
          cursor: pointer;
          text-decoration: underline;
        }
        p:first-child {
          font-size: 14px;
        }
        p:last-child {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          span {
            color: currentColor;
          }
        }
      }
    }

    // 控制按钮
    .player-controls {
      display: flex;
      width: 40%;
      justify-content: center;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .player-controls-center {
        border-radius: 50%;
        background: rgba(255, 255, 255, 1);
        margin: 0 12px;
        transition: all 0.2s;
        * {
          color: #141414;
        }
        button {
          margin: 0;
        }
        &:hover {
          transform: translate3d(0, 0, 0) scale(1.08);
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
      width: 30%;
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
