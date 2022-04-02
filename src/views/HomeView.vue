<!--
  首页
-->

<template>
  <main id="home">
    <!-- 热门歌曲 -->
    <section class="section-common">
      <div class="section-common-title">
        <div>
          <p>为你准备的新曲</p>
          <h2>专属推荐</h2>
        </div>
        <div>
          <a href="#">查看更多</a>
        </div>
      </div>
      <ul class="section-newSong-list">
        <li v-for="rmdItem in listData.newsong" :key="rmdItem.id">
          <figure>
            <img :src="rmdItem.picUrl" alt="" />
            <div class="section-newSong-desc">
              <p>{{ rmdItem.name }}</p>
              <p>{{ rmdItem.desc2 }}</p>
            </div>
          </figure>
        </li>
      </ul>
    </section>
    <!-- 模板 -->
    <section
      class="section-common"
      v-for="(sectionItem, sectionIndex) in sectionScreen"
      :key="`section-${sectionIndex}`"
    >
      <div class="section-common-title">
        <div>
          <p>{{ sectionItem.subTitle }}</p>
          <h2>{{ sectionItem.title }}</h2>
        </div>
        <div>
          <a href="#">查看更多</a>
        </div>
      </div>
      <ul class="section-common-list">
        <li
          v-for="(listItem, listKey) in listData[sectionItem.li.source]"
          :key="`${sectionIndex}-${listKey}`"
          :class="`${sectionItem.li.class}`"
          @click="toPlaylistDetail(listItem.payload)"
        >
          <figure>
            <span>
              <img
                src="../assets/empty_black.png"
                alt=""
                :data-source-src="listItem.picUrl"
                :data-img-class="sectionItem.id"
              />
            </span>
            <p>{{ listItem.name }}</p>
            <p>
              {{ listItem.desc1 }}
              {{ listItem.desc2 ? ` ${sectionItem.li.join} ` : "" }}
              {{ listItem.desc2 || "" }}
            </p>
          </figure>
        </li>
      </ul>
    </section>
    <!-- 电台 -->
    <section class="section-common">
      <div class="section-common-title sub-title">
        <div>
          <h2>电台</h2>
        </div>
        <div>
          <SubTabs :sourceData="config.dj.djTabsData" @change="subTabsChange" />
        </div>
      </div>
      <ul class="section-common-list">
        <li v-for="rmdItem in listData.dj" :key="rmdItem.id">
          <figure v-if="config.dj.type === '推荐'">
            <span>
              <img
                :data-source-src="rmdItem.picUrl"
                src="../assets/empty_black.png"
                alt=""
              />
            </span>
            <p>{{ rmdItem.name }}</p>
            <p>{{ rmdItem.lastProgramName }}</p>
          </figure>
          <figure v-else-if="config.dj.type === '热门'">
            <span> <img :src="rmdItem.picUrl" alt="" /></span>
            <p>{{ rmdItem.name }}</p>
            <p>{{ rmdItem.copywriter }}</p>
          </figure>
          <figure v-else-if="config.dj.type === '新晋热榜'">
            <span> <img :src="rmdItem.picUrl" alt="" /></span>
            <p>{{ rmdItem.name }}</p>
            <p>{{ rmdItem.rcmdtext }}</p>
          </figure>
          <figure v-else-if="config.dj.type === '最热主播'">
            <span> <img :src="rmdItem.avatarUrl" alt="" /></span>
            <p>{{ rmdItem.nickName }}</p>
          </figure>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import SubTabs from '@/components/SubTabs'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'HomeView',
  components: {
    SubTabs
  },

  data () {
    return {
      // section模板数据
      sectionData: [
        {
          id: 'section-tuijian',
          title: '为你推荐',
          subTitle: '挑选歌曲，开始收听电台',
          moreUrl: '',
          li: {
            class: 'section-common-item',
            source: 'recommends',
            join: '•'
          }
        },
        {
          id: 'section-geshou',
          title: '热门歌手',
          subTitle: null,
          moreUrl: '',
          li: {
            class: 'section-common-item posterRound',
            source: 'hotArtists',
            join: '•'
          }
        },
        {
          id: 'section-zuijinbofang',
          title: '最近播放',
          subTitle: null,
          moreUrl: '',
          li: {
            class: 'section-common-item',
            source: 'records',
            join: '-'
          }
        },
        {
          id: 'section-mv',
          title: '推荐的MV',
          subTitle: null,
          moreUrl: '',
          li: {
            class: 'section-mv-item',
            source: 'recommendMv',
            join: '•'
          }
        },
        {
          id: 'section-shequ',
          title: '社区精选',
          subTitle: null,
          moreUrl: '',
          li: {
            class: 'section-common-item',
            source: 'community',
            join: '•'
          }
        }
      ],
      // 菜单配置
      config: {
        dj: {
          type: '推荐',
          api: {
            热门: {
              url: '/dj/hot?limit=6',
              key: ['djRadios']
            },
            推荐: {
              url: '/dj/personalize/recommend?limit=6',
              key: ['data']
            },
            新晋热榜: {
              url: '/dj/toplist?type=new&limit=6',
              key: ['toplist']
            },
            最热主播: {
              url: '/dj/toplist/popular?limit=6',
              key: ['data', 'list']
            }
          },
          djTabsData: {
            name: 'dj',
            checked: '推荐',
            list: [
              {
                id: 'dj-tabs-tj',
                title: '推荐'
              },
              {
                id: 'dj-tabs-rm',
                title: '热门'
              },
              {
                id: 'dj-tabs-xj',
                title: '新晋热榜'
              },
              {
                id: 'dj-tabs-zb',
                title: '最热主播'
              }
            ]
          }
        }
      },
      // 列表数据
      listData: {
        dj: [], // 电台
        hotArtists: [], // 热门歌手
        community: [], // 社区
        recommends: [], // 推荐歌单
        records: [], // 听歌记录
        newsong: [], // 推荐新曲
        recommendMv: [] // 推荐MV
      }
    }
  },

  methods: {
    ...mapActions([
      'getHotArtists',
      'getCommunity',
      'getRecommend',
      'getRecords',
      'getNewsong',
      'getMv'
    ]),
    ...mapMutations(['setLoading']),
    // 小菜单切换
    subTabsChange (val) {
      this.config.dj.type = val
      const curApi = this.config.dj.api[val]
      fetch(`http://localhost:3000${curApi.url}`).then((res) => {
        res.json().then((resJson) => {
          let data = resJson
          curApi.key.forEach((path) => (data = data[path]))
          this.listData.dj = data
        })
      })
    },
    // 点击歌单
    toPlaylistDetail (payload) {
      this.$router.push({
        name: 'playlist',
        query: {
          type: 'playlist',
          id: payload
        }
      })
    }
  },

  mounted () {
    this.subTabsChange('推荐')

    this.setLoading(true)

    Promise.all([
      this.getCommunity(),
      this.getRecommend(),
      this.getNewsong(),
      this.getMv(),
      this.getHotArtists()
    ]).then((resArr) => {
      resArr.forEach((res) => {
        this.listData[res.type] = res.data
      })
      this.setLoading(false)
      // IntersectionObserver
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
          // 图片出现在视野内
          if (item.intersectionRatio > 0) {
            // 加载真正的src
            item.target.src = item.target.getAttribute('data-source-src')
            intersectionObserver.unobserve(item.target)
          }
        })
      })
      // dom更新完成 开始观察
      this.$nextTick(() => {
        document
          .querySelectorAll('.section-common-list img')
          .forEach((ele) => intersectionObserver.observe(ele))
      })
    })
  },

  computed: {
    // section筛选 无数据时不显示
    sectionScreen () {
      return this.sectionData.filter(
        (v) => this.listData[v.li.source].length > 0
      )
    }
  }
}
</script>

<style lang="less" scoped>
.section-common {
  padding: 32px 40px 56px;

  // 标题
  .section-common-title {
    padding: 0 12px;
    margin-bottom: 16px;
    line-height: 1.5;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    p {
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
    }

    h2 {
      line-height: 1.5;
      font-size: 28px;
      font-weight: 700;
    }

    a {
      font-size: 12px;
      color: rgb(180, 180, 180);
    }
  }

  // 子菜单
  .sub-title {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
  }

  // 列表
  ul[class="section-common-list"] {
    display: flex;
    overflow: hidden;
    width: 100%;

    li {
      flex-shrink: 0;
      cursor: pointer;
      position: relative;
      width: calc(100% / 6);
      padding: 0 12px;
      box-sizing: border-box;

      img {
        border-radius: 12px;
        width: 100%;
      }

      figure span::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transition: all 0.3s;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.7)
        );
      }

      &:hover figure span::after {
        opacity: 1;
      }

      p {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:last-child {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.7);
        }
      }

      &[class="section-mv-item"] {
        width: 25%;

        figure {
          background: rgba(24, 24, 24, 1);
          border-radius: 12px;
          padding: 16px;

          img {
            width: 100%;
            height: 190px;
            object-fit: cover;
            margin-bottom: 10px;
            box-shadow: rgba(0, 0, 0, 0.5) 0px 8px 24px 0px;
          }
        }

        @media screen and (max-width: 1068px) {
          width: 33.33%;
        }

        @media screen and (max-width: 968px) {
          width: 50%;
        }
      }

      @media screen and (max-width: 1068px) {
        width: calc(100% / 5);
        padding: 0 10px;
      }

      @media screen and (max-width: 968px) {
        width: calc(100% / 4);
        padding: 0 8px;
      }

      @media screen and (max-width: 768px) {
        width: calc(100% / 3);
        padding: 0 8px;
      }
    }

    .posterRound {
      figure {
        background: #181818;
        border-radius: 12px;
        padding: 12px 12px 24px;
        img {
          border-radius: 50%;
        }
        p {
          text-align: center;
        }
      }
    }
  }

  ul[class="section-newSong-list"] {
    display: flex;
    flex-wrap: wrap;
    li {
      box-sizing: border-box;
      width: calc(100% / 3);
      margin-bottom: 12px;
      padding: 0 12px;
      cursor: pointer;
      figure {
        padding: 4px;
        box-sizing: border-box;
        border-radius: 6px;
        width: 100%;
        display: flex;
        transition: all 0.2s;
        &:hover {
          background: #141414;
        }
        img {
          height: 50px;
          border-radius: 6px;
          margin-right: 12px;
        }
        .section-newSong-desc {
          flex: 1;
          overflow: hidden;
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 50%;
            &:last-child {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
      }
      @media screen and (max-width: 1068px) {
        padding: 0 10px;
      }

      @media screen and (max-width: 968px) {
        padding: 0 8px;
      }

      @media screen and (max-width: 768px) {
        padding: 0 8px;
        width: calc(100% / 2);
      }
    }
  }
}
</style>
