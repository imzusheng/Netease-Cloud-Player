<!--
    DetailVideo.vue
    mv播放页面的作者信息组件
-->

<template>
  <section class="video-player-author">
    <img
      v-if="userDetail.cover"
      class="author-poster"
      :src="userDetail.cover + '?param=50y50'"
      alt=""
    />
    <div class="author-title">
      <div class="author-title-name">{{ userDetail.name }}</div>
      <div class="author-title-desc" v-if="userDetail.identifyTag">
        {{ userDetail.identifyTag.join("/") }}
      </div>
    </div>
    <div class="author-title-action">
      <button class="author-title-action-btn">关注</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CardAuthor',

  props: {
    userDetail: Object
  }
}
</script>

<style lang="less">
// 作者信息
.video-player-author {
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  // 头像
  .author-poster {
    flex-shrink: 0;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .author-title {
    flex: 1;
    .author-title-name {
      font-size: 16px;
      font-weight: 700;
    }
    .author-title-desc {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .author-title-action {
    display: flex;
    align-items: center;
    .author-title-action-btn {
      border: none;
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.8);
      // background: rgba(240, 0, 0, 1);
      padding: 6px 12px;
      border-radius: 3px;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 968px) {
    & {
      padding: 10px 0;
    }
  }
}
</style>
