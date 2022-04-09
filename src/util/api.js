const API_ROOT =
  process.env.NODE_ENV === 'development'
    ? 'https://music.zusheng.club'
    : 'https://music.zusheng.club'

// 'https://netease-cloud-music-f4u1p2cjb-imzusheng.vercel.app'

export default {
  // 推荐电台
  GET_RECOMMENDS_DJ: `${API_ROOT}/personalized/djprogram`,

  // 用户相关
  USER: {
    // 用户信息
    GET_USER_DETAIL: `${API_ROOT}/user/detail`
  },

  // 搜索相关
  SEARCH: {
    // type: 搜索类型；默认为 1 即单曲
    MATCH_TYPE: {
      单曲: 1,
      专辑: 10,
      歌手: 100,
      歌单: 1000,
      用户: 1002,
      MV: 1004,
      歌词: 1006,
      电台: 1009,
      视频: 1014,
      综合: 1018,
      声音: 2000
    },
    // 搜索
    GET_SEARCH: `${API_ROOT}/search`,
    // 搜索建议
    GET_SEARCH_SUGGEST: `${API_ROOT}/search/suggest`,
    // 最佳结果
    GET_SEARCH_MATCH: `${API_ROOT}/search/multimatch`

  },

  // 单曲
  SONG: {
    // 新歌
    GET_PERSON_NEWSONG: `${API_ROOT}/personalized/newsong`,
    // 单曲详情
    GET_SONG_DETAIL: `${API_ROOT}/song/detail`,
    // 单曲url
    GET_SONG_URL: `${API_ROOT}/song/url`

  },

  // 专辑相关
  ALBUM: {
    // 获取专辑信息
    GET_ALBUM_DETAIL: `${API_ROOT}/album`,
    // 获取专辑所有歌曲
    GET_ALBUM_All: `${API_ROOT}/album/track/all`
  },

  // 歌手、艺人相关
  ART: {
    // 热门歌手
    GET_HOT_ARTISTS: `${API_ROOT}/top/artists`,
    // 歌手MV
    GET_ARTIST_MV: `${API_ROOT}/artist/mv`,
    // 歌手视频
    GET_ARTIST_VIDEO: `${API_ROOT}/artist/video`,
    // 歌手信息
    GET_ARTIST_DETAIL: `${API_ROOT}/artist/detail`,
    // 歌手粉丝
    GET_ARTIST_FANS: `${API_ROOT}/artist/follow/count`,
    // 歌手专辑
    GET_ARTIST_ALBUM: `${API_ROOT}/artist/album`,
    // 相似歌手
    GET_ARTIST_SIMI: `${API_ROOT}/simi/artist`,
    // 歌手热门单曲
    GET_ARTIST_SONG: `${API_ROOT}/artists`
  },

  // 歌单相关
  PLAYLIST: {
    // 推荐歌单
    GET_RECOMMENDS: `${API_ROOT}/personalized`,
    // 社区(歌单)推荐
    GET_COMMUNITY: `${API_ROOT}/top/playlist`,
    // 歌单详情
    GET_PLAYLIST_DETAIL: `${API_ROOT}/playlist/detail`

  },

  // MV相关
  MV: {
    // 最新MV
    GET_NEW_MV: `${API_ROOT}/mv/first`,
    // 推荐MV
    GET_RECOMMENDS_MV: `${API_ROOT}/personalized/mv`,
    // MV详情
    GET_MV_DETAIL: `${API_ROOT}/mv/detail`,
    // MV详情
    GET_MV_URL: `${API_ROOT}/mv/url`,
    // MV 点赞评论数量
    GET_MV_INFO: `${API_ROOT}/mv/detail/info`,
    // MV 评论列表
    GET_MV_COMMENT: `${API_ROOT}/comment/mv`,
    // MV 相似推荐
    GET_MV_SIMI: `${API_ROOT}/simi/mv`
  },

  // 视频相关
  VIDEO: {
    GET_VIDEO_DETAIL: `${API_ROOT}/video/detail`
  },

  // 需要登录
  AUTH: {
    GET_RECORDS: `${API_ROOT}/user/record?type=1`
  }
}
