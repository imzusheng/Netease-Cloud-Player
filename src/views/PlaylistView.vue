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
          >
            <div>{{ listIndex + 1 }}</div>
            <div class="table-cell-desc">
              <img :src="listItem.al.picUrl" alt="" />
              <div>
                <div>{{ listItem.name }}</div>
                <div>{{ getName(listItem.ar) }}</div>
              </div>
            </div>
            <div>{{ listItem.al.name }}</div>
            <div>{{ getPubTime(listItem.publishTime) }}</div>
            <div>{{ getSongDt(listItem.dt) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { pickUpName } from '@/util'
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
    getMainColor (data) {
      const temp = {}
      const len = data.length

      let max = 0
      let color = ''
      let i = 0
      while (i < len) {
        if (data[i + 3] !== 0) {
          const k = `${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${
            data[i + 3] / 255
          }`
          temp[k] = temp[k] ? temp[k] + 1 : 1
          if (temp[k] > max) {
            max = temp[k]
            color = k
          }
        }
        i += 4
      }
      return color
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
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 200
        canvas.height = 200
        const img = new Image()
        img.setAttribute('crossOrigin', '')
        img.src = imgSrc
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 200, 200)
          const data = ctx.getImageData(0, 0, 200, 200).data
          const color = this.getMainColor(data)
          const rgb = color.split(',')
          let r = parseInt(rgb[0])
          let g = parseInt(rgb[1])
          let b = parseInt(rgb[2])
          if (r > 200 || g > 200 || b > 200) {
            r -= 80
            g -= 80
            b -= 80
          } else if (r > 150 || g > 150 || b > 150) {
            r -= 40
            g -= 40
            b -= 40
          } else if (r < 50 || g < 50 || b < 50) {
            r += 80
            g += 80
            b += 80
          }
          this.$store.state.curPlaylistColor = `${r}, ${g}, ${b}, 1`
        }
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
      //   z-index: -1;
    }
    .playlist-content-main {
      min-height: 300px;
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
          > div {
            display: flex;
            align-items: center;
            padding: 16px 0;
            &:last-child {
              justify-content: flex-end;
              margin-right: 32px;
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
