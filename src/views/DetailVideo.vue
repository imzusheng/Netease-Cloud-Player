<!--
    播放视频页面
-->
<template>
  <div id="video-player">
    <div class="video-player-container">
      <div class="video-player-left">
        <!-- 播放组件 -->
        <div id="xgplayer"></div>

        <!-- 视频信息 -->
        <section class="video-player-action">
          <div class="video-player-title">
            <!-- 标题 -->
            <h1>
              {{ videoDetail.name }}
            </h1>
          </div>
          <!-- 视频描述 -->
          <pre class="video-player-desc" :title="videoDetail.desc">{{
            videoDetail.desc
          }}</pre>
          <div class="video-player-info">
            <span class="video-info-playCount"
              >观看{{ videoDetail.playCount }}次&nbsp;&nbsp;•&nbsp;&nbsp;</span
            >
            <span class="video-info-publishTime">{{
              videoDetail.publishTime
            }}</span>
          </div>
        </section>

        <!-- 评论 -->
        <section class="video-player-comment">
          <h2 class="video-player-comment-title">{{ comment.total }}条评论</h2>

          <ul class="comment-list">
            <li
              class="comment-list-item"
              v-for="(item, index) in comment.comments"
              :key="`comment-${index}`"
            >
              <img
                :src="item.user.avatarUrl + '?param=50y50'"
                class="comment-avatar"
                alt=""
              />
              <div class="comment-content">
                <div class="comment-content-title">
                  {{ item.user.nickname }}
                  <span>&nbsp;&nbsp;&nbsp;{{ item.timeStr }}</span>
                </div>
                <div class="comment-content-main">
                  <pre>{{ item.content }}</pre>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <!-- 右侧 -->
      <div class="video-player-right">
        <!-- 作者信息 -->
        <section class="video-player-author">
          <img
            v-if="userDetail.cover"
            class="author-poster"
            :src="userDetail.cover + '?param=50y50'"
            alt=""
          />
          <div class="author-title">
            <div class="author-title-name">{{ userDetail.name }}</div>
            <div class="author-title-desc" v-if="userDetail.identifyTag">
              {{ userDetail.identifyTag.join("/") }}
            </div>
          </div>
          <div class="author-title-action">
            <button class="author-title-action-btn">关注</button>
          </div>
        </section>
        <!-- 推荐视频 -->
        <section class="video-player-similar">
          <h2 class="similar-h2">推荐视频</h2>
          <ul class="similar-list">
            <li
              @click="toMv(item.id)"
              class="similar-list-item"
              v-for="(item, index) in mvs"
              :key="`mvs-${index}`"
            >
              <div class="similar-item-poster-spacing">
                <img
                  class="similar-item-poster"
                  :src="item.cover + '?param=200y150'"
                  alt=""
                />
                <span class="duration">{{ getDt(item.duration) }}</span>
              </div>
              <div class="similar-info">
                <div class="similar-info-name">{{ item.name }}</div>
                <div class="similar-info-desc">
                  <span
                    >{{
                      item.playCount > 10000
                        ? `${(item.playCount / 10000).toFixed(1)}万`
                        : item.playCount
                    }}次观看</span
                  >
                  <span>{{ item.artistName }}</span>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Player from 'xgplayer'
import moment from 'moment'

export default {
  name: 'DetailVideo',

  data () {
    return {
      // 视频信息
      videoDetail: {},

      // 评论信息
      comment: {
        total: 0,
        hotComments: [],
        comments: []
      },

      // 作者信息
      userDetail: {},

      // 推荐MV
      mvs: []
    }
  },

  mounted () {
    this.setLoading(true)

    const headerMaskRef = this.$parent.$refs['main-header-mask']
    headerMaskRef.style.opacity = 1

    this.setAudioDisplay(false)
    const player = new Player({
      id: 'xgplayer',
      //   url: 'http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/11517150295/0f2c1d4619cb522184a8860fe186a622.mp4?wsSecret=83118578e16dfc3c25353d7d90346df8&wsTime=1649399493',
      //   fitVideoSize: 'auto',
      fluid: true,
      videoInit: true,
      //   playbackRate: [0.5, 0.75, 1, 1.5, 2],
      //   defaultPlaybackRate: 1,
      //   download: true, // 设置download控件显示
      //   pip: true,
      miniplayerConfig: {
        bottom: 200,
        right: 0,
        width: 320,
        height: 180
      }
      //   lastPlayTime: 20, // 视频起播时间（单位：秒）
      //   lastPlayTimeHideDelay: 5 // 提示文字展示时长（单位：秒）
    })

    const { id } = this.$route.query

    // 获取相关MV推荐
    this.getMvSimi(id).then((res) => {
      this.mvs = res.mvs
    })
    // 获取MV详情
    this.getMvDetail(id).then((res) => {
      this.videoDetail = res.data
      this.getArtistDetail(res.data.artistId).then((res) => {
        this.userDetail = res.data.artist
      })
      //  获取mv链接
      Promise.allSettled(
        res.data.brs.map((v) => {
          return this.getMvUrl({
            id,
            br: v.br
          })
        })
      ).then((resArr) => {
        const brArr = resArr
          .filter((v) => v.status === 'fulfilled')
          .map(({ value: res }) => {
            return { name: res.data.r, url: res.data.url }
          })
          .reverse()
        player.emit('resourceReady', brArr)
        player.start(brArr[0].url)
        this.setLoading(false)
      })
    })
    // 获取评论
    this.getMvComment(id).then((res) => {
      this.comment.total = res.total
      this.comment.hotComments = res.hotComments
      this.comment.comments = res.comments
    })
  },

  methods: {
    ...mapActions([
      'getArtistDetail',
      'getMvComment',
      'getMvDetail',
      'getMvSimi',
      'getMvUrl'
    ]),
    ...mapMutations(['setAudioDisplay', 'setLoading']),
    toMv (id) {
      this.$router.push({
        name: 'mv',
        query: {
          id
        }
      })
    }
  },

  computed: {
    // 获取视频时长
    getDt () {
      return function (time) {
        const _moment = moment.duration(time)
        return `${
          _moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()
        }:${
          _moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()
        }`
      }
    }
  }
}
</script>

<style lang="less">
#video-player {
  padding: 68px 0 72px;
  box-sizing: border-box;
  .video-player-container {
    width: 84vw;
    height: 100%;
    margin: 16px auto 0;
    display: grid;
    grid-template-columns: 8fr minmax(0, 3fr);
    grid-gap: 24px;

    // 左侧
    .video-player-left {
      min-height: 300px;
      position: relative;
      width: 100%;

      //  播放器
      #xgplayer {
        border-radius: 4px;
        width: 100%;
        height: 100%;
      }

      //   视频信息
      .video-player-action {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 8px;
        .video-player-title {
          h1 {
            padding: 10px 0 5px;
            font-size: 24px;
            font-weight: 700;
          }
        }
        .video-player-desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          white-space: pre-wrap;
          word-wrap: break-word;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
        .video-player-info {
          padding-top: 20px;
          .video-info-playCount,
          .video-info-publishTime {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }

      // 评论
      .video-player-comment {
        margin-top: 20px;
        .video-player-comment-title {
          font-size: 18px;
        }

        // ul
        .comment-list {
          padding-bottom: 20px;
          // li
          .comment-list-item {
            display: flex;
            padding: 16px 0;
            .comment-avatar {
              height: 50px;
              width: 50px;
              margin-right: 16px;
              border-radius: 50%;
            }
            .comment-content {
              .comment-content-title {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.6);
                > span {
                  font-size: 12px;
                  color: rgba(255, 255, 255, 0.4);
                }
              }
              .comment-content-main {
                margin-top: 3px;
                pre {
                  font-size: 14px;
                  color: rgba(255, 255, 255, 1);
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 3;
                  overflow: hidden;
                }
              }
            }
          }
        }
      }
    }

    // 右侧
    .video-player-right {
      // 作者信息
      .video-player-author {
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        // 头像
        .author-poster {
          flex-shrink: 0;
          height: 50px;
          width: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .author-title {
          flex: 1;
          .author-title-name {
            font-size: 16px;
            font-weight: 700;
          }
          .author-title-desc {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
        .author-title-action {
          display: flex;
          align-items: center;
          .author-title-action-btn {
            border: none;
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.8);
            // background: rgba(240, 0, 0, 1);
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
          }
        }
      }
      // 推荐视频
      .video-player-similar {
        padding: 10px 0 10px;
        .similar-h2 {
          font-size: 16px;
        }

        // ul
        .similar-list {
          // li
          .similar-list-item {
            display: flex;
            margin: 12px 0;
            background: #181818;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
              background: rgba(39, 39, 39, 1);
              .similar-info-name {
                text-decoration: underline;
              }
            }
            // 封面
            .similar-item-poster-spacing {
              width: 40%;
              flex-shrink: 0;
              object-fit: cover;
              margin-right: 10px;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background: linear-gradient(
                  rgba(0, 0, 0, 0) 0,
                  rgba(0, 0, 0, 0.6) 100%
                );
              }
              .duration {
                position: absolute;
                right: 4px;
                bottom: 0;
                z-index: 2;
                font-size: 12px;
              }
              .similar-item-poster {
                width: 100%;
                height: 100%;
              }
            }
            .similar-info {
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .similar-info-name {
                font-size: 13px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }
              .similar-info-desc {
                display: flex;
                width: 100%;
                justify-content: space-between;
                > span {
                  font-size: 10px;
                  color: rgba(255, 255, 255, 0.5);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
