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
      code: 200,
      account: {
        id: 86087017,
        userName: '1_********875',
        type: 1,
        status: 0,
        whitelistAuthority: 0,
        createTime: 1439569209151,
        tokenVersion: 4,
        ban: 0,
        baoyueVersion: 1,
        donateVersion: 0,
        vipType: 0,
        anonimousUser: false,
        paidFee: false
      },
      profile: {
        userId: 86087017,
        userType: 0,
        nickname: '没四块腹肌不改ID',
        avatarImgId: 18723583510950270,
        avatarUrl: 'http://p1.music.126.net/-RUgrsay56NqOXHIYKZjKA==/18723583510950274.jpg',
        backgroundImgId: 109951164591180050,
        backgroundUrl: 'http://p1.music.126.net/OvebeOTHv3egUOxKTs8h-A==/109951164591180043.jpg',
        signature: '2016',
        createTime: 1439569209153,
        userName: '1_********875',
        accountType: 1,
        shortUserName: '********875',
        birthday: 930240000000,
        authority: 0,
        gender: 1,
        accountStatus: 0,
        province: 440000,
        city: 441300,
        authStatus: 0,
        description: null,
        detailDescription: null,
        defaultAvatar: false,
        expertTags: null,
        experts: null,
        djStatus: 0,
        locationStatus: 30,
        vipType: 0,
        followed: false,
        mutual: false,
        authenticated: false,
        lastLoginTime: 1648380665982,
        lastLoginIP: '14.150.143.248',
        remarkName: null,
        viptypeVersion: 1589299906269,
        authenticationTypes: 0,
        avatarDetail: null,
        anchor: false
      }
    },
    curPlaylistColor: '0, 0, 0, 1', // 当前主题颜色
    curPlaylist: [], // 当前歌单列表
    curPlaylistInfo: {}, // 当前歌单信息
    curSongurlInfo: {}, // 当前歌曲url信息，包含码率等
    curSongInfo: {}, // 当前歌曲所有信息，包含专辑作者等
    curSongid: '', // 当前播放的歌曲id
    playQueue: [], // 播放队列
    playQueueIndex: 0 // 当前播放队列数组下标
  },
  getters: {
    userInfo: state => state.userInfo,
    curSongid: state => state.curSongid || '',
    curSongName: state => state.curSongInfo.name || '',
    curSongPic: state => state.curSongInfo.al?.picUrl || '',
    curSongArtisis: state => state.curSongInfo.ar || null,
    curSongPubtime: state => state.curSongInfo.publishTime || null
  },
  mutations: {
    setCurPlaylist (state, payload) {
      state.curPlaylist = payload
    },
    setCurSongInfo (state, payload) {
      state.curSongInfo = payload
    },
    setCurSongurlInfo (state, payload) {
      state.curSongurlInfo = payload
    },
    setLoading (state, status) {
      state.loading = status
    },
    setCurPlaylistColor (state, rgba) {
      state.curPlaylistColor = rgba
    },
    setCurSongid (state, id) {
      state.curSongid = id
    },
    setPlayQueueIndex (state, type) {
      if (type) {
        state.playQueueIndex += 1
      } else {
        if (state.playQueueIndex > 1) state.playQueueIndex -= 1
      }
    },
    // 修改播放列表
    pushPlayQueue (state, playQueue) {
      if (playQueue) {
        // 提取id
        const queueId = state.playQueue.map(v => v.id)
        // 第一种 Set 去重，只保存id
        // queueId.push(...state.curPlaylist.map(v => v.id))
        // state.playQueue = Array.from(new Set(queueId))
        // 第二种 foreach
        state.curPlaylist.forEach(v => {
          if (!queueId.includes(v.id)) state.playQueue.push(v)
        })
      } else {
        state.playQueue = []
      }
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
          resolve(resJson.playlists.map((v) => {
            v.picUrl = v.coverImgUrl
            v.desc1 = v.trackCount + '首音乐'
            v.payload = v.id
            return v
          }))
        })
      })
    },
    // 今日推荐
    getRecommend () {
      return new Promise(resolve => {
        fetchToJson(API.GET_RECOMMENDS).then((resJson) => {
          resolve(resJson.result.map((v) => {
            v.desc1 = moment(v.trackNumberUpdateTime).format('M月DD日')
            v.desc2 = v.trackCount + '首音乐'
            v.payload = v.id
            return v
          }))
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
          resolve(resJson.result.map((v) => {
            v.desc1 = v.song.album.type
            v.desc2 = pickUpName(v.song.artists)
            return v
          }))
        })
      })
    },
    // 推荐MV
    getMv () {
      return new Promise(resolve => {
        fetchToJson(API.GET_RECOMMENDS_MV).then((resJson) => {
          resolve(resJson.result.map((v) => {
            v.desc1 = v.artistName
            v.desc2 = v.playCount + '万次播放'
            return v
          }))
        })
      })
    },
    // 获取热门歌手
    getHotArtists () {
      return new Promise(resolve => {
        fetchToJson(API.GET_HOT_ARTISTS).then((resJson) => {
          resolve(resJson.artists.map((v) => {
            v.picUrl = v.img1v1Url
            v.desc1 = '艺人'
            return v
          }))
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
    }
  },
  modules: {}
})
