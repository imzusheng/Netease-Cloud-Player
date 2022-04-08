<template>
  <ul class="table-songs">
    <li
      class="table-row"
      @click="playSong(listItem.id)"
      v-for="(listItem, listIndex) in getListData"
      :key="`detailArtist-${listIndex}`"
    >
      <!-- 序号 -->
      <div class="table-cell-index" v-if="indexDisplay">
        <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
        <span class="playlist-table-icon">
          <svg
            class="icon-play"
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
          ref="lazyload-img"
          class="table-cell-desc-pic"
          :data-pic-src="listItem.picUrl"
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
              ref=""
              src="../assets/vip.svg"
              alt=""
            />
          </div>
        </div>
      </div>
      <!-- 专辑名 -->
      <div class="table-cell-ellipsis" v-if="albumDisplay">
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
</template>

<script>
import moment from 'moment'
import { lazyLoadImg } from '@/util'
import { mapMutations } from 'vuex'

export default {
  name: 'TableListSongs',

  props: {
    // 列表数据
    listData: Array,

    // 是否显示序号
    indexDisplay: Boolean,

    // 是否显示专辑
    albumDisplay: Boolean
  },

  methods: {
    ...mapMutations(['setCurSongid']),
    // 播放歌曲
    playSong (id) {
      this.setCurSongid(id)
    },
    // 实现图片懒加载
    lazyLoadimg () {
      this.$nextTick(() => {
        lazyLoadImg(this.$refs['lazyload-img'])
      })
    }
  },

  computed: {
    getSongDt () {
      return function (time) {
        const _moment = moment.duration(time)
        return `${
          _moment.minutes() < 10 ? `0${_moment.minutes()}` : _moment.minutes()
        }:${
          _moment.seconds() < 10 ? `0${_moment.seconds()}` : _moment.seconds()
        }`
      }
    },
    getListData () {
      this.lazyLoadimg()
      return this.$props.listData || []
    }
  }
}
</script>

<style lang="less" scoped>
.table-songs {
  // li
  .table-row {
    display: grid;
    grid-gap: 16px;
    grid-template-columns:
      [name] 6fr
      [last] minmax(120px, 1fr);
    border-radius: 6px;
    cursor: pointer;
    // li > div
    > div {
      display: flex;
      align-items: center;
      padding: 4px 0;
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
      }
    }
    // hover样式
    &:hover {
      background: rgba(255, 255, 255, 0.1);
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
</style>
