<template>
  <div id="search-view" class="view-spacing">
    <section class="search-section" v-if="matchSearch.artist.id">
      <div class="search-section-content">
        <div
          class="search-section-left"
          @click="toArtistDetail(matchSearch.artist.id)"
        >
          <h2>最佳搜索结果</h2>
          <div class="search-section-left-main">
            <img
              v-if="matchSearch.artist.picUrl"
              class="match-poster"
              :src="matchSearch.artist.picUrl + '?param=100y100'"
              alt=""
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
        <div class="search-section-right" v-if="searchSuggest.songs.length > 0">
          <h2>歌曲</h2>
          <TableListSongs
            class="search-table-songs"
            :listData="searchSuggest.songs"
          />
        </div>
      </div>
    </section>
    <SectionListGrid
      :title="'专辑'"
      :listData="listData.albums.data"
      :round="false"
      :args="{ keywords, limit: listData.albums.count }"
      action="getSearchAlbums"
    />
    <SectionListGrid
      :title="'艺人'"
      :listData="listData.artists.data"
      :round="true"
      :args="{ keywords, limit: listData.artists.count }"
      action="getSearchArtists"
    />
    <SectionListGrid
      :title="'歌曲'"
      :listData="listData.songs.data"
      :round="false"
      :args="{ keywords, limit: listData.songs.count }"
      action="getSearchSongs"
    />
    <SectionListGrid
      :title="'歌单'"
      :listData="listData.playlists.data"
      :round="false"
      :args="{ keywords, limit: listData.playlists.count }"
      action="getSearchSongs"
    />
    <hr />
    <SectionListGrid
      :title="'专辑'"
      :listData="searchSuggest.albums"
      :round="false"
      type="getRecommend"
    />
    <SectionListGrid
      :title="'单曲'"
      :listData="searchSuggest.songs"
      :round="false"
      type="getRecommend"
    />
  </div>
</template>

<script>
import SectionListGrid from '@/components/SectionListGrid.vue'
import TableListSongs from '@/components/TableListSongs'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'DetailSearch',

  components: {
    SectionListGrid,
    TableListSongs
  },

  data () {
    return {
      searchSuggest: {
        albums: [],
        artists: [],
        playlists: [],
        songs: []
      },
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
        // 歌曲
        songs: {
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
      'getSearchSuggest',
      'getSearch',
      'getSearchAlbums',
      'getSearchSongs',
      'getSearchArtists'
    ]),
    ...mapMutations(['setLoading']),
    search () {
      if (!this.keywords) return

      this.getSearchAlbums({
        keywords: this.keywords
      }).then((res) => {
        this.listData.albums.count = res.count
        this.listData.albums.data = res.data
      })

      this.getSearchArtists({
        keywords: this.keywords
      }).then((res) => {
        this.listData.artists.count = res.count
        this.listData.artists.data = res.data
      })

      // this.getSearchSongs({
      //   keywords: this.keywords
      // }).then((res) => {
      //   this.listData.songs.data = res.data
      // })

      // this.getSearchSuggest({
      //   keywords: this.keywords
      // }).then((res) => {
      //   this.searchSuggest = {
      //     albums: [],
      //     artists: [],
      //     playlists: [],
      //     songs: []
      //   }
      //   Object.assign(this.searchSuggest, res)
      // })

      // this.getSearchMatch(this.keywords).then((res) => {
      //   this.matchSearch = {
      //     artist: {},
      //     album: {},
      //     playlist: {},
      //     mv: {},
      //     song: {}
      //   }
      //   res.orders.forEach((v) => {
      //     this.matchSearch[v] = res[v][0]
      //   })
      // })
      this.setLoading(false)
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
