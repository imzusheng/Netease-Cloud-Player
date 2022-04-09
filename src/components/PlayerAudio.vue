<!--
  这是播放器组件，集成

  localStorage:
  1.audioLength
  2.currentTime
  3.volumeProgress
-->

<template>
  <div
    id="audioPlayerWrap"
    :class="{ 'audio-player-hidden': !$store.state.audioDisplay }"
  >
    <div class="player-main">
      <!-- 进度条 -->
      <player-progress
        :progress="progress"
        :cache-progress="cacheProgress"
        :audioLength="audioLength"
        @set-current-time="setCurTime"
        @seeking-change="seekingChange"
      />

      <!-- 歌曲信息 -->
      <player-info
        :cur-song-info="curSongInfo"
        :loading="loading"
      />

      <!-- 中控 -->
      <player-controls
        :loading="loading"
        :playStatus="playStatus"
        @play-change="playChange"
        @loop-change="loopChange"
        @song-change="songChange"
      />

      <!-- 调整音量 -->
      <player-audio-volume @volume-change="updateVolume"/>
    </div>
  </div>
</template>

<script>
import PlayerAudioVolume from '@/components/PlayerAudioVolume'
import PlayerProgress from '@/components/AudioPlayer/PlayerProgress'
import PlayerControls from '@/components/AudioPlayer/PlayerControls'
import PlayerInfo from '@/components/AudioPlayer/PlayerInfo'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { getRandomIndex } from '@/util'

export default {
  name: 'PlayerAudio',

  components: {
    PlayerAudioVolume,
    PlayerProgress,
    PlayerControls,
    PlayerInfo
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

      // 已经缓存的进度
      cacheProgress: '',

      // 音频总长度
      audioLength: '',

      // 元素节点引用
      audioRef: '',

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
        artists: '',
        publishTime: ''
      },

      // 出现错误的次数， 每一首歌有一次重连机会
      errorNum: 0,

      // 是否开启随机播放
      random: false
    }
  },

  created () {
    /**
     * 以下配置audio
     */
    this.audioRef = document.createElement('audio')
    this.audioRef.controls = 'controls'
    this.audioRef.preload = 'auto'
    this.audioRef.loop = false
    /**
     * 以下恢复上次播放数据
     */
    // 读取音量
    this.audioRef.volume = (localStorage.getItem('volumeProgress') || 50) / 100
    // 读取上次播放时间
    this.audioRef.currentTime = localStorage.getItem('currentTime') || 0
    // 读取上次歌曲长度
    this.audioLength = localStorage.getItem('audioLength')
    // 计算上次播放进度
    this.progress = (this.audioRef.currentTime / this.audioLength) * 100
    // 读取上次播放的歌曲id
    const songid = localStorage.getItem('songid')
    // id存在且播放器是显示状态时，才加载歌曲
    if (songid) this.idToUrl(songid, false)
    // 读取上次播放的歌曲信息
    const curSongInfo = localStorage.getItem('curSongInfo')
    if (curSongInfo) {
      this.curSongInfo = JSON.parse(curSongInfo)
    }
    /**
     * 以下是监听audio
     */
    // 监听错误
    this.audioRef.addEventListener('error', (e) => {
      // 发生错误暂停歌曲
      this.audioRef.pause()
      this.loading = true
      // 只能连续重连两次
      if (this.errorNum === 0) {
        this.errorNum = 1
        setTimeout(() => {
          // 重新获取url
          this.idToUrl(songid, true)
        }, 3000)
      } else {
        console.error(e, '玩了，芭比Q了.直接刷新页面吧')
      }
    })

    // 可以开始播放，加载完毕
    this.audioRef.addEventListener('canplay', () => {
      // 加载成功之后就再给他一次重连的机会
      this.errorNum = 0
      this.loading = false
      // 获取音频总时长
      this.audioLength = this.audioRef.duration
      localStorage.setItem('audioLength', this.audioLength)
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

    // 播放完毕
    this.audioRef.addEventListener('ended', (e) => {
      if (this.audioPlayType === 'list') {
        // 列表循环模式
        this.next()
      } else if (this.audioPlayType === 'repeat') {
        // 单曲循环模式
        this.audioRef.currentTime = 0
      } else {
        // 列表播放，播完即止
        const playQueue = this.playQueue()
        const playQueueIndex = this.playQueueIndex()
        // 如果播放到尾，则结束播放。反之下一首
        if (playQueueIndex !== playQueue.length - 1) {
          this.next()
        }
      }
    })

    // 用户代理试图获取媒体数据，但数据意外地没有进入。
    this.audioRef.addEventListener('stalled', (e) => {
      console.log('\n\n\n', 'stalled', e, '\n\n\n')
    })

    // 因为暂时性缺少数据，播放暂停。
    this.audioRef.addEventListener('waiting', (e) => {
      console.log('\n\n\n', 'waiting', e, '\n\n\n')
    })
  },

  methods: {
    ...mapGetters(['playQueue', 'playQueueIndex']),
    ...mapActions(['getSongDetail', 'getSongUrl']),
    ...mapMutations(['setCurSongid', 'setTips', 'setAudioDisplay']),

    // 获取到歌曲url，开始切歌
    InitPlayer (url, autoplay) {
      // 重置播放器信息,删除上一首歌播放进度
      localStorage.removeItem('audioLength')
      localStorage.removeItem('currentTime')
      localStorage.removeItem('curSongInfo')

      // 设置是否自动播放
      if (!url) {
        console.warn('歌曲url: ', url)
        return
      }
      this.audioRef.src = url
      this.audioRef.autoplay = autoplay
      this.audioRef.load()
    },

    // 通过歌曲id获取MP3url
    idToUrl (songid, autoplay) {
      // 获取歌曲详情，返回只有一个元素的songs
      this.getSongDetail(songid).then((res) => {
        const data = res[0]
        const curSongInfo = {
          name: data.name,
          picUrl: data.al.picUrl,
          artists: data.ar,
          publishTime: data.publishTime
        }
        // 赋值到this.curSongInfo
        this.curSongInfo = JSON.parse(JSON.stringify((curSongInfo)))
        localStorage.setItem('curSongInfo', JSON.stringify(curSongInfo))
        // 修改网页标题
        document.title = `Music - ${curSongInfo.name}`
        // 通过歌曲的id获取MP3的url
        this.getSongUrl(songid).then((res) => {
          this.InitPlayer(res.data[0].url, autoplay)
        })
      })
    },

    // 下一首
    next () {
      const playQueue = this.playQueue()
      if (playQueue.length === 0) {
        this.setTips('没有下一首')
        return
      }
      // 当前播放的音乐下标
      const playQueueIndex = this.playQueueIndex()
      // 判断是否开启了随机播放
      if (this.random) {
        // 为了排除随机到正在播放的歌曲
        function getNextIndex () {
          const nextIndex = getRandomIndex(0, playQueue.length - 1)
          return nextIndex === playQueueIndex ? getNextIndex() : nextIndex
        }
        const nextIndex = getNextIndex()
        this.setCurSongid(playQueue[nextIndex].id)
      } else {
        // 如果播放到尾，则从头开始
        const nextIndex =
          playQueueIndex === playQueue.length - 1 ? 0 : playQueueIndex + 1
        this.setCurSongid(playQueue[nextIndex].id)
      }
    },

    // 上一首
    prev () {
      const playQueue = this.playQueue()
      if (playQueue.length === 0) {
        this.setTips('没有上一首')
        return
      }
      const playQueueIndex = this.playQueueIndex()
      // 如果播放到尾，则从头开始
      const prevIndex =
        playQueueIndex === 0 ? playQueue.length - 1 : playQueueIndex - 1
      this.setCurSongid(playQueue[prevIndex].id)
    },

    // 切歌了 PlayerControls - emit
    songChange (type) {
      type === 'next' ? this.next() : this.prev()
    },

    // 更新音量 player-audio-volume - emit
    updateVolume (volume) {
      if (typeof volume !== 'undefined') this.audioRef.volume = volume
    },

    // 设置播放时间 PlayerProgress - emit
    setCurTime (time) {
      this.audioRef.currentTime = time
    },

    // 进度条是否正在调整 PlayerProgress - emit
    seekingChange (status) {
      if (status) {
        this.audioRef.muted = true
        this.audioRef.pause()
      } else {
        this.audioRef.muted = false
        this.audioRef.play()
      }
    },

    // 开始或暂停播放 PlayerControls - emit
    playChange () {
      // 如果暂停了，就播放
      if (this.audioRef.paused) {
        this.audioRef.play()
        this.playStatus = true
      } else {
        this.audioRef.pause()
        this.playStatus = false
      }
    },

    // 是否循环播放 PlayerControls - emit
    loopChange (status) {
      this.audioRef.loop = status === 'on'
    }
  },

  watch: {
    // ID改变，相当于切歌
    '$store.getters.curSongid': {
      handler (songid) {
        if (songid) {
          // 显示播放器
          if (!this.$store.state.audioDisplay) {
            this.setAudioDisplay(true)
          }
          // 播放器显示成功才加载音乐
          const localSongid = localStorage.getItem('songid')
          if (localSongid !== songid.toString()) {
            localStorage.setItem('songid', songid)
            this.audioRef.pause()
            this.idToUrl(songid, true)
            this.loading = true
          }
        }
      }
    },
    '$route.name': {
      handler (routeName) {
        if (['mv', 'video'].includes(routeName)) {
          this.setAudioDisplay(false)
          // 人家要放视频了，赶紧停了音乐
          this.audioRef.pause()
        } else {
          if (localStorage.getItem('songid')) {
            this.setAudioDisplay(true)
          }
        }
      }
    }
  }
}
</script>

<style lang="less">
.audio-player-hidden {
  //display: none;
  transform: translate(0, 70px);
}

#audioPlayerWrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(24, 24, 24, 1);
  box-shadow: 0 0 1px rgba(255, 255, 255, 1);
  transition: transform .4s;

  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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
  }
}
</style>
