<!--
  播放队列页面
-->

<template>
  <div id="play-queue">
    <div class="play-queue-spacing">
      <div class="play-queue-title">
        <h1>播放队列</h1>
        <div class="play-queue-subtitle">
          <h2 v-if="playQueue().length > 0">共{{ playQueue().length }}首</h2>
          <h2 v-else>在歌单中点击“加入队列”便可在此查看内容</h2>
          <div class="clear-queue" @click="clearQueue">清空队列</div>
        </div>
      </div>
      <main class="play-queue-main">
        <!-- 表格 -->
        <ul v-if="playQueue().length > 0" class="play-queue-table">
          <li
            @click="cut(listItem.id)"
            class="table-row"
            v-for="(listItem, listIndex) in playQueue()"
            :key="`playQueue${listIndex}`"
            :class="{ playing: playQueueIndex() === listIndex }"
          >
            <!-- 序号 -->
            <div class="table-cell-index">
              <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
              <span class="playlist-table-icon">
                <img
                  class="icon-equaliser"
                  v-if="playQueueIndex() === listIndex"
                  src="../assets/equaliser.svg"
                  alt=""
                />
                <svg
                  class="icon-pause"
                  v-if="playQueueIndex() === listIndex"
                  height="32"
                  role="img"
                  width="32"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="5"
                    y="3"
                    width="4"
                    height="18"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="15"
                    y="3"
                    width="4"
                    height="18"
                    fill="currentColor"
                  ></rect>
                </svg>
                <svg
                  class="icon-play"
                  v-else
                  height="32"
                  role="img"
                  width="32"
                  viewBox="0 0 24 24"
                >
                  <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="currentColor"
                  ></polygon>
                </svg>
              </span>
            </div>
            <!-- 歌曲名字和作者 -->
            <div class="table-cell-desc">
              <img
                class="table-cell-desc-pic"
                :data-pic-src="listItem.al.picUrl"
                alt=""
              />
              <div class="table-cell-desc-info">
                <!-- 歌名 -->
                <div class="table-desc-name">
                  <span :title="listItem.name" class="table-cell-ellipsis">
                    {{ listItem.name }}</span
                  >
                  <!-- vip图标 -->
                  <img
                    v-if="![0, 8].includes(listItem.fee)"
                    class="table-cell-desc-vip"
                    src="../assets/vip.svg"
                    alt=""
                  />
                </div>
                <!-- 歌手 -->
                <div
                  :title="getName(listItem.ar)"
                  class="table-desc-ar table-cell-ellipsis"
                >
                  {{ getName(listItem.ar) }}
                </div>
              </div>
            </div>
            <!-- 专辑名 -->
            <div class="table-cell-ellipsis">
              <div
                :title="listItem.al.name"
                style="display: block"
                class="table-cell-ellipsis"
              >
                {{ listItem.al.name }}
              </div>
            </div>
            <!-- 时长 -->
            <div>{{ getSongDt(listItem.dt) }}</div>
          </li>
        </ul>
        <div v-else>
          <button class="find-more" @click="toHome">
            发现更多你感兴趣的内容
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { pickUpName } from '@/util'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'PlayQueue',

  mounted () {
    this.lazyLoadimg()
  },

  methods: {
    ...mapGetters(['playQueue', 'playQueueIndex']),
    ...mapMutations(['pushPlayQueue', 'setCurSongid']),
    // 实现图片懒加载
    lazyLoadimg () {
      // IntersectionObserver
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
          if (item.intersectionRatio > 0) {
            item.target.src = item.target.getAttribute('data-pic-src')
            intersectionObserver.unobserve(item.target)
          }
        })
      })
      // dom更新完成 开始观察
      this.$nextTick(function () {
        document
          .querySelectorAll('.table-cell-desc-pic')
          .forEach((ele) => intersectionObserver.observe(ele))
      })
    },
    clearQueue () {
      // 清空先前的播放列表
      this.pushPlayQueue(null)
    },
    toHome () {
      this.$router.push({ name: 'home' })
    },
    cut (id) {
      this.setCurSongid(id)
    }
  },

  computed: {
    getName () {
      return function (name) {
        return pickUpName(name)
      }
    },
    getSongDt () {
      return function (time) {
        const _moment = moment.duration(time)
        return `${
          _moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()
        }:${
          _moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()
        }`
      }
    }
  }
}
</script>

<style lang="less" scoped>
#play-queue {
  background: #000;
  position: relative;
  height: 100%;
  .play-queue-spacing {
    padding: 0 40px 10px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    // 大标题
    .play-queue-title {
      padding-top: 32px;
      position: sticky;
      top: 68px;
      background: #000;
      z-index: 1;
      border-bottom: 1px solid rgba(255, 255green, 255, 0.1);
      h1 {
        padding: 0 10px;
        line-height: 1.5;
        font-size: 28px;
        font-weight: 700;
      }
      .play-queue-subtitle {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        h2 {
          padding: 4px 10px 10px;
          font-size: 16px;
          font-weight: 400;
          color: #b3b3b3;
        }
        .clear-queue {
          padding: 4px;
          font-size: 16px;
          font-weight: 400;
          color: #fff;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .play-queue-main {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      // 发现更多按钮
      .find-more {
        border: none;
        // background: rgba(240, 0, 0, 0.9);
        background: rgba(255, 255, 255, 0.9);
        color: #000;
        font-size: 16px;
        height: 48px;
        padding: 0 32px;
        border-radius: 50px;
        cursor: pointer;
      }
      // ul
      .play-queue-table {
        * {
          color: #b3b3b3;
          font-size: 14px;
        }
        // li
        .table-row {
          display: grid;
          grid-gap: 16px;
          grid-template-columns:
            [index] 16px
            [first] 6fr
            [var1] 4fr
            [last] minmax(120px, 1fr);
          padding: 0 16px;
          border-radius: 6px;
          cursor: pointer;
          // li > div
          > div {
            display: flex;
            align-items: center;
            padding: 5px 0;
            &:last-child {
              justify-content: flex-end;
              margin-right: 32px;
            }
          }
          // index单元格
          .table-cell-index {
            justify-content: center;
            align-items: center;
            .playlist-table-index {
              display: block;
            }
            .playlist-table-icon {
              display: none;
              > svg {
                width: 16px;
                height: 16px;
              }
            }
          }
          // 歌曲信息
          .table-cell-desc {
            // 歌曲封面
            .table-cell-desc-pic {
              height: 54px;
              width: 54px;
              flex-shrink: 0;
              margin-right: 5px;
              padding: 5px;
              box-sizing: border-box;
            }
            // 歌曲名 和 歌手
            .table-cell-desc-info {
              display: grid;
              grid-template: "title title" "badges subtitle" / auto 1fr;
              .table-desc-name {
                grid-area: title;
                color: #fff;
                display: flex;
                align-items: center;
                > span {
                  font-size: 15px;
                  color: #fff;
                  font-weight: 600;
                }
                .table-cell-desc-vip {
                  height: 32px;
                  width: 32px;
                  margin-left: 4px;
                }
              }
              .table-desc-ar {
                grid-column-start: badges;
                grid-area: subtitle;
                color: #b3b3b3;
              }
            }
          }
          // hover样式
          &:hover {
            .playlist-table-index {
              display: none;
            }
            .playlist-table-icon {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .table-desc-name {
              text-decoration: underline;
            }
          }
          // 需要省略的格子
          .table-cell-ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        // 正在播放的歌曲样式
        .playing {
          background: rgb(60, 60, 60);
          .playlist-table-index {
            display: none !important;
          }
          .playlist-table-icon {
            display: flex !important;
            align-items: center;
            justify-content: center;
            .icon-pause {
              display: none;
            }
            .icon-equaliser {
              display: block;
            }
          }
          &:hover {
            .playlist-table-icon {
              .icon-pause {
                display: block;
              }
              .icon-equaliser {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
