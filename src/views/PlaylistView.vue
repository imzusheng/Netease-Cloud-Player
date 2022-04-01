<template>
  <div id="playlist">
    <!-- 歌曲信息 banner -->
    <div class="playlist-banner" ref="playlist-banner">
      <div class="playlist-banner-content">
        <div class="playlist-banner-poster">
          <img :src="$store.getters.playlistPicUrl" alt="" />
        </div>
        <div class="playlist-banner-desc">
          <h2>{{ $store.getters.playlistTags }}</h2>
          <h1 class="playlist-episodeTitle">
            <span>{{ $store.getters.playlistName }}</span>
          </h1>
          <a draggable="false" href="#">
            <span>{{ $store.getters.playlistCreatorName }}</span>
          </a>
        </div>
        <div></div>
      </div>
    </div>
    <div class="playlist-content">
      <!-- 颜色过渡遮罩 -->
      <div class="playlist-content-mask" ref="playlist-content-mask"></div>
      <!-- 歌单列表 -->
      <div class="playlist-content-main">
        <div class="playlist-content-action">
          <div>
            <button>
              <svg
                role="img"
                height="28"
                width="28"
                viewBox="0 0 24 24"
                class="Svg-sc-1bi12j5-0 jgfuCe"
              >
                <path
                  d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 列表标题 -->
        <div class="playlist-table-title" ref="playlist-table-title">
          <div>#</div>
          <div>标题</div>
          <div>专辑</div>
          <div>发布时间</div>
          <div>时长</div>
        </div>
        <!-- 表格 -->
        <ul class="playlist-table-content">
          <li
            v-for="(listItem, listIndex) in $store.state.curPlaylist.tracks"
            :key="`playlist${listIndex}`"
            @click="playlistSelect(listItem)"
          >
            <!-- <input type="radio" /> -->
            <!-- 序号 -->
            <div class="table-cell-index">
              <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
              <span class="playlist-table-icon">
                <svg
                  height="32"
                  role="img"
                  width="32"
                  viewBox="0 0 24 24"
                  class="UIBT7E6ZYMcSDl1KL62g"
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
              <img :src="listItem.al.picUrl" alt="" />
              <div>
                <div>{{ listItem.name }}</div>
                <div>{{ getName(listItem.ar) }}</div>
              </div>
            </div>
            <!-- 专辑名 -->
            <div>{{ listItem.al.name }}</div>
            <!-- 发布时间 -->
            <div>{{ getPubTime(listItem.publishTime) }}</div>
            <!-- 时长 -->
            <div>{{ getSongDt(listItem.dt) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { pickUpName, getMainColor } from '@/util'
import moment from 'moment'

let playlistMaskRef
let playlistBannerRef
let headerMaskRef
let playlistTitleRef
let targetHeight
// 卸载外面是为了退出页面时移除监听 removeEventListener
const scrollHandle = () => {
  const curScrollTop = document.documentElement.scrollTop
  let curValue, curBgColor
  if (targetHeight > curScrollTop) {
    curValue = 1 - (targetHeight - curScrollTop) / targetHeight
    curBgColor = `rgba(24,24,24,${curValue})`
  } else {
    curValue = 1
    curBgColor = `rgba(24,24,24,${1})`
  }
  headerMaskRef.style.opacity = curValue
  playlistTitleRef.style.backgroundColor = curBgColor
}

export default {
  name: 'PlaylistView',

  data () {
    return {}
  },
  mounted () {
    const { id } = this.$route.query
    this.$store.dispatch('getPlaylistDetail', id)

    playlistMaskRef = this.$refs['playlist-content-mask']
    playlistBannerRef = this.$refs['playlist-banner']
    headerMaskRef = this.$parent.$refs['main-header-mask']
    playlistTitleRef = this.$refs['playlist-table-title']
    // 动画长度 = banner区域高度 + 遮罩高度 - 顶部栏高度
    targetHeight =
      playlistBannerRef.clientHeight + playlistMaskRef.clientHeight - 68
    // 监听滚动条事件 目的为了驱动header遮罩透明度变化
    document.addEventListener('scroll', scrollHandle)
  },

  methods: {
    playlistSelect (data) {
      this.$store.dispatch('selectSong', data.id)
    }
  },

  computed: {
    getName () {
      return function (name) {
        return pickUpName(name)
      }
    },
    getPubTime () {
      return function (time) {
        if (!time) return '未知'
        else return moment(time).format('YYYY')
      }
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

  watch: {
    '$store.getters.playlistPicUrl': {
      handler (imgSrc) {
        getMainColor(imgSrc).then(color => {
          this.$store.state.curPlaylistColor = color
        })
      }
    }
  },

  // 离开时清理一下垃圾
  beforeRouteLeave (to, from, next) {
    this.$store.state.curPlaylistColor = '0, 0, 0, 1'
    this.$store.state.curPlaylist = {}
    document.removeEventListener('scroll', scrollHandle)
    next()
  }
}
</script>

<style lang="less" scoped>
#playlist {
  width: 100%;
  box-sizing: border-box;
  .playlist-banner {
    width: 100%;
    height: 30vh;
    max-height: 500px;
    min-height: 340px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
    }
    .playlist-banner-content {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 32px 52px;
      display: flex;
      align-items: flex-end;
      .playlist-banner-poster {
        width: 200px;
        height: 200px;
        flex-shrink: 0;
        margin-right: 32px;
        border-radius: 16px;
        box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .playlist-banner-desc {
        .playlist-episodeTitle {
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          overflow: hidden;
          margin-bottom: 16px;
          span {
            font-size: 48px;
            line-height: 48px;
            font-weight: 800;
          }
        }
        h2 {
          font-size: 16px;
          margin-bottom: 16px;
          font-weight: 400;
        }
        a {
          font-size: 24px;
          line-height: 24px;
          font-weight: 400;
        }
      }
    }
  }
  .playlist-content {
    width: 100%;
    padding-bottom: 16px;
    position: relative;
    background: rgb(18, 18, 18);
    .playlist-content-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(var(--color-playlist));
      height: 232px;
      transition: background 0.65s;
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgb(18, 18, 18));
      z-index: -1;
    }
    .playlist-content-main {
      min-height: 300px;
      // 播放栏
      .playlist-content-action {
        box-sizing: border-box;
        padding: 32px 52px;
        * {
          color: rgba(240, 240, 240, 1);
        }
        > div {
          button {
            width: 56px;
            height: 56px;
            border: none;
            outline: none;
            box-shadow: none;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(240, 0, 0, 1);
            > svg {
              fill: currentColor;
            }
          }
        }
      }
      // 表格标题
      .playlist-table-title {
        position: sticky;
        top: 67px;
        display: grid;
        grid-gap: 16px;
        grid-template-columns:
          [index] 16px
          [first] 6fr
          [var1] 4fr
          [var2] 3fr
          [last] minmax(120px, 1fr);
        background: transparent;
        z-index: 2;
        padding: 0 68px;
        border-bottom: 1px solid rgba(200, 200, 200, 0.2);
        > div {
          padding: 12px 0;
          color: #b3b3b3;
          font-size: 16px;
          &:last-child {
            text-align: right;
            margin-right: 32px;
          }
        }
      }
      // 表格主体
      .playlist-table-content {
        padding: 0 52px;
        > li {
          * {
            color: #b3b3b3;
          }
          display: grid;
          grid-gap: 16px;
          grid-template-columns:
            [index] 16px
            [first] 6fr
            [var1] 4fr
            [var2] 3fr
            [last] minmax(120px, 1fr);
          padding: 0 16px;
          border-radius: 6px;
          cursor: pointer;
          // li > div
          > div {
            display: flex;
            align-items: center;
            padding: 16px 0;
            &:last-child {
              justify-content: flex-end;
              margin-right: 32px;
            }
          }
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
          &:hover {
            background: rgb(60, 60, 60);
            .playlist-table-index {
              display: none;
            }
            .playlist-table-icon {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          // 歌曲信息
          .table-cell-desc {
            img {
              height: 54px;
              width: 54px;
              margin-right: 18px;
            }
            > div {
              display: grid;
              grid-template: "title title" "badges subtitle" / auto 1fr;
              > div {
                &:first-child {
                  grid-area: title;
                  font-size: 16px;
                  color: #fff;
                }
                &:last-child {
                  grid-column-start: badges;
                  grid-area: subtitle;
                  font-size: 15px;
                  color: #b3b3b3;
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
