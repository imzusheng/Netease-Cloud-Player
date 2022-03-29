import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    }
  },
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {},
  actions: {},
  modules: {}
})
