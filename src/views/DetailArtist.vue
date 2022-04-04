<template>
  <main id="artist">
    <!-- 海报 -->
    <div
      class="under-poster"
      ref="under-poster"
      :style="{ '--poster-url': artistnPoster }"
    ></div>

    <!-- 海报褪色滤镜 -->
    <div class="under-poster-mask"></div>

    <!-- 海报遮罩 -->
    <div class="under-poster-mask-trans" ref="under-poster-mask-trans"></div>

    <!-- 歌手信息 -->
    <div class="artist-info">
      <!-- 隔离层 -->
      <div class="artist-info-spacing">
        <!-- 信息容器 -->
        <div class="artist-info-main">
          <span class="artist-info-type">入住艺人</span>
          <span class="artist-info-name">{{ artistnName }}</span>
          <span class="artist-info-follower">每月有 1,148,445 名听众</span>
        </div>
      </div>
    </div>
    <div class="artist-playlist">
      <div class="artist-playlist-mask"></div>
      <div class="artist-playlist-bg"></div>
      <div class="artist-playlist-main">
        <section class="section-hot-song">
          <h2>热门</h2>
          <ul class="hot-song-table">
            <li
              class="table-row"
              v-for="(listItem, listIndex) in tableData.hotSongs"
              :key="`detailArtist-${listIndex}`"
            >
              <!-- 序号 -->
              <div class="table-cell-index">
                <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
                <span class="playlist-table-icon">
                  <svg
                    class="icon-play"
                    height="32"
                    role="img"
                    width="32"
                    viewBox="0 0 24 24"
                  >
                    <polygon
                      points="21.57 12 5.98 3 5.98 21 21.57 12"
                      fill="currentColor"
                    ></polygon>
                  </svg>
                </span>
              </div>
              <!-- 歌曲名字和作者 -->
              <div class="table-cell-desc">
                <img
                  class="table-cell-desc-pic"
                  ref="lazyload-img"
                  :data-pic-src="listItem.al.picUrl"
                  alt=""
                />
                <div class="table-cell-desc-info">
                  <!-- 歌名 -->
                  <div class="table-desc-name">
                    <span :title="listItem.name" class="table-cell-ellipsis">
                      {{ listItem.name }}</span
                    >
                    <!-- vip图标 -->
                    <img
                      v-if="![0, 8].includes(listItem.fee)"
                      class="table-cell-desc-vip"
                      src="../assets/vip.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <!-- 专辑名 -->
              <div class="table-cell-ellipsis">
                <div
                  :title="listItem.al.name"
                  style="display: block"
                  class="table-cell-ellipsis"
                >
                  {{ listItem.al.name }}
                </div>
              </div>
              <!-- 时长 -->
              <div>{{ getSongDt(listItem.dt) }}</div>
            </li>
          </ul>
          <a href="#" class="more-hotSongs">查看更多</a>
        </section>
        <SectionList :title="'专辑'" :listData="tableData.hotAlbums" />
        <SectionList :title="'MV'" :listData="tableData.mvs" />
        <SectionList :title="'粉丝也喜欢'" :listData="tableData.mvs" />
      </div>
    </div>
  </main>
</template>

<script>
import moment from 'moment'
import { getMainColor } from '@/util'
import { mapActions, mapMutations } from 'vuex'
import SectionList from '@/components/SectionList.vue'

// 滚动条参数
const refs = {
  artistPlaylistRef: undefined,
  headerMaskRef: undefined,
  MaskTransRef: undefined,
  underPosterRef: undefined
}
// 监听滚动条
const scrollHandle = () => {
  const { artistPlaylistRef, underPosterRef, MaskTransRef, headerMaskRef } =
    refs
  const curScrollTop = document.documentElement.scrollTop
  const targetHeight = artistPlaylistRef.offsetTop - 68
  if (targetHeight < 0) return
  let curValue
  if (targetHeight > curScrollTop) {
    curValue = 1 - (targetHeight - curScrollTop) / targetHeight
  } else {
    curValue = 1
  }
  curValue = curValue.toFixed(3)
  underPosterRef.style.transform = `scale(${1.05 - 0.05 * curValue})`
  MaskTransRef.style.opacity = curValue * 1.5 > 1 ? 1 : curValue * 1.5
  headerMaskRef.style.opacity = curValue
}

export default {
  name: 'DetailArtist',

  components: {
    SectionList
  },

  data () {
    return {
      tit: '哈哈',
      ...mapMutations(['setLoading', 'setCurPlaylistColor']),
      ...mapActions([
        'getArtistDetail',
        'getArtistFans',
        'getArtistSong',
        'getArtistALBUM',
        'getArtistMV'
      ]),

      tableData: {
        hotSongs: [],
        hotAlbums: [],
        mvs: []
      },

      artistInfo: {}
    }
  },

  methods: {
    // 实现图片懒加载
    lazyLoadimg () {
      // IntersectionObserver
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
          if (item.intersectionRatio > 0) {
            item.target.src = item.target.getAttribute('data-pic-src')
            intersectionObserver.unobserve(item.target)
          }
        })
      })
      // dom更新完成 开始观察
      this.$nextTick(function () {
        this.$refs['lazyload-img'].forEach((ele) =>
          intersectionObserver.observe(ele)
        )
      })
    }
  },

  created () {
    this.setLoading(true)
    // 获取id
    const { id } = this.$route.query
    // 获取歌手信息
    this.getArtistDetail(id).then(async (res) => {
      this.artistInfo = res.data
      const color = await getMainColor(res.data.artist.cover)
      this.setCurPlaylistColor(color)
      // 获取专辑、MV等其余所有数据
      Promise.all([
        this.getArtistSong(id),
        this.getArtistALBUM(id),
        this.getArtistMV(id)
      ]).then((resArr) => {
        resArr.forEach((res) => {
          this.tableData[res.type] = res.data
        })
        // 懒加载
        this.lazyLoadimg()
        this.setLoading(false)
      })
    })
  },

  mounted () {
    refs.artistPlaylistRef = document.querySelector('.artist-playlist')
    refs.headerMaskRef = this.$parent.$refs['main-header-mask']
    refs.MaskTransRef = this.$refs['under-poster-mask-trans']
    refs.underPosterRef = this.$refs['under-poster']
    // 滑动动画
    document.addEventListener('scroll', scrollHandle)
  },

  computed: {
    artistType () {
      if (this.artistInfo?.artist) return this.artistInfo.artist.identifyTag[0]
      else return ''
    },
    artistnName () {
      return this.artistInfo.artist?.name || ''
    },
    artistnPoster () {
      return `url(${this.artistInfo.artist?.cover || ''})`
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
    }
  },

  // 离开时清理一下
  beforeRouteLeave (to, from, next) {
    // 恢复背景色为黑色
    this.setCurPlaylistColor('0, 0, 0, 1')
    // 删除监听
    document.removeEventListener('scroll', scrollHandle)
    next()
  }
}
</script>

<style lang="less" scoped>
#artist {
  --background-noise: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
  height: 100%;
  position: relative;
  --poster-url: url("");
  .under-poster,
  .under-poster-mask,
  .under-poster-mask-trans {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    // min-height: 340px;
    // max-height: 500px;
  }
  // 歌手封面
  .under-poster {
    // background: url("https://i.scdn.co/image/ab676186000010165883f9c0c5865d49b13d75c3")
    //   center 0 no-repeat;
    background: var(--poster-url) center center no-repeat;
    background-size: auto 100%;
    transform: scale(1.05);
  }
  .under-poster-mask {
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
      var(--background-noise);
  }
  .under-poster-mask-trans {
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    background-color: rgba(var(--color-playlist));
    opacity: 0;
  }

  // 歌手信息
  .artist-info {
    height: 100vh;
    // min-height: 340px;
    // max-height: 500px;
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
        .artist-info-type {
          font-size: 16px;
        }
        .artist-info-name {
          width: 100%;
          font-size: 96px;
          line-height: 96px;
          font-weight: 900;
          margin: 10px 0;
        }
        .artist-info-follower {
          font-size: 16px;
          line-height: 2;
          margin-top: 4px;
        }
      }
    }
  }

  // 歌单等信息
  .artist-playlist {
    width: 100%;
    position: relative;
    .artist-playlist-mask {
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), #121212 100%),
        var(--background-noise);
      height: 232px;
      position: absolute;
      width: 100%;
      z-index: 1;
      background-color: rgba(var(--color-playlist));
    }
    .artist-playlist-bg {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background: #121212;
    }

    .artist-playlist-main {
      height: 100%;
      position: relative;
      z-index: 2;
      padding: 52px;
      box-sizing: border-box;
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
        }
      }
    }
  }
}
</style>
