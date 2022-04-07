<!--
  默认布局页面
  包含:
  1.头部
  2.全局加载logo
  3.router-view
  4.地板播放器
-->

<template>
  <div
    id="layout-default"
    :style="{ '--color-playlist': $store.state.curPlaylistColor }"
  >
    <!-- 头部 -->
    <header id="header">
      <nav id="nav">
        <!-- logo -->
        <div class="logo">
          <img src="../assets/logo_a.png" alt="" />
        </div>

        <!-- 菜单 -->
        <ul class="sub-tabs user-not-select">
          <li
            class="sub-tabs-item"
            :class="{
              'sub-tabs-item-checked': $store.state.curRouter === 'home',
            }"
          >
            <router-link class="sub-tabs-item-router" :to="{ name: 'home' }">
              <div class="sub-tabs-title">
                <svg
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                  class="home-icon"
                >
                  <g class="home-icon">
                    <path
                      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                      class="home-icon"
                    ></path>
                  </g>
                </svg>
                <span>首页</span>
              </div>
            </router-link>
          </li>
          <li
            class="sub-tabs-item"
            :class="{
              'sub-tabs-item-checked': $store.state.curRouter === 'discovery',
            }"
          >
            <router-link
              class="sub-tabs-item-router"
              :to="{ name: 'discovery' }"
            >
              <div class="sub-tabs-title">
                <svg
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                  class="home-icon"
                >
                  <g class="home-icon">
                    <path
                      d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"
                      class="home-icon"
                    ></path>
                  </g>
                </svg>
                <span>探索</span>
              </div>
            </router-link>
          </li>
          <li
            class="sub-tabs-item"
            :class="{
              'sub-tabs-item-checked': $store.state.curRouter === 'library',
            }"
          >
            <router-link class="sub-tabs-item-router" :to="{ name: 'library' }">
              <div class="sub-tabs-title">
                <svg
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                  class="home-icon"
                >
                  <g class="home-icon">
                    <path
                      d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"
                      class="home-icon"
                    ></path>
                  </g>
                </svg>
                <span>媒体库</span>
              </div>
            </router-link>
          </li>
          <li
            class="sub-tabs-item"
            @click="toSearch"
            :class="{
              'sub-tabs-item-checked': $store.state.curRouter === 'search',
            }"
          >
            <div class="sub-tabs-title">
              <svg
                viewBox="0 0 24 24"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                class="icon-search"
              >
                <g class="icon-search">
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    class="icon-search"
                  ></path>
                </g>
              </svg>
              <span>搜索</span>
            </div>
          </li>
        </ul>

        <!-- 用户头像 -->
        <div class="avatar">
          <img :src="$store.getters.userInfo.profile.avatarUrl" alt="" />
          <!-- <span>{{ userInfo.profile.nickname }}</span> -->
        </div>
      </nav>

      <!-- 无关的遮罩 -->
      <div class="header-mask" ref="main-header-mask"></div>
    </header>

    <TheError v-if="$store.state.error.status" />

    <!-- 加载logo -->
    <TheLoading v-if="$store.state.loading" />

    <!-- 搜索栏 TODO 独立组件 -->
    <div class="search" ref="search" v-if="$store.state.searchDisplay">
      <div class="search-input-content">
        <span @click="exitSearch">
          <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            class="search-back-icon"
          >
            <g class="search-back-icon">
              <path
                class="search-back-icon"
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              ></path>
            </g></svg
        ></span>
        <input
          @keyup.enter="toSearchDetail(null)"
          class="search-input"
          type="text"
          @input="searchChange"
          v-model.trim="keywords"
          placeholder="搜索"
        />
      </div>
      <!-- TODO 使li可以用上下键选中 -->
      <ul class="search-suggest-list" v-if="this.searchSuggest.length > 0">
        <li
          class="search-suggest-item"
          v-for="(val, idx) in searchSuggest"
          :key="`search-${idx}`"
          @click="toSearchDetail(val.keyword)"
          tabindex="0"
        >
          {{ val.keyword }}
        </li>
      </ul>
    </div>

    <!-- 切换播放模式的提示 -->
    <TheTips />

    <!-- 当页面加载完毕且没有错误时，才显示 -->
    <router-view
      v-show="!$store.state.loading && !$store.state.error.status"
      :key="refreshKey"
    />
  </div>
</template>

<script>
import TheLoading from '@/components/TheLoading'
import TheTips from '@/components/TheTips'
import TheError from '@/components/TheError'
import { pickUpName } from '@/util'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'LayoutDefault',

  components: {
    TheLoading,
    TheError,
    TheTips
  },

  created () {
    this.$store.commit('reset')
  },

  data () {
    return {
      tabsChecked: 'home',
      keywords: '',
      searchSuggest: []
    }
  },

  methods: {
    ...mapMutations(['setSearchDisplay']),
    searchChange () {
      if (this.keywords) {
        this.$store
          .dispatch('getSearchSuggest', {
            keywords: this.keywords,
            type: 'mobile'
          })
          .then((res) => {
            if (this.keywords) {
              this.searchSuggest = res.allMatch
            }
          })
      } else {
        this.searchSuggest = []
      }
    },
    clickHandle (e) {
      console.log('click')
      const searchRef = this.$refs.search
      const searchRect = searchRef.getBoundingClientRect()
      const top = searchRect.top
      const left = searchRect.left
      const right = searchRect.right
      const bottom = searchRect.bottom
      const clientX = e.clientX
      const clientY = e.clientY
      // 点击的位置X轴是否在范围内
      const includeX = top < clientY && clientY < bottom
      // 点击的位置Y轴是否在范围内
      const includeY = left < clientX && clientX < right
      // 当点击的位置不在在搜索框内，关闭搜索框
      if (!(includeX && includeY)) {
        this.setSearchDisplay(false)
        document.removeEventListener('click', this.clickHandle)
      }
    },
    exitSearch () {
      this.setSearchDisplay(false)
      document.removeEventListener('click', this.clickHandle)
    },
    // 点击搜索框
    toSearch () {
      this.setSearchDisplay(true)
      document.addEventListener('click', this.clickHandle)
    },
    // 前往搜索页面
    toSearchDetail (keywords) {
      if (this.keywords) {
        const queryKeywords = keywords ?? this.keywords
        this.keywords = queryKeywords
        this.searchSuggest = []
        this.$router.push({
          name: 'search',
          query: {
            keywords: queryKeywords
          }
        })
      }
    }
  },

  computed: {
    // 提取歌手名字(拼接数组)
    getPickupName () {
      return function (artists, Separator = '/') {
        if (!artists) return ''
        return pickUpName(artists, Separator)
      }
    },
    // player获取时间
    getPubTime () {
      return function (timeStamp) {
        if (!timeStamp) return ''
        return moment(timeStamp).format('YYYY')
      }
    },
    refreshKey () {
      console.log('refreshKey')
      if (this.$route.query.id) {
        return Date.now() + this.$route.query.id
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less">
#layout-default {
  --color-playlist: "0, 0, 0, 1";
  width: 100%;
  position: relative;
  background-color: rgba(var(--color-playlist));
  transition: background-color 0.65s;

  .view-spacing {
    box-sizing: border-box;
    padding: 68px 32px 72px;
  }

  .search {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 99;
    background: rgba(33, 33, 33, 1);
    width: 60vw;
    border-radius: 4px;
    padding: 5px 16px 5px;
    box-sizing: border-box;
    .search-input-content {
      width: 100%;
      height: 38px;
      position: relative;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
        &:hover .search-back-icon {
          fill: rgba(255, 255, 255, 0.8);
        }
        .search-back-icon {
          height: 28px;
          width: 28px;
          fill: rgba(255, 255, 255, 0.35);
          margin-right: 6px;
          cursor: pointer;
        }
      }
      .search-input {
        width: 100%;
        border: none;
        outline: none;
        box-sizing: border-box;
        padding: 0 4px;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    .search-suggest-list {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      min-height: 68px;
      padding: 10px 0;
      box-sizing: border-box;
      .search-suggest-item {
        padding: 8px 10px;
        font-size: 15px;
        color: #b3b3b3;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  #header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 68px;
    padding: 8px 16px;
    box-sizing: border-box;
    z-index: 2;

    .header-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
      background-color: rgba(var(--color-playlist));
      opacity: 0;
    }

    #nav {
      position: relative;
      z-index: 4;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        width: 100px;
        display: flex;
        align-items: center;
        font-weight: bold;

        img {
          max-height: 28px;
          margin: 0 4px 0 0;
        }
        span {
          display: inline-block;
        }
        h2 {
          font-size: 28px;
          line-height: 1;
        }
      }

      .sub-tabs {
        height: 100%;
        display: flex;
        align-items: center;

        .sub-tabs-item {
          padding: 0 22px;
          line-height: 2;
          font-size: 20px;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          position: relative;

          .sub-tabs-title {
            color: rgba(255, 255, 255, 0.4);
            line-height: 2;
            font-size: 22px;
            font-weight: 400;
            display: flex;
            align-items: center;
            transition: all 0.4s;
            span {
              color: inherit;
            }
            .home-icon {
              height: 28px;
              width: 28px;
              color: inherit;
              fill: currentColor;
              display: none;
            }
            .icon-search {
              height: 28px;
              width: 28px;
              margin-right: 12px;
              color: inherit;
              fill: currentColor;
            }
          }
        }
        .sub-tabs-item-checked {
          .sub-tabs-title {
            color: rgba(240, 0, 0, 1);
          }
        }
      }

      .avatar {
        display: flex;
        align-items: center;
        width: 100px;
        justify-content: flex-end;

        img {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          margin: -2px 6px 0 0;
        }

        span {
          font-size: 14px;
        }
      }

      @media screen and (max-width: 768px) {
        & {
          ul li {
            padding: 0 16px;
          }

          .avatar {
            width: auto;
          }
        }
      }

      @media screen and (max-width: 768px) {
        & {
          ul li {
            padding: 0 10px;
          }

          .avatar {
            width: auto;
          }
        }
      }
    }

    @media screen and (max-width: 728px) {
      & {
        .sub-tabs-title {
          span {
            display: none;
          }
        }
      }
    }
  }
}
</style>
