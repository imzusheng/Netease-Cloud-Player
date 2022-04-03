<!--
css3全局加载动画
-->
<template>
  <div class="circle-loading">
    <div class="circle-spinner">
      <svg class="circular" viewBox="25 25 50 50">
        <circle
          class="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="2"
          stroke-miterlimit="10"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'circle-Loading'
}
</script>

<style lang="less" scoped>
.circle-loading {
  position: relative;
  z-index: 999;
  max-width: 100px;
  max-height: 100px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .circle-spinner {
    width: 100%;
    height: 100%;
    animation: rotate 2s linear infinite;
    .path {
      stroke: #fff;
      animation: dash 1.5s ease-in-out infinite;
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      // stroke-linecap: round;
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
