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
      <nav>
        <!-- logo -->
        <div class="logo">
          <img src="../assets/logo_a.png" alt="" />
        </div>

        <!-- 菜单 -->
        <SubTabs :sourceData="config.homeTabsData" @change="homeTabsChange" />

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

    <!-- 切换播放模式的提示 -->
    <TheTips />

    <!-- 当页面加载完毕且没有错误时，才显示 -->
    <router-view
      v-show="!$store.state.loading && !$store.state.error.status"
    ></router-view>

    <!-- 音乐播放器 -->
    <PlayerAudio />
  </div>
</template>

<script>
import SubTabs from '@/components/SubTabs'
import PlayerAudio from '@/components/PlayerAudio'
import TheLoading from '@/components/TheLoading'
import TheTips from '@/components/TheTips'
import TheError from '@/components/TheError'
import { pickUpName } from '@/util'
import moment from 'moment'

export default {
  name: 'LayoutDefault',

  components: {
    SubTabs,
    TheLoading,
    PlayerAudio,
    TheError,
    TheTips
  },

  created () {
    this.$store.commit('reset')
  },

  data () {
    return {
      // 菜单配置
      config: {
        homeTabsData: {
          name: 'home',
          checked: '首页',
          list: [
            {
              id: 'home-tabs-tj',
              title: '首页'
            },
            {
              id: 'home-tabs-rm',
              title: '探索'
            },
            {
              id: 'home-tabs-xj',
              title: '媒体库'
            },
            {
              id: 'home-tabs-zb',
              title: '搜索'
            }
          ]
        }
      }
    }
  },

  methods: {
    // 主页菜单切换
    homeTabsChange (val) {
      const routes = {
        首页: 'home',
        探索: 'discovery'
      }
      this.$router.push({
        name: routes[val]
      })
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

    // 后期全部改成class

    nav {
      position: relative;
      z-index: 4;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      div {
        font-size: 24px;
        font-weight: 500;
      }

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

      ul {
        display: flex;
        padding: 0;

        li {
          color: rgba(255, 255, 255, 0.5);
          font-size: 20px;
          font-weight: 500;
          padding: 0 22px;

          &:first-child {
            color: #fff;
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
  }
}
</style>
