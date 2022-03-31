<!--
css3全局加载动画
-->
<template>
  <div class="g-loading">
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'G-Loading'
}
</script>

<style lang="less" scoped>
.g-loading {
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  > div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: -50%;
    animation: typing 1s linear infinite;
    // alternate
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 24px 0px 0px 0px rgba(255, 255, 255, 0.2),
      48px 0px 0px 0px rgba(255, 255, 255, 0.2);
  }

  @keyframes typing {
    0% {
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 24px 0px 0px 0px rgba(255, 255, 255, 0.2),
        48px 0px 0px 0px rgba(255, 255, 255, 0.2);
    }
    25% {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 24px 0px 0px 0px rgba(255, 255, 255, 1),
        48px 0px 0px 0px rgba(255, 255, 255, 0.2);
    }
    75% {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 24px 0px 0px 0px rgba(255, 255, 255, 0.2),
        48px 0px 0px 0px rgba(255, 255, 255, 1);
    }
  }
}
</style>
