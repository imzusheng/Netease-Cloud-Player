import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/util/api'
import { fetchToJson, pickUpName } from '@/util'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    loading: false, // 全局加载动画

    userInfo: {
      profile: {
        userId: 86087017,
        nickname: '没四块腹肌不改ID',
        avatarUrl: 'http://p1.music.126.net/-RUgrsay56NqOXHIYKZjKA==/18723583510950274.jpg'
      }
    },

    // 当前主题颜色
    curPlaylistColor: '0, 0, 0, 0',

    // 当前播放的歌曲
    curSong: {
      id: 0 // 当前播放的歌曲id
      // url: '',
      // info: {}
    },

    // 播放队列
    playQueue: [],

    // 播放队列图标状态
    playQueueStatus: false,

    // 小提示内容
    tips: ''
  },
  getters: {
    userInfo: state => state.userInfo,
    curSongid: state => state.curSong.id || '',
    playQueue: state => state.playQueue,
    playQueueIndex: state => {
      const ids = state.playQueue.map(v => v.id)
      if (typeof state.curSong.id === 'string') {
        state.curSong.id = Number(state.curSong.id)
      }
      return ids.indexOf(state.curSong.id)
    }
  },
  mutations: {
    setTips (state, content) {
      state.tips = content
    },
    setPlayQueueStatus (state, status) {
      state.playQueueStatus = status
    },
    setLoading (state, status) {
      state.loading = status
    },
    setCurPlaylistColor (state, rgba) {
      state.curPlaylistColor = rgba
    },
    setCurSongid (state, id) {
      state.curSong.id = id
    },
    // 修改播放列表
    pushPlayQueue (state, playQueue) {
      if (playQueue) {
        const ids = state.playQueue.map(v => v.id)
        playQueue.forEach(song => {
          if (!ids.includes(song.id)) state.playQueue.push(song)
        })
      } else {
        state.playQueue = []
      }
      console.log(state.playQueue)
      localStorage.setItem('playQueue', JSON.stringify(state.playQueue))
    },
    // 从localStorage恢复数据
    reset (state) {
      state.playQueue = localStorage.getItem('playQueue') ? JSON.parse(localStorage.getItem('playQueue')) : []
      state.curSong.id = localStorage.getItem('songid') || null
    }
  },
  actions: {
    // 获取重定向url(MP3url)
    getRedirect ({ state }, url) {
      fetch(`https://zusheng.club/api/redirect?url=${encodeURIComponent(url)}`).then(async (res) => {
        state.curSongurlInfo.redirect = await res.text()
      })
    },
    // 社区精选
    getCommunity () {
      return new Promise(resolve => {
        fetchToJson(API.GET_COMMUNITY).then((resJson) => {
          const data = resJson.playlists.map((v) => {
            v.picUrl = v.coverImgUrl
            v.desc1 = v.trackCount + '首音乐'
            v.payload = v.id
            return v
          })
          resolve({
            data,
            type: 'community'
          })
        })
      })
    },
    // 今日推荐
    getRecommend () {
      return new Promise(resolve => {
        fetchToJson(API.GET_RECOMMENDS).then((resJson) => {
          const data = resJson.result.map((v) => {
            v.desc1 = moment(v.trackNumberUpdateTime).format('M月DD日')
            v.desc2 = v.trackCount + '首音乐'
            v.payload = v.id
            return v
          })
          resolve({
            data,
            type: 'recommends'
          })
        })
      })
    },
    // 播放记录/最近播放
    getRecords () {
      return new Promise(resolve => {
        fetchToJson(API.AUTH.GET_RECORDS).then((resJson) => {
          resolve(resJson.weekData.map((v) => {
            v.desc1 = pickUpName(v.song.ar)
            v.desc2 = v.song.al.name
            v.picUrl = v.song.al.picUrl
            return v
          }))
        })
      })
    },
    // 播放记录/最近播放
    getNewsong () {
      return new Promise(resolve => {
        fetchToJson(API.GET_PERSON_NEWSONG).then((resJson) => {
          const data = resJson.result.map((v) => {
            v.desc1 = v.song.album.type
            v.desc2 = pickUpName(v.song.artists)
            return v
          })
          resolve({
            data,
            type: 'newsong'
          })
        })
      })
    },
    // 推荐MV
    getMv () {
      return new Promise(resolve => {
        fetchToJson(API.GET_RECOMMENDS_MV).then((resJson) => {
          const data = resJson.result.map((v) => {
            v.desc1 = v.artistName
            v.desc2 = v.playCount + '万次播放'
            return v
          })
          resolve({
            data,
            type: 'recommendMv'
          })
        })
      })
    },
    // 获取热门歌手
    getHotArtists () {
      return new Promise(resolve => {
        fetchToJson(API.GET_HOT_ARTISTS).then((resJson) => {
          const data = resJson.artists.map((v) => {
            v.picUrl = v.img1v1Url
            v.desc1 = '艺人'
            v.payload = v.id
            return v
          })
          resolve({
            data,
            type: 'hotArtists'
          })
        })
      })
    },
    // 获取歌单详情
    getPlaylistDetail ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_PLAYLIST_DETAIL}?id=${id}`).then((resJson) => {
          resolve(resJson.playlist)
        })
      })
    },
    // 获取单曲详情
    getSongDetail ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_SONG_DETAIL}?ids=${id}`).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // 获取单曲url
    getSongUrl ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_SONG_URL}?id=${id}`).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // 获取歌手信息
    getArtistDetail ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_DETAIL}?id=${id}`).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // 获取歌手粉丝
    getArtistFans ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_FANS}?id=${id}`).then((resJson) => {
          resolve({
            data: resJson.data,
            type: 'fans'
          })
        })
      })
    },
    // 获取歌手单曲
    getArtistSong ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_SONG}?id=${id}`).then((resJson) => {
          const data = resJson.hotSongs.splice(0, 5)
          resolve({
            data,
            type: 'hotSongs'
          })
        })
      })
    },
    // 获取歌手专辑
    getArtistALBUM ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_ALBUM}?id=${id}`).then((resJson) => {
          const data = resJson.hotAlbums.splice(0, 7).map(v => {
            v.desc = `${moment(v.publishTime).year()} • ${v.type === 'Single' ? v.type = '单曲' : v.type}`
            return v
          })
          resolve({
            data,
            type: 'hotAlbums'
          })
        })
      })
    },
    // 获取歌手MV
    getArtistMV ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_MV}?id=${id}`).then((resJson) => {
          const data = resJson.mvs.splice(0, 7).map(v => {
            v.picUrl = v.imgurl
            // v.desc = ` ${v.playCount}次观看`
            v.desc = v.name
            return v
          })
          resolve({
            data,
            type: 'mvs'
          })
        })
      })
    },
    // 相似歌手
    getArtistSimi ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_SIMI}?id=${id}`).then((resJson) => {
          const data = resJson.artists.splice(0, 7).map(v => {
            v.picUrl = v.img1v1Url
            v.desc = '艺人'
            return v
          })
          resolve({
            data,
            type: 'simi'
          })
        })
      })
    }
  },
  modules: {}
})
