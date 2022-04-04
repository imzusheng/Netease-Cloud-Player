const API_ROOT = 'http://localhost:3000'

export default {
  // 推荐
  GET_RECOMMENDS: `${API_ROOT}/personalized?limit=6`,
  // 社区(网页)推荐
  GET_COMMUNITY: `${API_ROOT}/top/playlist?limit=6`,
  // 新歌
  GET_PERSON_NEWSONG: `${API_ROOT}/personalized/newsong?limit=9`,
  // 推荐MV
  GET_RECOMMENDS_MV: `${API_ROOT}/personalized/mv`,
  // 热门歌手
  GET_HOT_ARTISTS: `${API_ROOT}/top/artists?offset=0&limit=6`,
  // 歌单详情
  GET_PLAYLIST_DETAIL: `${API_ROOT}/playlist/detail`,
  // 单曲详情
  GET_SONG_DETAIL: `${API_ROOT}/song/detail`,
  // 单曲url
  GET_SONG_URL: `${API_ROOT}/song/url`,
  // 歌手信息
  GET_ARTIST_DETAIL: `${API_ROOT}/artist/detail`,
  // 歌手粉丝
  GET_ARTIST_FANS: `${API_ROOT}/artist/follow/count`,
  // 歌手热门单曲
  GET_ARTIST_SONG: `${API_ROOT}/artists`,
  // 歌手专辑
  GET_ARTIST_ALBUM: `${API_ROOT}/artist/album`,
  // 歌手MV
  GET_ARTIST_MV: `${API_ROOT}/artist/mv`,
  // 需要登录
  AUTH: {
    GET_RECORDS: `${API_ROOT}/user/record?type=1`
  }
}
