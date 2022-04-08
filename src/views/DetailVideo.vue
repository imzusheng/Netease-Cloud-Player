<!--
    播放视频页面
    TODO 分离成组件，做响应式
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
              >观看{{
                countConvert(videoDetail.playCount)
              }}次&nbsp;&nbsp;•&nbsp;&nbsp;</span
            >
            <span class="video-info-publishTime">{{
              videoDetail.publishTime
            }}</span>
          </div>
        </section>

        <!-- 评论 l布局 -->
        <list-comments class="l-layout" :comment="comment"></list-comments>
      </div>

      <!-- 右侧 -->
      <div class="video-player-right">
        <!-- 作者信息 -->
        <card-author :userDetail="userDetail"></card-author>

        <!-- 推荐视频 -->
        <list-video :mvs="mvs"></list-video>

        <!-- 评论 m布局-->
        <list-comments class="m-layout" :comment="comment"></list-comments>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { countConvert } from '@/util'
import ListComments from '@/components/VideoPlayer/ListComments'
import CardAuthor from '@/components/VideoPlayer/CardAuthor'
import ListVideo from '@/components/VideoPlayer/ListVideo'
import Player from 'xgplayer'

export default {
  name: 'DetailVideo',

  components: {
    ListComments,
    CardAuthor,
    ListVideo
  },

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
    // 设置加载状态
    this.setLoading(true)

    const headerMaskRef = this.$parent.$refs['main-header-mask']
    headerMaskRef.style.opacity = 1

    this.setAudioDisplay(false)
    const player = new Player({
      id: 'xgplayer',
      fluid: true,
      videoInit: true,
      //   playbackRate: [0.5, 0.75, 1, 1.5, 2], // 可调整倍数
      //   defaultPlaybackRate: 1, // 默认倍数
      //   download: true, // 设置download控件显示
      //   pip: true, // 小窗口
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
    ...mapMutations(['setAudioDisplay', 'setLoading'])
  },

  computed: {
    // 播放次数改成单位：万
    countConvert () {
      return function (count) {
        return countConvert(count)
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
    box-sizing: border-box;
    width: 84vw;
    height: 100%;
    margin: 24px auto 0;
    display: grid;
    grid-template-columns: 8fr minmax(0, 3fr);
    grid-gap: 24px;

    .m-layout {
      display: none;
    }
    .l-layout {
      display: block;
    }

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
    }
  }

  @media screen and (max-width: 1200px) {
    .video-player-container {
      margin: 16px auto 0;
      padding: 0 16px;
      width: 100%;
    }
  }

  @media screen and (max-width: 968px) {
    .video-player-container {
      padding: 0 16px;
      width: 100%;
      display: block;
      .m-layout {
        display: block;
      }
      .l-layout {
        display: none;
      }
    }
  }
}
</style>
