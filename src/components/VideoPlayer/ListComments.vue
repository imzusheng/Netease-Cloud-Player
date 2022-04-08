<!--
    DetailVideo.vue
    mv播放页面的评论列表组件
-->

<template>
  <section class="video-player-comment">
    <h2 class="video-player-comment-title">{{ comment.total }}条评论</h2>

    <ul class="comment-list">
      <li
        class="comment-list-item"
        v-for="(item, index) in comment.comments"
        :key="`comment-${index}`"
      >
        <img
          :src="item.user.avatarUrl + '?param=50y50'"
          class="comment-avatar"
          alt=""
        />
        <div class="comment-content">
          <div class="comment-content-title">
            {{ item.user.nickname }}
            <span>&nbsp;&nbsp;&nbsp;{{ item.timeStr }}</span>
          </div>
          <div class="comment-content-main">
            <pre>{{ item.content }}</pre>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'ListComments',

  props: {
    comment: Object
  }
}
</script>

<style lang="less">
// 评论
.video-player-comment {
  margin-top: 20px;
  .video-player-comment-title {
    font-size: 18px;
  }

  // ul
  .comment-list {
    padding-bottom: 20px;
    // li
    .comment-list-item {
      display: flex;
      padding: 16px 0;
      .comment-avatar {
        height: 50px;
        width: 50px;
        margin-right: 16px;
        border-radius: 50%;
      }
      .comment-content {
        .comment-content-title {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          > span {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
          }
        }
        .comment-content-main {
          margin-top: 3px;
          pre {
            font-size: 14px;
            color: rgba(255, 255, 255, 1);
            white-space: pre-wrap;
            word-wrap: break-word;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
