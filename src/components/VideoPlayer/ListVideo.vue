<!--
    DetailVideo.vue
    mv播放页面的推荐视频列表组件
-->

<template>
  <section class="video-player-similar">
    <h2 class="similar-h2">推荐视频</h2>
    <ul class="similar-list">
      <li
        @click="toMv(item.id)"
        class="similar-list-item"
        v-for="(item, index) in mvs"
        :key="`mvs-${index}`"
      >
        <div class="similar-list-item-bg">
          <div class="similar-item-poster-spacing">
            <img
              class="similar-item-poster"
              :src="item.cover + '?param=200y150'"
              alt=""
            />
            <span class="duration">{{ getDuration(item.duration) }}</span>
          </div>
          <div class="similar-info">
            <div class="similar-info-name">{{ item.name }}</div>
            <div class="similar-info-desc">
              <span>{{ getPlayCount(item.playCount) }}次观看</span>
              <span>{{ item.artistName }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { durationConvert, countConvert } from '@/util'

export default {
  name: 'ListVideo',

  props: {
    mvs: Array
  },

  methods: {
    toMv (id) {
      this.$router.push({
        name: 'mv',
        query: {
          id
        }
      })
    }
  },

  computed: {
    getPlayCount () {
      return function (count) {
        return countConvert(count)
      }
    },
    getDuration () {
      return function (time) {
        return durationConvert(time)
      }
    }
  }
}
</script>

<style lang="less">
.video-player-similar {
  padding: 10px 0 10px;
  .similar-h2 {
    font-size: 16px;
    margin: 10px 0 6px;
  }

  // ul
  .similar-list {
    margin: 0 -5px;
    // li
    .similar-list-item {
      box-sizing: border-box;
      padding: 5px;
      cursor: pointer;
      .similar-list-item-bg {
        display: flex;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background: #181818;
        box-sizing: border-box;
        padding: 10px;
        &:hover {
          background: rgba(39, 39, 39, 1);
        }
      }
      // 封面
      .similar-item-poster-spacing {
        width: 40%;
        flex-shrink: 0;
        object-fit: cover;
        margin-right: 10px;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          background: linear-gradient(
            rgba(0, 0, 0, 0) 0,
            rgba(0, 0, 0, 0.6) 100%
          );
        }
        .duration {
          position: absolute;
          right: 4px;
          bottom: 0;
          z-index: 2;
          font-size: 12px;
        }
        .similar-item-poster {
          width: 100%;
          height: 100%;
        }
      }
      .similar-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .similar-info-name {
          font-size: 13px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .similar-info-desc {
          display: flex;
          width: 100%;
          justify-content: space-between;
          > span {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
  @media screen and (max-width: 968px) {
    // ul
    .similar-list {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -5px;
      // li
      .similar-list-item {
        width: 50%;
        padding: 5px;
      }
    }
  }
}
</style>
