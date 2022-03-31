<template>
  <div id="layout-default">
    <header>
      <nav>
        <div class="logo">
          <img src="../assets/logo_m.png" alt="" />
          <h2>Music</h2>
        </div>
        <SubTabs :sourceData="config.homeTabsData" @change="homeTabsChange" />
        <div class="avatar">
          <img :src="$store.getters.userInfo.profile.avatarUrl" alt="" />
          <!-- <span>{{ userInfo.profile.nickname }}</span> -->
        </div>
      </nav>
    </header>
    <router-view></router-view>
    <PlayerAudio
      :name="$store.state.curSong.name"
      :poster="$store.state.curSong.al.picUrl"
      :artisis="getPickupName($store.state.curSong.ar)"
      :pubTime="getPubTime($store.state.curSong.publishTime)"
      :songUrl="$store.state.curSong.songUrl"
    />
  </div>
</template>

<script>
import SubTabs from '@/components/SubTabs'
import PlayerAudio from '@/components/PlayerAudio'
import { pickUpName } from '@/util'
import moment from 'moment'

export default {
  name: 'LayoutDefault',

  components: {
    SubTabs,
    PlayerAudio
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
        return pickUpName(artists, Separator)
      }
    },
    // player获取时间
    getPubTime () {
      return function (timeStamp) {
        return moment(timeStamp).format('YYYY')
      }
    }
  }
}
</script>

<style lang="less" scoped>
#layout-default {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 1);
  header {
    height: 52px;
    padding: 8px 16px;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #000;

    &::after {
      content: "";
      position: absolute;
      top: 68px;
      left: 0;
      height: 1px;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      z-index: 2;
      transform: scaleY(0.25);
    }

    nav {
      width: 100%;
      height: inherit;
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
          max-width: 28px;
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
