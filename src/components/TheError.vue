<!--
    错误提示组件
-->
<template>
  <div id="error-page">
    <div class="error-page-content">
      <svg
        class="error-icon"
        role="img"
        height="64"
        width="64"
        viewBox="0 0 24 24"
      >
        <path d="M11 18v-2h2v2h-2zm0-4V6h2v8h-2z"></path>
        <path
          d="M12 3a9 9 0 100 18 9 9 0 000-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"
        ></path>
      </svg>
      <h2 class="error-msg">{{ $store.state.error.msg }}</h2>
      <button class="error-back" @click="goBack">返回上一页</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheError',

  methods: {
    goBack () {
      this.$store.commit('setError', {
        status: false
      })
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
#error-page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .error-page-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .error-icon {
      fill: rgba(255, 255, 255, 0.9);
    }
    .error-msg {
      margin-top: 6px;
      font-size: 36px;
    }
    .error-back {
      margin-top: 24px;
      padding: 8px 16px;
      border-radius: 50px;
      border: none;
      color: #fff;
      cursor: pointer;
      background: rgba(240, 0, 0, 1);
    }
  }
}
</style>
