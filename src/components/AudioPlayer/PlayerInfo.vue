<!--
  歌曲信息模块
-->

<template>
  <div class="player-song">
    <!-- 封面 -->
    <div class="player-song-pic">
      <img v-if="!loading && curSongPic" :src="curSongPic" alt=""/>
      <the-loading-circle v-else class="pic-loading"/>
    </div>
    <!-- 歌曲信息 -->
    <div class="player-song-desc">
      <p :title="curSongName">
        {{ curSongName }}
      </p>
      <p>
        {{ curSongArtists }}
        <span v-if="curSongArtists && curSongPubtime">&nbsp;•&nbsp;</span>
        {{ curSongPubtime }}
      </p>
    </div>
  </div>
</template>

<script>
import { pickUpName } from '@/util'
import TheLoadingCircle from '@/components/TheLoadingCircle'
import moment from 'moment'

export default {
  name: 'PlayerInfo',

  components: {
    TheLoadingCircle
  },

  props: {
    loading: Boolean,
    curSongInfo: Object
  },

  computed: {
    // 以下歌曲信息
    curSongName () {
      return this.$props.curSongInfo.name || ''
    },
    curSongPic () {
      return this.$props.curSongInfo.picUrl || ''
    },
    curSongArtists () {
      return pickUpName(this.$props.curSongInfo.artists) ?? null
    },
    curSongPubtime () {
      const timeStamp = this.$props.curSongInfo.publishTime
      if (!timeStamp) return ''
      return moment(timeStamp).format('YYYY') || ''
    }
  }
}
</script>

<style lang="less">
// 歌曲信息
.player-song {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;

  .player-song-pic {
    height: 48px;
    width: 48px;
    margin-right: 12px;

    img {
      height: 48px;
      border-radius: 3px;
      cursor: pointer;
    }

    .pic-loading {
      padding: 6px;
      box-sizing: border-box;
    }
  }

  .player-song-desc {
    display: flex;
    height: 100%;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;

    p:hover {
      cursor: pointer;
      text-decoration: underline;
    }

    p:first-child {
      font-size: 14px;
    }

    p:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);

      span {
        color: currentColor;
      }
    }
  }
}

</style>
