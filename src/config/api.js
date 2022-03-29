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
  // 需要登录
  AUTH: {
    GET_RECORDS: `${API_ROOT}/user/record?type=1`
  }
}
