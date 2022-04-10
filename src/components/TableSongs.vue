<!--
  单曲显示表格组件
  单击切歌，有L/M/S三种尺寸
  L: 序号，封面，歌名，专辑，时长
  M: 序号，封面，歌名，时长
  S: 封面，歌名，时长
-->

<template>
  <div class="song-table-wrap">
    <div
      v-if="title"
      :class="`table-title-size-${size.toLowerCase()}`"
      class="song-table-title"
    >
      <div v-if="['XL','L', 'M'].includes(size.toUpperCase())" >#</div>
      <div>标题</div>
      <div v-if="['XL','L'].includes(size.toUpperCase())">专辑</div>
      <div v-if="['XL'].includes(size.toUpperCase())">发布时间</div>
      <div>时长</div>
    </div>
    <ul class="song-table">
      <li
        v-for="(listItem, listIndex) in songs"
        :key="`songs-${listIndex}`"
        :class="`table-row-size-${size.toLowerCase()}`"
        class="table-row"
        @click="play(listItem)"
      >
        <!-- 序号 -->
        <div v-if="['XL','L', 'M'].includes(size.toUpperCase())"  class="table-cell-index">
          <span class="playlist-table-index"> {{ listIndex + 1 }}</span>
          <span class="playlist-table-icon">
            <img alt="" src="../assets/icon-song-play.svg">
          </span>
        </div>

        <!-- 歌曲名字和作者 -->
        <div class="table-cell-desc table-cell-ellipsis">
          <img
            ref="lazyload-img"
            :data-pic-src="listItem.picUrl"
            alt=""
            class="table-cell-desc-pic"
            src="../assets/empty_black.png"
          />
          <div class="table-cell-desc-info table-cell-ellipsis">
            <!-- 歌名 -->
            <div class="table-desc-name">
            <span
              :title="listItem.name"
              class="table-cell-ellipsis">
                      {{ listItem.name }}</span
            >
              <!-- vip图标 -->
              <img
                v-if="[1].includes(listItem.fee)"
                ref=""
                alt=""
                class="table-cell-desc-vip"
                src="../assets/vip.svg"
              />
            </div>
            <div
              v-if="['XL','L'].includes(size.toUpperCase())"
              :title="getName(listItem.ar)"
              class="table-desc-art table-cell-ellipsis">
              {{ getName(listItem.ar) }}
            </div>
          </div>
        </div>

        <!-- 专辑名 -->
        <div
          v-if="['XL','L'].includes(size.toUpperCase())"
          class="table-cell-ellipsis table-cell-album">
          <div
            :title="listItem.album"
            class="table-cell-ellipsis table-cell-album"
            style="display: block"
          >
            {{ listItem.album }}
          </div>
        </div>

        <!-- 发布时间 -->
        <div
          v-if="['XL'].includes(size.toUpperCase())"
          class="table-cell-pub">
          {{ getPubTime(listItem.publishTime) }}
        </div>

        <!-- 时长 -->
        <div class="table-cell-dt">{{ getSongDt(listItem.duration) }}</div>

      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { durationConvert, pickUpName, lazyLoadImg } from '@/util'
import moment from 'moment'

export default {
  name: 'TableSongs',

  props: {
    // 数据
    songs: Array,

    // 表格尺寸 L/M/S
    size: String,

    // 表头是否显示
    title: {
      type: Boolean,
      default: false
    }
  },

  mounted () {
    this.loadImg(this.$props.songs)
  },

  methods: {
    ...mapMutations(['setCurSongid', 'setCurSongInfo']),
    play (data) {
      // 当前播放的歌曲信息
      const curSongInfo = {
        name: data.name,
        picUrl: data.al.picUrl,
        artists: data.ar || data.dj.nickname,
        publishTime: data.publishTime
      }
      localStorage.setItem('curSongInfo', JSON.stringify(curSongInfo))
      this.setCurSongInfo(curSongInfo)
      this.setCurSongid(data.id)
      // 修改网页标题
      document.title = `Music - ${curSongInfo.name}`
    },
    loadImg (data) {
      if (data.length > 0) {
      // dom更新完成
        this.$nextTick(() => {
        // 实现图片懒加载
          lazyLoadImg(this.$refs['lazyload-img'])
        })
      }
    }
  },

  computed: {
    getSongDt () {
      return function (time) {
        return durationConvert(time / 1000)
      }
    },
    getName () {
      return function (name) {
        return pickUpName(name)
      }
    },
    getPubTime () {
      return function (time) {
        if (!time) return '未知'
        else return moment(time).format('YYYY')
      }
    }
  },

  watch: {
    songs (data) {
      this.loadImg(data)
    }
  }
}
</script>

<style lang="less">
.song-table-wrap{
  // 表格标题
  .song-table-title{
    display: grid;
    grid-gap: 16px;
    grid-template-columns:
            [index] 16px
            [first] 6fr
            [var1] 4fr
            [var2] 3fr
            [last] minmax(120px, 1fr);
    padding: 0 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(200, 200, 200, 0.2);
    > div {
      padding: 12px 0;
      color: #b3b3b3;
      font-size: 16px;
      &:last-child {
        text-align: right;
        margin-right: 32px;
      }
    }
  }

  // 最大尺寸
  .table-title-size-xl{
    padding: 16px;
    grid-template-columns:
            [index] 16px
            [first] 6fr
            [var1] 4fr
            [var2] 3fr
            [last] minmax(120px, 1fr);
  }

  // 中等尺寸,去掉专辑
  .table-title-size-m{
    grid-template-columns:
              [index] 16px
              [name] auto
              [last] minmax(120px, 1fr);
  }

  // 小尺寸,只保留封面、歌名、时长
  .table-title-size-s{
    padding: 0;
    grid-template-columns:
              [name] auto
              [last] minmax(120px, 1fr);
  }
  // ul
  .song-table {
    // li
    .table-row {
      display: grid;
      grid-gap: 16px;
      grid-template-columns:
              [index] 16px
              [name] 6fr
              [al] 4fr
              [last] minmax(120px, 1fr);
      padding: 0 16px;
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
      // 专辑
      .table-cell-album,
      .table-cell-pub,
      .table-desc-art,
      .table-cell-dt{
        color: #b3b3b3;
        font-size: 14px;
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

    // 最大尺寸
    .table-row-size-xl{
      padding: 16px;
      grid-template-columns:
            [index] 16px
            [first] 6fr
            [var1] 4fr
            [var2] 3fr
            [last] minmax(120px, 1fr);
    }

    // 中等尺寸,去掉专辑
    .table-row-size-m{
      grid-template-columns:
              [index] 16px
              [name] auto
              [last] minmax(120px, 1fr);
    }

    // 小尺寸,只保留封面、歌名、时长
    .table-row-size-s{
      padding: 0;
      grid-template-columns:
              [name] auto
              [last] minmax(120px, 1fr);
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
</style>
