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
    curSong: {
      songUrl: '',
      name: '等你等到我心痛',
      id: 190360,
      pst: 0,
      t: 0,
      ar: [
        {
          id: 6460,
          name: '张学友',
          tns: [],
          alias: ['Jacky Cheung'],
          alia: ['Jacky Cheung']
        }
      ],
      alia: [],
      pop: 100,
      st: 0,
      rt: '',
      fee: 8,
      v: 38,
      crbt: null,
      cf: '',
      al: {
        id: 19237,
        name: '等你等到我心痛 张学友精选',
        picUrl:
            'http://p3.music.126.net/Frx9MSEa-t_QtBLNy2GDew==/109951166860255517.jpg',
        tns: [],
        pic_str: '109951166860255517',
        pic: 109951166860255520
      },
      dt: 255466,
      h: {
        br: 320000,
        fid: 0,
        size: 10221236,
        vd: 675
      },
      m: {
        br: 192000,
        fid: 0,
        size: 6132759,
        vd: 675
      },
      l: {
        br: 128000,
        fid: 0,
        size: 4088520,
        vd: 675
      },
      a: null,
      cd: '1',
      no: 1,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 1,
      s_id: 0,
      mark: 8192,
      originCoverType: 1,
      originSongSimpleData: null,
      resourceState: true,
      version: 38,
      single: 0,
      noCopyrightRcmd: null,
      rtype: 0,
      rurl: null,
      mst: 9,
      cp: 7003,
      mv: 5343605,
      publishTime: 752083200000,
      privilege: {
        id: 190360,
        fee: 8,
        payed: 0,
        st: 0,
        pl: 128000,
        dl: 0,
        sp: 7,
        cp: 1,
        subp: 1,
        cs: false,
        maxbr: 999000,
        fl: 128000,
        toast: false,
        flag: 260,
        preSell: false,
        playMaxbr: 999000,
        downloadMaxbr: 999000,
        rscl: null,
        freeTrialPrivilege: {
          resConsumable: false,
          userConsumable: false
        },
        chargeInfoList: [
          {
            rate: 128000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 0
          },
          {
            rate: 192000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1
          },
          {
            rate: 320000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1
          },
          {
            rate: 999000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1
          }
        ]
      },
      lyrics: [
        '<b>等你等你等你</b>',
        '一世一世<b>等你</b>',
        '<b>我</b>真的真的不愿舍弃',
        '很想当天的一切能回味',
        '想<b>你</b>想<b>你</b>苦<b>痛</b>'
      ]
    },
    curPlaylistColor: '0, 0, 0, 1', // 当前主题颜色
    curPlaylist: {}
  },
  getters: {
    userInfo: state => state.userInfo,
    songUrl: state => state.curSong.songUrl,
    playlistName: state => state.curPlaylist.name,
    playlistPicUrl: state => state.curPlaylist.coverImgUrl,
    playlistCreatorName: state => state.curPlaylist.creator?.nickname ?? '',
    playlistTags: state => state.curPlaylist.tags ? state.curPlaylist.tags.join(' • ') : ''
  },
  mutations: {},
  actions: {
    // 获取重定向url(MP3url)
    getRedirect ({ state }, url) {
      fetch(`https://zusheng.club/api/redirect?url=${encodeURIComponent(url)}`).then(async (res) => {
        state.curSong.songUrl = await res.text()
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
            console.dir(v)
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
      state.loading = true
      fetchToJson(`${API.GET_PLAYLIST_DETAIL}?id=${id}`).then((resJson) => {
        Vue.set(state, 'curPlaylist', resJson.playlist)
        state.loading = false
      })
    }
  },
  modules: {}
})
