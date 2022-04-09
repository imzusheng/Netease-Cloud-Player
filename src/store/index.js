import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/util/api'
import { fetchToJson, pickUpName } from '@/util'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    // 当前路由界面，用来更新菜单
    curRouter: 'home',

    // 全局加载动画
    loading: false,

    userInfo: {
      profile: {
        userId: 86087017,
        nickname: '没四块腹肌不改ID',
        avatarUrl: 'http://p1.music.126.net/-RUgrsay56NqOXHIYKZjKA==/18723583510950274.jpg'
      }
    },

    // 当前主题颜色
    curPlaylistColor: '12, 12, 12, 1',

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

    // 音乐播放器是否显示
    audioDisplay: false,

    // 小提示内容
    tips: '',

    // 错误提示页面
    error: {
      status: false,
      msg: ''
    },

    // 搜索框是否显示
    searchDisplay: false,

    // 动态设置grid布局的列数，默认6列（最大）
    columnCount: 6
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
    setColumnCount (state, num) {
      state.columnCount = num
    },
    setCurRouter (state, name) {
      state.curRouter = name
    },
    setSearchDisplay (state, display) {
      state.searchDisplay = display
    },
    setError (state, {
      status = false,
      msg = ''
    }) {
      state.error.status = status
      state.error.msg = msg
    },
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
      localStorage.setItem('playQueue', JSON.stringify(state.playQueue))
    },
    setAudioDisplay (state, status) {
      state.audioDisplay = status
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
    getCommunity ({ state }, limit = 7) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_COMMUNITY}?limit=${limit}`).then((resJson) => {
          const data = resJson.playlists.map((v) => {
            const days = moment.duration(v.trackUpdateTime).days()
            const updateTime = v.trackUpdateTime && days !== '0' ? `${days}天前 • ` : ''
            const trackCount = v.trackCount + '首音乐'
            v.desc = updateTime + trackCount
            v.payload = v.id
            v.picUrl = v.coverImgUrl + '?param=180y180'
            v.query = 'playlist'
            return v
          })
          resolve({
            data,
            title: '社区精选',
            type: 'community'
          })
        })
      })
    },
    // 今日推荐
    getRecommend ({ state }, args) {
      const {
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.GET_RECOMMENDS}`, {
          limit,
          offset: limit * pageIndex
        }).then((resJson) => {
          const data = resJson.result.map((v) => {
            const days = moment.duration(v.trackNumberUpdateTime).days()
            v.desc = (days !== 0 ? `${days}天前 • ` : '刚刚 • ') + `${v.trackCount}首音乐`
            v.payload = v.id
            v.picUrl = v.picUrl + '?param=180y180'
            v.query = 'playlist'
            return v
          })
          resolve({
            data,
            title: '为你推荐',
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
            v.picUrl = v.song.al.picUrl + '?param=180y180'
            return v
          }))
        })
      })
    },
    // 新歌
    getNewsong ({ state }, limit = 9) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_PERSON_NEWSONG}?limit=${limit}`).then((resJson) => {
          const data = resJson.result.map((v) => {
            v.picUrl = v.picUrl + '?param=180y180'
            v.desc1 = v.song.album.type
            v.desc2 = pickUpName(v.song.artists)
            v.desc = v.desc2
            v.query = 'playlist'
            v.payload = v.song.album.id
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
    getMv ({ state }, args) {
      const {
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.GET_NEW_MV}`, {
          limit,
          offset: limit * pageIndex
        }).then((resJson) => {
          const data = resJson.data.map((v) => {
            let playCount
            if (Number(v.playCount) > 10000) {
              playCount = (v.playCount / 10000).toFixed(0) + '万'
            } else {
              playCount = v.playCount
            }
            v.desc = v.artistName + ' • ' + playCount + '次播放'
            v.payload = v.id
            v.picUrl = v.cover + '?param=180y180'
            v.query = 'mv'
            return v
          })
          resolve({
            data,
            title: '推荐的MV',
            type: 'recommendMv'
          })
        })
      })
    },
    // 推荐电台
    getRecommendDj ({ state }, limit = 7) {
      return new Promise(resolve => {
        fetchToJson(API.GET_RECOMMENDS_DJ).then((resJson) => {
          const data = resJson.result.map((v) => {
            v.picUrl = v.picUrl + '?param=180y180'
            v.desc = v.program.description
            v.payload = v.id
            v.query = 'playlist'
            return v
          })
          resolve({
            data,
            title: '推荐电台',
            type: 'dj'
          })
        })
      })
    },
    // 获取热门歌手
    getHotArtists ({ state }, args) {
      const {
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.GET_HOT_ARTISTS}`, {
          limit,
          offset: pageIndex * limit
        }).then((resJson) => {
          const data = resJson.artists.map((v) => {
            v.picUrl = v.img1v1Url + '?param=180y180'
            v.desc = '艺人'
            v.query = 'artist'
            v.payload = v.id
            return v
          })
          resolve({
            data,
            title: '热门歌手',
            type: 'hotArtists'
          })
        })
      })
    },
    // 获取歌单详情
    getPlaylistDetail ({ state }, id) {
      return new Promise((resolve, reject) => {
        fetchToJson(`${API.GET_PLAYLIST_DETAIL}?id=${id}`).then((resJson) => {
          resolve(resJson.playlist)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取单曲详情
    getSongDetail ({ state }, ids) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_SONG_DETAIL}?ids=${ids}`).then((resJson) => {
          const songs = resJson.songs.map(v => {
            v.al.picUrl = v.al.picUrl + '?param=180y180'
            return v
          })
          resolve(songs)
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
          //  + '?param=200y150'
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
          const data = resJson.hotSongs.splice(0, 50).map(v => {
            v.al.picUrl = v.al.picUrl + '?param=180y180'
            return v
          })
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
            v.query = 'album'
            v.picUrl = v.picUrl + '?param=200y200'
            v.payload = v.id
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
            v.picUrl = v.imgurl + '?param=200y150'
            let playCount = v.playCount
            if (playCount > 10000) {
              playCount = (playCount / 10000).toFixed(1) + '万'
            }
            v.query = 'mv'
            v.payload = v.id
            v.desc = ` ${playCount}次观看`
            return v
          })
          resolve({
            data,
            type: 'mvs'
          })
        })
      })
    },
    // 获取歌手视频
    getArtistVideo ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_VIDEO}?id=${id}&order=${1}`).then((resJson) => {
          const data = resJson.data.records.splice(0, 7).map(v => {
            if (v.picUrl) {
              v.picUrl = v.imgurl + '?param=200y150'
              v.desc = v.name
            } else {
              v.name = v.resource.mlogBaseData.text
              v.desc = v.resource.mlogBaseData.desc
              v.picUrl = v.resource.mlogBaseData.coverUrl + '?param=200y150'
            }
            return v
          })
          resolve({
            data,
            type: 'video'
          })
        })
      })
    },
    // 相似歌手
    getArtistSimi ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ARTIST_SIMI}?id=${id}`).then((resJson) => {
          const data = resJson.artists.splice(0, 7).map(v => {
            v.picUrl = v.img1v1Url + '?param=180y180'
            v.desc = '艺人'
            v.query = 'artist'
            v.payload = v.id
            return v
          })
          resolve({
            data,
            type: 'simi'
          })
        })
      })
    },
    // 搜索建议
    getSearchSuggest ({ state }, { keywords = '' }) {
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH_SUGGEST}?keywords=${keywords}&type=mobile`).then((resJson) => {
          resolve(resJson.result)
        })
      })
    },
    // 获取专辑
    getAlbum ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ALBUM_DETAIL}?id=${id}`).then((resJson) => {
          resolve({
            data: resJson.album,
            type: 'album'
          })
        })
      })
    },
    // 获取专辑所有歌曲
    getAlbumAll ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.GET_ALBUM_All}?id=${id}`).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // 最佳匹配结果
    getSearchMatch ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH_MATCH}?keywords=${id}`).then((resJson) => {
          resolve(resJson.result)
        })
      })
    },
    // MATCH_TYPE: {
    //   单曲: 1,
    //   专辑: 10,
    //   歌手: 100,
    //   歌单: 1000,
    //   用户: 1002,
    //   MV: 1004,
    //   歌词: 1006,
    //   电台: 1009,
    //   视频: 1014,
    //   综合: 1018,
    //   声音: 2000
    // }
    // 搜索专辑
    getSearchAlbums ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['专辑'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          const data = resJson.result.albums.map((v) => {
            v.desc = `${v.artist.name} • ` + `${v.size}首音乐`
            v.payload = v.id
            v.picUrl = v.picUrl + '?param=180y180'
            v.query = 'album'
            return v
          })
          resolve({
            data,
            key: 'albums',
            count: resJson.result.albumCount,
            title: '所有搜索结果：专辑'
          })
        })
      })
    },
    // 搜索歌手
    getSearchArtists ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['歌手'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          const data = resJson.result.artists.map((v) => {
            const albumSize = v.albumSize === 0 ? '' : `${v.albumSize}张专辑`
            const mvSize = v.mvSize === 0 ? '' : `${v.mvSize}个MV`
            v.desc =
              albumSize && mvSize
                ? `${albumSize} • ${mvSize}`
                : `${albumSize}${mvSize}`
            v.picUrl = v.picUrl + '?param=180y180'
            v.payload = v.id
            v.query = 'artist'
            return v
          })
          resolve({
            data,
            key: 'artists',
            count: resJson.result.artistCount,
            title: '所有搜索结果：歌手'
          })
        })
      })
    },
    // 搜索歌单
    getSearchPlaylist ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['歌单'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          const data = resJson.result.playlists.map((v) => {
            v.picUrl = v.coverImgUrl + '?param=180y180'
            v.payload = v.id
            v.query = 'playlist'
            v.desc = v.creator.nickname
            return v
          })
          resolve({
            data,
            key: 'playlists',
            count: resJson.result.playlistCount,
            title: '所有搜索结果：歌单'
          })
        })
      })
    },
    // 搜索用户 TODO 用户详情页还没做
    getSearchUsers ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['用户'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          const data = resJson.result.userprofiles.map((v) => {
            v.picUrl = v.avatarUrl + '?param=180y180'
            v.payload = v.userId
            v.desc = v.signature
            v.name = v.nickname
            v.query = 'users'
            return v
          })
          resolve({
            data,
            key: 'users',
            count: resJson.result.userprofileCount,
            title: '所有搜索结果：用户'
          })
        })
      })
    },
    // 搜索用户 TODO MV详情页还没做
    getSearchMV ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE.MV,
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          const data = resJson.result.mvs.map((v) => {
            v.picUrl = v.cover + '?param=180y180'
            v.payload = v.id
            v.desc = v.artistName
            v.query = 'mv'
            return v
          })
          resolve({
            data,
            key: 'mvs',
            count: resJson.result.mvCount,
            title: '所有搜索结果：MV'
          })
        })
      })
    },
    // 搜索电台 TODO 电台详情页还没做
    getSearchDj ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['电台'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          let data = []
          if (resJson.result.djRadios) {
            data = resJson.result.djRadios.map((v) => {
              v.picUrl = v.picUrl + '?param=180y180'
              v.payload = v.id
              v.desc = v.dj.nickname
              v.query = 'djs'
              return v
            })
          }
          resolve({
            data,
            key: 'djs',
            count: resJson.result.djRadiosCount,
            title: '所有搜索结果：电台'
          })
        })
      })
    },
    // 搜索视频 TODO 视频详情页还没做
    getSearchVideos ({ state }, args) {
      const {
        keywords,
        limit = 30,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['视频'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          let data = []
          if (resJson.result.videos) {
            data = resJson.result.videos.map((v) => {
              v.picUrl = v.coverUrl + '?param=180y180'
              v.payload = v.id
              v.name = v.title
              v.desc = `${pickUpName(v.creator)}`
              v.query = 'videos'
              return v
            })
          }
          resolve({
            data,
            key: 'videos',
            count: resJson.result.videoCount,
            title: '所有搜索结果：视频'
          })
        })
      })
    },
    // 搜索歌曲 TODO 不知道跳转到哪里
    getSearchSongs ({ state }, args) {
      const {
        keywords,
        limit = 7,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['歌曲'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          const ids = resJson.result.songs.map((v) => v.id)
          return this.dispatch('getSongDetail', ids.toString())
        }).then(res => {
          resolve({
            data: res.map(v => {
              v.picUrl = v.al.picUrl + '?param=180y180'
              v.desc = `${v.al.name}}`
              return v
            }),
            key: 'songs',
            count: 0,
            title: '所有搜索结果：单曲'
          })
        })
      })
    },
    // 搜索播客（声音） TODO 不知道跳转到哪里
    getSearchVoices ({ state }, args) {
      const {
        keywords,
        limit = 7,
        pageIndex = 0
      } = args
      return new Promise(resolve => {
        fetchToJson(`${API.SEARCH.GET_SEARCH}`, {
          type: API.SEARCH.MATCH_TYPE['声音'],
          keywords,
          offset: limit * pageIndex,
          limit
        }).then((resJson) => {
          let data = []
          if (resJson.data.resources.length > 0) {
            data = resJson.data.resources.map((v) => {
              v.payload = v.baseInfo.id
              v.name = v.baseInfo.name
              v.desc = v.baseInfo.description
              v.picUrl = v.baseInfo.coverUrl + '?param=180y180'
              v.query = 'voices'
              return v
            })
          }
          resolve({
            data,
            key: 'voices',
            count: resJson.data.totalCount,
            title: '所有搜索结果：播客'
          })
        })
      })
    },
    // MV详情
    getMvDetail ({ state }, mvid) {
      return new Promise(resolve => {
        fetchToJson(`${API.MV.GET_MV_DETAIL}?mvid=${mvid}`).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // MV评论
    getMvComment ({ state }, id) {
      return new Promise(resolve => {
        fetchToJson(`${API.MV.GET_MV_COMMENT}?id=${id}`).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // MV URL
    getMvUrl ({ state }, {
      id,
      br = 720
    }) {
      return new Promise(resolve => {
        fetchToJson(`${API.MV.GET_MV_URL}`, {
          id,
          r: br
        }).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // MV 相关推荐
    getMvSimi ({ state }, mvid) {
      return new Promise(resolve => {
        fetchToJson(`${API.MV.GET_MV_SIMI}`, {
          mvid
        }).then((resJson) => {
          resolve(resJson)
        })
      })
    },
    // 获取用户信息
    getUserDetail ({ state }, uid) {
      return new Promise(resolve => {
        fetchToJson(`${API.USER.GET_USER_DETAIL}`, {
          uid
        }).then((resJson) => {
          resolve(resJson)
        })
      })
    }
  },
  modules: {}
})
