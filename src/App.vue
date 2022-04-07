<template>
  <div id="app">
    <router-view />

    <!-- 音乐播放器 -->
    <PlayerAudio />
  </div>
</template>

<script>
import PlayerAudio from '@/components/PlayerAudio'
export default {
  name: 'App',

  components: {
    PlayerAudio
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

.user-not-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

html {
  overflow-y: scroll;
  scrollbar-color: rgba(255, 255, 255, 0.1) rgb(12, 12, 12);
  scrollbar-width: auto;
}

::-webkit-scrollbar {
  width: 14px;
  height: 14px;
  background-color: rgb(12, 12, 12);
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 1px !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
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

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  border: 2px auto;
  border: 2px solid transparent;
  background: transparent;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}
</style>
