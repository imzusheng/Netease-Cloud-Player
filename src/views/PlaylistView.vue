<template>
  <div id="playlist">
    <div class="playlist-banner">
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
      <div class="playlist-content-mask"></div>
      <di class="playlist-content-main">123321</di>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaylistView',

  data () {
    return {}
  },

  mounted () {
    const { id } = this.$route.query
    this.$store.dispatch('getPlaylistDetail', id)
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
    min-height: 1000px;
    position: relative;
    background: #121212;
    .playlist-content-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(var(--color-playlist));
      height: 232px;
      transition: background 0.65s;
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), #121212);
      //   background-color: rgb(8, 64, 64);
      //   background-color: rgb(152, 64, 64);
    }
    .playlist-content-main {
      position: sticky;
      top: 68px;
      z-index: 2;
    }
  }
}
</style>
