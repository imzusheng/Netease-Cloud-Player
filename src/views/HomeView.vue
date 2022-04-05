<!--
  首页
-->

<template>
  <main id="home">
    <!-- 热门歌曲 -->
    <section class="section-common-hotSong">
      <div class="section-common-title">
        <div class="section-common-spacing">
          <p class="section-title-sub">为你准备的新曲</p>
          <h2 class="section-title-main">专属推荐</h2>
        </div>
        <div>
          <a class="section-title-more" href="#">查看更多</a>
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
    <SectionList :title="'为你推荐'" :listData="listData.recommends" />
    <SectionList
      :title="'热门歌手'"
      :listData="listData.hotArtists"
      :round="true"
    />
    <SectionList
      :title="'推荐的MV'"
      :listData="listData.recommendMv"
      :round="false"
    />
    <SectionList
      :title="'社区精选'"
      :listData="listData.community"
      :round="false"
    />
    <SectionList :title="'推荐电台'" :listData="listData.dj" :round="false" />

    <!-- 模板 -->
    <!-- <section
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
          @click="toPlaylistDetail(sectionItem.query, listItem.payload)"
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
    </section> -->
    <!-- 电台 -->
    <!-- <section class="section-common">
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
    </section> -->
  </main>
</template>

<script>
import SectionList from '@/components/SectionList.vue'
import { mapActions, mapMutations } from 'vuex'

let headerMaskRef
let targetHeight
// 卸载外面是为了退出页面时移除监听 removeEventListener
const scrollHandle = () => {
  const curScrollTop = document.documentElement.scrollTop
  let curValue
  if (targetHeight > curScrollTop) {
    curValue = 1 - (targetHeight - curScrollTop) / targetHeight
  } else {
    curValue = 1
  }
  headerMaskRef.style.opacity = curValue
}

export default {
  name: 'HomeView',
  components: {
    SectionList
  },

  data () {
    return {
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
      'getRecommendDj',
      'getHotArtists',
      'getCommunity',
      'getRecommend',
      'getRecords',
      'getNewsong',
      'getMv'
    ]),
    ...mapMutations(['setLoading'])
  },

  created () {
    this.setLoading(true)
  },

  mounted () {
    // 以下都是小动画监听
    headerMaskRef = this.$parent.$refs['main-header-mask']
    // 动画长度 = banner区域高度 + 遮罩高度 - 顶部栏高度
    targetHeight = headerMaskRef.clientHeight
    // 监听滚动条事件 目的为了驱动header遮罩透明度变化
    document.addEventListener('scroll', scrollHandle)

    Promise.all([
      this.getRecommendDj(),
      this.getCommunity(),
      this.getRecommend(),
      this.getNewsong(),
      this.getMv(),
      this.getHotArtists()
    ]).then((resArr) => {
      resArr.forEach((res) => {
        this.listData[res.type] = res.data
      })
      this.$nextTick(() => {
        this.setLoading(false)
      })
    })
  },

  // 离开时清理一下
  beforeRouteLeave (to, from, next) {
    // 删除监听
    document.removeEventListener('scroll', scrollHandle)
    next()
  }
}
</script>

<style lang="less">
#home {
  padding: 68px 0 72px;

  .section-common-hotSong {
    padding: 32px 40px 56px;

    // 标题
    .section-common-title {
      padding: 0 12px;
      margin-bottom: 16px;
      line-height: 1.5;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .section-title-sub {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }

      .section-title-main {
        line-height: 1.5;
        font-size: 28px;
        font-weight: 700;
      }

      .section-title-more {
        font-size: 14px;
        font-weight: 400;
        color: #b3b3b3;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .section-newSong-list {
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

  .section-common {
    // padding: 32px 40px 56px;
    padding: 40px 50px 0;
  }
}
</style>
