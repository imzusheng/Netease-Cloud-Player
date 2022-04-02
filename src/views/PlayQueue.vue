<!--
  播放队列页面
-->

<template>
  <div id="play-queue">
    <div class="play-queue-spacing">
      <h1>播放队列</h1>
      <main class="play-queue-main">
        <!-- 表格 -->
        <ul class="play-queue-table">
          <li
            class="table-row"
            v-for="(listItem, listIndex) in $store.state.playQueue"
            :key="`playQueue${listIndex}`"
            :class="{ playing: $store.state.playQueueIndex === listIndex }"
          >
            <!-- 序号 -->
            <div class="table-cell-index">
              <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
              <span class="playlist-table-icon">
                <img
                  class="icon-equaliser"
                  v-if="$store.state.playQueueIndex === listIndex"
                  src="../assets/equaliser.gif"
                  alt=""
                />
                <svg
                  class="icon-pause"
                  v-if="$store.state.playQueueIndex === listIndex"
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
      </main>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { pickUpName } from '@/util'

export default {
  name: 'PlayQueue',

  mounted () {
    this.lazyLoadimg()
  },

  methods: {
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
  .play-queue-spacing {
    padding: 32px 40px 56px;
    // 大标题
    h1 {
      padding: 10px;
      line-height: 1.5;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 24px;
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
</style>
