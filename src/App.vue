<template>
  <div id="app">
    <router-view />

    <!-- 音乐播放器 -->
    <PlayerAudio />
  </div>
</template>

<script>
import PlayerAudio from '@/components/AudioPlayer/PlayerAudio'
import { mapMutations } from 'vuex'
export default {
  name: 'App',

  components: {
    PlayerAudio
  },

  methods: {
    ...mapMutations(['setColumnCount']),
    // 以下为了监听media变化，动态设置grid布局的列数this.columnCount
    updateColumnMatch () {
      const count = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue('--column-count')
      this.setColumnCount(count)
      // 需要监听的media
      const columnMatch = {
        '(min-width: 1200px)': 6,
        '(min-width: 968px)': 5,
        '(min-width: 728px)': 4,
        '(min-width: 528px)': 3,
        '(min-width: 0)': 2
      }
      const mediaChangeHandle = (e) => {
        const count = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--column-count')
        this.setColumnCount(count)
        // if (e.matches === true) {
        //   this.columnCount = columnMatch[e.media]
        // } else {
        //   this.columnCount = columnMatch[e.media] - 1
        // }
      }
      Object.keys(columnMatch)
        .reverse()
        .forEach((media) => {
          window.matchMedia(media).addEventListener('change', mediaChangeHandle)
        })
    }
  },

  mounted () {
    // 以下为了监听media变化，动态设置grid布局的列数this.columnCount
    this.updateColumnMatch()
  }
}
</script>

<style lang="less">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;

  padding: 0;
  margin: 0;
  color: #fff;
  // font-family: open sans, Helvetica, Arial, sans-serif;
  background: transparent;
  text-decoration: none;
  list-style: none;
  line-height: 1.6;
  z-index: 0;
}

:root {
  // 列间距
  --grid-gap: 24px;
  // 每行的列数
  --column-count: 4;
  // 图片圆角
  --shape-round: 4px;

  @media screen and (max-width: 528px) {
    // 列间距
    --grid-gap: 12px;
    // 每行的列数
    --column-count: 2;
  }

  @media screen and (min-width: 528px) {
    // 列间距
    --grid-gap: 16px;
    // 每行的列数
    --column-count: 3;
  }

  @media screen and (min-width: 728px) {
    // 列间距
    --grid-gap: 18px;
    // 每行的列数
    --column-count: 4;
  }

  @media screen and (min-width: 968px) {
    // 列间距
    --grid-gap: 22px;
    // 每行的列数
    --column-count: 5;
  }

  @media screen and (min-width: 1200px) {
    // 列间距
    --grid-gap: 24px;
    // 每行的列数
    --column-count: 6;
  }
}

html {
  overflow-y: scroll;
  scrollbar-color: rgba(255, 255, 255, 0.1) rgb(12, 12, 12);
  scrollbar-width: auto;
}

img:not([src]) {
  visibility: hidden;
}

#app {
  min-width: 528px;
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 1);
  // padding-bottom: 72px;
  // box-sizing: border-box;
  display: flex;
}

::-webkit-scrollbar {
  width: 14px;
  height: 14px;
  background-color: #121212;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0.3);
}

::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(255, 255, 255, 0.35);
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.35);
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.35);
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: rgba(255, 255, 255, 0.35);
}

.user-not-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
