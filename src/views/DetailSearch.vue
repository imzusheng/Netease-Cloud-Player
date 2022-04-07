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
      :listData="searchSuggest.albums"
      :round="false"
      type="getRecommend"
    />
    <SectionListGrid
      :title="'艺人'"
      :listData="searchSuggest.artists"
      :round="false"
      type="getRecommend"
    />
    <SectionListGrid
      :title="'歌单'"
      :listData="searchSuggest.playlists"
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
      }
    }
  },

  created () {
    this.search(this.$route.query.keyword)
  },

  mounted () {
    const headerMaskRef = this.$parent.$refs['main-header-mask']
    headerMaskRef.style.opacity = 1
  },

  methods: {
    ...mapActions(['getSearchMatch', 'getSearchSuggest']),
    ...mapMutations(['setLoading']),
    search (keyword) {
      if (!keyword) return
      this.getSearchSuggest({
        keywords: keyword
      }).then((res) => {
        this.searchSuggest = {
          albums: [],
          artists: [],
          playlists: [],
          songs: []
        }
        Object.assign(this.searchSuggest, res)
      })

      this.getSearchMatch(keyword).then((res) => {
        res.orders.forEach((v) => {
          this.matchSearch[v] = res[v][0]
        })
      })
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
    '$route.query.keyword' (keyword) {
      this.search(keyword)
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
      grid-template-columns: repeat(5, minmax(0, 1fr));
      .search-section-left {
        grid-column-start: 1;
        grid-column-end: 3;
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
        grid-column-start: 3;
        grid-column-end: -1;
        .search-table-songs {
          height: 100%;
        }
      }
    }
  }
}
</style>
