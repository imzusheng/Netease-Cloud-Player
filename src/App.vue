<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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

img:not([src]) {
  visibility: hidden;
}

#app {
  min-width: 568px;
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 1);
  padding-bottom: 72px;
  box-sizing: border-box;
  display: flex;
}

// * {
//   scrollbar-width: thin;
// }

// *::-webkit-scrollbar {
//   width: 10px;
// }

// *::-webkit-scrollbar-thumb {
//   background: rgba(100, 100, 100, 0.7);
//   border-radius: 1px;
// }
</style>
