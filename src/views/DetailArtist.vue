<template>
  <main
    id="artist"
    :style="{ '--audio-height': $store.state.audioDisplay ? '72px' : '0px' }"
  >
    <!-- 海报 -->
    <div
      ref="under-poster"
      :style="{ '--poster-url': artistnPoster }"
      class="under-poster"
    ></div>

    <!-- 海报褪色滤镜 -->
    <div class="under-poster-mask"></div>

    <!-- 海报遮罩 -->
    <div ref="under-poster-mask-trans" class="under-poster-mask-trans"></div>

    <!-- 歌手信息 -->
    <div class="artist-info">
      <!-- 隔离层 -->
      <div class="artist-info-spacing">
        <!-- 信息容器 -->
        <div class="artist-info-main">
          <span class="artist-info-name">{{ artistName }}</span>
          <span :title="artistTags" class="artist-info-type">{{
            artistTags
          }}</span>
        </div>
      </div>
    </div>

    <!-- 歌单列表 -->
    <div class="artist-playlist">
      <div class="artist-playlist-main">
        <!-- 操作按钮 -->
        <div class="artist-playlist-action">
          <div class="artist-playlist-action-content">
            <button
              aria-label="播放全部"
              class="action-btn-play"
              @click="actionPlayAll"
            >
              <svg height="28" role="img" viewBox="0 0 24 24" width="28">
                <path
                  d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"
                ></path>
              </svg>
            </button>
            <button aria-label="关注" class="action-btn-subscribe">
              {{ artistFansCnt }}
            </button>
          </div>
        </div>

        <!-- 热门歌曲 -->
        <section class="section-hot-song">
          <h2>热门</h2>
          <table-songs :songs="getHotSongs" size="L"/>
          <span
            class="more-hotSongs"
            href="#"
            @click="hotSongsDisplay = !hotSongsDisplay"
            v-html="hotSongsDisplay ? '收起' : '查看更多'"
          ></span>
        </section>

        <SectionListGrid
          :args="args"
          :listData="tableData.hotAlbums"
          :title="'专辑'"
          action="getArtistALBUM"
        />

        <SectionListGrid
          :args="args"
          :listData="tableData.mvs"
          :title="'MV'"
          action="getArtistMV"
        />

        <SectionListGrid
          :args="args"
          :listData="tableData.video"
          :round="false"
          :title="'视频'"
          action="getArtistVideo"
        />

        <SectionListGrid
          :args="args"
          :listData="tableData.simi"
          :round="true"
          :title="'粉丝也喜欢'"
          action="getArtistALBUM"
        />
      </div>
    </div>
  </main>
</template>

<script>
import moment from 'moment'
import { getMainColor, throttle } from '@/util'
import { mapActions, mapMutations } from 'vuex'
import TableSongs from '@/components/TableSongs'
import SectionListGrid from '@/components/SectionListGrid.vue'

// 滚动条参数
const refs = {
  artistPlaylistRef: undefined,
  headerMaskRef: undefined,
  MaskTransRef: undefined,
  underPosterRef: undefined
}

// 监听滚动条
const scrollHandle = () => {
  const curScrollTop = document.documentElement.scrollTop
  let curValue
  if (refs.targetHeight > curScrollTop) {
    curValue = 1 - (refs.targetHeight - curScrollTop) / refs.targetHeight
  } else {
    curValue = 1
  }
  curValue = curValue.toFixed(3)
  refs.underPosterRef.style.transform = `scale(${1.05 - 0.05 * curValue})`
  refs.MaskTransRef.style.opacity = curValue * 1.7 > 1 ? 1 : curValue * 1.7
  refs.headerMaskRef.style.opacity = curValue
}

// 防抖
const throttleScrollHandle = throttle(scrollHandle, 1000 / 60)

export default {
  name: 'DetailArtist',

  components: {
    SectionListGrid,
    TableSongs
  },

  data () {
    return {
      // 参数
      args: {
        id: '',
        more: 1
      },

      tableData: {
        mvs: [],
        simi: [],
        fans: {},
        video: [],
        hotSongs: [],
        hotAlbums: []
      },

      artistInfo: {},

      // 是否显示全部50首热门歌曲
      hotSongsDisplay: false
    }
  },

  methods: {
    ...mapMutations([
      'setTips',
      'setLoading',
      'setCurPlaylistColor',
      'setCurSongid',
      'pushPlayQueue'
    ]),
    ...mapActions([
      'getArtistDetail',
      'getArtistALBUM',
      'getArtistVideo',
      'getArtistFans',
      'getArtistSong',
      'getArtistSimi',
      'getArtistMV'
    ]),
    playSong (id) {
      this.setCurSongid(id)
    },
    // 加载全部歌曲到列表
    actionPlayAll () {
      // 清空先前的播放列表
      this.setTips('添加到播放队列')
      this.pushPlayQueue(null)
      this.pushPlayQueue(this.tableData.hotSongs)
      const curSongid = localStorage.getItem('songid')
      const lastSongid = this.tableData.hotSongs[0].id
      if (curSongid !== lastSongid.toString()) {
        this.setCurSongid(lastSongid)
      }
    }
  },

  mounted () {
    refs.headerMaskRef = this.$parent.$refs['main-header-mask']
    refs.MaskTransRef = this.$refs['under-poster-mask-trans']
    refs.underPosterRef = this.$refs['under-poster']
    refs.targetHeight = document.documentElement.clientHeight - 68
    refs.headerMaskRef.style.opacity = 0

    this.setLoading(true)
    // 获取id
    const { id } = this.$route.query
    this.args.id = id
    // 获取歌手信息
    this.getArtistDetail(id).then(async (res) => {
      // 获取主题颜色
      const color = await getMainColor(res.data.artist.cover)
      // 设置主题颜色
      this.setCurPlaylistColor(color)
      this.$nextTick(() => {
        // 获取专辑、MV等其余所有数据
        Promise.allSettled([
          this.getArtistSong(id),
          this.getArtistFans(id),
          this.getArtistMV(this.args),
          this.getArtistSimi(this.args),
          this.getArtistALBUM(this.args),
          this.getArtistVideo(this.args)
        ]).then((resArr) => {
          this.artistInfo = res.data
          resArr.forEach(({ status, value: res }) => {
            if (status === 'fulfilled') {
              this.tableData[res.type] = res.data
            }
          })
          this.setLoading(false)
        })
      })
    })
    // 滑动动画
    document.addEventListener('scroll', throttleScrollHandle)
  },

  computed: {
    artistType () {
      if (this.artistInfo?.artist) return this.artistInfo.artist.identifyTag[0]
      else return ''
    },
    artistName () {
      return this.artistInfo.artist?.name || ''
    },
    artistTags () {
      // const tags = this.artistInfo.identify?.imageDesc
      const tags = this.artistInfo.artist?.briefDesc
      return tags ?? ''
    },
    // 粉丝数量
    artistFansCnt () {
      const num = this.tableData.fans?.fansCnt

      function fun (num) {
        if (Number(num) > 10000) {
          return (num / 10000).toFixed(1) + '万'
        } else {
          return num
        }
      }

      return num ? '订阅 ' + fun(num) : ''
    },
    artistnPoster () {
      return this.artistInfo.artist?.cover
        ? `url(${this.artistInfo.artist?.cover + '?param=1600y1200'})`
        : null
    },
    getSongDt () {
      return function (time) {
        const _moment = moment.duration(time)
        return `${
          _moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()
        }:${
          _moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()
        }`
      }
    },
    getHotSongs () {
      const count = this.hotSongsDisplay ? 50 : 5
      this.lazyLoadimg()
      return this.tableData.hotSongs.slice(0, count)
    }
  },

  // 离开时清理一下
  beforeRouteLeave (to, from, next) {
    // 删除监听
    document.removeEventListener('scroll', throttleScrollHandle)
    // 恢复背景色为黑色
    this.setCurPlaylistColor('12, 12, 12, 1')
    this.setLoading(true)
    next()
  }
}
</script>

<style lang="less">
#artist {
  --audio-height: 72px;
  --background-noise: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
  height: 100%;
  position: relative;
  .under-poster,
  .under-poster-mask,
  .under-poster-mask-trans {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: calc(100vh - var(--audio-height));
    // min-height: 340px;
    // max-height: 500px;
  }
  // 歌手封面
  .under-poster {
    // background: url("https://i.scdn.co/image/ab676186000010165883f9c0c5865d49b13d75c3")
    //   center 0 no-repeat;
    background: var(--poster-url) center center no-repeat;
    background-size: 100% auto;
    transform: scale(1.05);
  }
  .under-poster-mask {
    // background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
    //   var(--background-noise);
    background-image: linear-gradient(
      rgba(0, 0, 0, 0.3) 0,
      rgba(0, 0, 0, 0.6) 100%
    );
    background-color: var(--background-noise);
  }
  .under-poster-mask-trans {
    background-color: rgba(var(--color-playlist));
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    opacity: 0;
  }

  // 歌手信息
  .artist-info {
    height: calc(100vh - var(--audio-height));
    .artist-info-spacing {
      display: flex;
      align-items: flex-end;
      box-sizing: border-box;
      height: 100%;
      padding: 32px 52px;
      .artist-info-main {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
        border-left: 6px solid #fff;
        padding-left: 24px;
        box-sizing: border-box;
        .artist-info-name {
          width: 100%;
          font-size: 96px;
          line-height: 96px;
          font-weight: 900;
          margin-bottom: 24px;
        }
        .artist-info-type {
          font-size: 16px;
          line-height: 2;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          overflow: hidden;
        }
      }
    }
  }

  // 歌单等信息
  .artist-playlist {
    width: 100%;
    position: relative;

    .artist-playlist-main {
      height: 100%;
      position: relative;
      z-index: 2;
      padding: 0 52px 72px;
      box-sizing: border-box;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #121212;
        z-index: -2;
      }
      &::before {
        content: "";
        position: absolute;
        height: 232px;
        top: 0;
        left: 0;
        right: 0;
        background-color: rgba(var(--color-playlist));
        background-image: linear-gradient(rgba(0, 0, 0, 0.6), #121212 100%),
          var(--background-noise);
        z-index: -1;
      }
      // 播放栏
      .artist-playlist-action {
        box-sizing: border-box;
        padding: 32px 0 32px;
        * {
          color: rgba(240, 240, 240, 1);
        }
        .artist-playlist-action-content {
          display: flex;
          align-items: center;
          .action-btn-play {
            border: none;
            outline: none;
            box-shadow: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 32px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: rgba(240, 0, 0, 1);
          }
          .action-btn-subscribe {
            padding: 6px 16px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            cursor: pointer;
          }
        }
      }
      section {
        margin-bottom: 40px;
        > h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        // ul
        .hot-song-table {
          * {
            color: #b3b3b3;
            font-size: 14px;
          }
          // li
          .table-row {
            display: grid;
            grid-gap: 16px;
            grid-template-columns:
              [index] 16px
              [name] 6fr
              [al] 4fr
              [last] minmax(120px, 1fr);
            padding: 0 16px;
            border-radius: 6px;
            cursor: pointer;
            // li > div
            > div {
              display: flex;
              align-items: center;
              padding: 4px 0;
              &:last-child {
                justify-content: flex-end;
                margin-right: 32px;
              }
            }
            // index单元格
            .table-cell-index {
              justify-content: center;
              align-items: center;
              .playlist-table-index {
                display: block;
              }
              .playlist-table-icon {
                display: none;
                > svg {
                  width: 16px;
                  height: 16px;
                }
              }
            }
            // 歌曲信息
            .table-cell-desc {
              // 歌曲封面
              .table-cell-desc-pic {
                height: 54px;
                width: 54px;
                flex-shrink: 0;
                margin-right: 5px;
                padding: 5px;
                box-sizing: border-box;
              }
              // 歌曲名 和 歌手
              .table-cell-desc-info {
                .table-desc-name {
                  grid-area: title;
                  color: #fff;
                  display: flex;
                  align-items: center;
                  > span {
                    font-size: 15px;
                    color: #fff;
                    font-weight: 600;
                  }
                  .table-cell-desc-vip {
                    height: 32px;
                    width: 32px;
                    margin-left: 4px;
                  }
                }
              }
            }
            // hover样式
            &:hover {
              background: rgba(255, 255, 255, 0.1);
              .playlist-table-index {
                display: none;
              }
              .playlist-table-icon {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .table-desc-name {
                text-decoration: underline;
              }
            }
            // 需要省略的格子
            .table-cell-ellipsis {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          // 正在播放的歌曲样式
          .playing {
            background: rgb(60, 60, 60);
            .playlist-table-index {
              display: none !important;
            }
            .playlist-table-icon {
              display: flex !important;
              align-items: center;
              justify-content: center;
              .icon-pause {
                display: none;
              }
              .icon-equaliser {
                display: block;
              }
            }
            &:hover {
              .playlist-table-icon {
                .icon-pause {
                  display: block;
                }
                .icon-equaliser {
                  display: none;
                }
              }
            }
          }
        }

        .more-hotSongs {
          display: block;
          font-size: 14px;
          color: #b3b3b3;
          margin-top: 24px;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
