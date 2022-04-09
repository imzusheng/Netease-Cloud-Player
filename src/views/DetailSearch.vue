<template>
  <div id="search-view" class="view-spacing">
    <section v-if="matchSearch.artist.id" class="search-section">
      <div class="search-section-content">
        <div
          class="search-section-left"
          @click="toArtistDetail(matchSearch.artist.id)"
        >
          <h2>最佳搜索结果</h2>
          <div class="search-section-left-main">
            <img
              v-if="matchSearch.artist.picUrl"
              :src="matchSearch.artist.picUrl + '?param=100y100'"
              alt=""
              class="match-poster"
            />
            <div class="match-title">
              <h3 class="match-title-h">{{ matchSearch.artist.name }}</h3>
              <p class="match-title-desc">
                {{ matchSearch.artist.occupation }}
              </p>
            </div>
          </div>
        </div>
        <!-- 歌曲列表 -->
        <div v-if="listData.songs.data.length > 0" class="search-section-right">
          <h2>歌曲</h2>
          <table-songs
            :songs="listData.songs.data.slice(0, 4)"
            class="search-table-songs"
            size="S"
          />
        </div>
      </div>
    </section>
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.albums.data"
      :round="false"
      :title="'专辑'"
      action="getSearchAlbums"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.artists.data"
      :round="true"
      :title="'艺人'"
      action="getSearchArtists"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.songs.data"
      :round="false"
      :title="'歌曲'"
      action="getSearchSongs"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.playlists.data"
      :round="false"
      :title="'歌单'"
      action="getSearchPlaylist"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.songs.data"
      :round="false"
      :title="'单曲'"
      action="getSearchSongs"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.users.data"
      :round="true"
      :title="'用户'"
      action="getSearchUsers"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.mvs.data"
      :round="false"
      :title="'MV'"
      action="getSearchMV"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.djs.data"
      :round="false"
      :title="'电台'"
      action="getSearchDj"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.videos.data"
      :round="false"
      :title="'视频'"
      action="getSearchVideos"
    />
    <SectionListGrid
      :args="{ keywords }"
      :listData="listData.voices.data"
      :round="false"
      :title="'播客'"
      action="getSearchVoices"
    />
  </div>
</template>

<script>
import SectionListGrid from '@/components/SectionListGrid.vue'
import { mapActions, mapMutations } from 'vuex'
import tableSongs from '@/components/TableSongs'

export default {
  name: 'DetailSearch',

  components: {
    SectionListGrid,
    tableSongs
  },

  data () {
    return {
      matchSearch: {
        artist: {},
        album: {},
        playlist: {},
        mv: {},
        song: {}
      },
      // 关键词
      keywords: '',
      // 数据
      listData: {
        // 歌手
        artists: {
          data: [],
          count: ''
        },
        // 专辑
        albums: {
          data: [],
          count: ''
        },
        playlists: {
          data: [],
          count: ''
        },
        // 歌曲
        songs: {
          data: [],
          count: ''
        },
        // 用户
        users: {
          data: [],
          count: ''
        },
        // mv
        mvs: {
          data: [],
          count: ''
        },
        // 电台
        djs: {
          data: [],
          count: ''
        },
        // 视频
        videos: {
          data: [],
          count: ''
        },
        // 播客（声音）
        voices: {
          data: [],
          count: ''
        }
      }
    }
  },

  created () {
    this.keywords = this.$route.query.keywords
    this.search()
  },

  mounted () {
    const headerMaskRef = this.$parent.$refs['main-header-mask']
    headerMaskRef.style.opacity = 1
  },

  methods: {
    ...mapActions([
      'getSearchMatch',
      'getSearchAlbums',
      'getSearchSongs',
      'getSearchArtists',
      'getSearchPlaylist',
      'getSearchVideos',
      'getSearchUsers',
      'getSearchMV',
      'getSearchDj',
      'getSearchVoices'
    ]),
    ...mapMutations(['setLoading']),
    search () {
      if (!this.keywords) return

      this.setLoading(true)
      Object.assign(this.$data.listData, this.$options.data().listData)

      const args = {
        keywords: this.keywords,
        limit: 7
      }

      Promise.allSettled([
        this.getSearchSongs(args),
        this.getSearchAlbums(args),
        this.getSearchArtists(args),
        this.getSearchPlaylist(args),
        this.getSearchUsers(args),
        this.getSearchMV(args),
        this.getSearchDj(args),
        this.getSearchVideos(args),
        this.getSearchVoices(args)
      ]).then((resArr) => {
        resArr.forEach(({ status, value: res }) => {
          if (status === 'fulfilled') {
            this.listData[res.key].title = res.title
            this.listData[res.key].data = res.data
            this.listData[res.key].count = res.count
          }
        })
        this.setLoading(false)
      })

      this.getSearchMatch(this.keywords).then((res) => {
        this.matchSearch = {
          artist: {},
          album: {},
          playlist: {},
          mv: {},
          song: {}
        }
        res.orders.forEach((v) => {
          this.matchSearch[v] = res[v][0]
        })
        console.log('\n\n\n', '最佳搜索', res, '\n\n\n')
      })
    },
    toArtistDetail (id) {
      this.$router.push({
        name: 'artist',
        query: {
          id
        }
      })
    }
  },

  watch: {
    '$route.query.keywords' (keywords) {
      this.keywords = keywords
      this.search()
    }
  }
}
</script>

<style lang="less" scoped>
#search-view {
  margin-top: 16px;
  .search-section {
    margin: 0 0 48px;
    h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .search-section-content {
      grid-gap: 22px;
      display: grid;
      grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
      .search-section-left {
        grid-column: 1/3;
        .search-section-left-main {
          background: #181818;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          &:hover {
            background-color: rgba(39, 39, 39, 1);
          }
        }
        .match-poster {
          height: 100px;
          width: 100px;
          border-radius: 50%;
          box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
          margin-bottom: 10px;
        }
        .match-title {
          .match-title-h {
            font-size: 32px;
            font-weight: 700;
          }
          .match-title-desc {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 400;
            display: inline-block;
            padding: 6px 10px;
            color: rgba(255, 255, 255, 0.9);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
          }
        }
      }
      .search-section-right {
        grid-column: 3/-1;
        .search-table-songs {
          height: 100%;
        }
      }
      @media screen and (max-width: 728px) {
        & {
          display: block;
          .search-section-left {
            margin-bottom: 48px;
          }
        }
      }
    }
  }
}
</style>
