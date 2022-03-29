<template>
  <div id="home">
    <header>
      <nav>
        <div class="logo">
          <img src="../assets/logo.png" alt="" />
          Music
        </div>
        <subTabs :sourceData="config.homeTabsData" @change="homeTabsChange" />
        <div class="avatar">
          <img :src="userInfo.profile.avatarUrl" alt="" />
          <!-- <span>{{ userInfo.profile.nickname }}</span> -->
        </div>
      </nav>
    </header>
    <main>
      <!-- 模板 -->
      <section
        class="section-common"
        v-for="sectionItem in sectionScreen"
        :key="`section-${sectionItem.id}`"
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
            :key="`${sectionItem.id}-${listKey}`"
            :class="`${sectionItem.li.class}`"
          >
            <figure>
              <span><img :src="listItem.picUrl" alt="" /></span>
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
            <subTabs
              :sourceData="config.dj.djTabsData"
              @change="subTabsChange"
            />
          </div>
        </div>
        <ul class="section-common-list">
          <li v-for="rmdItem in listData.dj" :key="rmdItem.id">
            <figure v-if="config.dj.type === '推荐'">
              <span>
                <img :src="rmdItem.picUrl" alt="" />
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
  </div>
</template>

<script>
import subTabs from '@/components/sub-tabs'

const API_ROOT = 'http://localhost:3000'

export default {
  name: 'HomeView',
  components: {
    subTabs
  },
  data () {
    return {
      API: {
        GET_RECOMMENDS: `${API_ROOT}/personalized?limit=6`,
        GET_COMMUNITY: `${API_ROOT}/top/playlist?limit=6`,
        GET_RECORDS: `${API_ROOT}/user/record?type=1`,
        GET_PERSON_NEWSONG: `${API_ROOT}/personalized/newsong?limit=6`,
        GET_RECOMMENDS_MV: `${API_ROOT}/personalized/mv`,
        GET_HOT_ARTISTS: `${API_ROOT}/top/artists?offset=0&limit=6`
      },
      sectionData: [
        {
          id: 'section-tj',
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
          id: 'section-rgs',
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
          id: 'section-zj',
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
          id: 'section-xq',
          title: '专属推荐',
          subTitle: '为你准备的新曲',
          moreUrl: '',
          li: {
            class: 'section-common-item',
            source: 'recommendPerson',
            join: '•'
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
          id: 'section-sq',
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
        },
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
      userInfo: {
        code: 200,
        account: {
          id: 86087017,
          userName: '1_********875',
          type: 1,
          status: 0,
          whitelistAuthority: 0,
          createTime: 1439569209151,
          tokenVersion: 4,
          ban: 0,
          baoyueVersion: 1,
          donateVersion: 0,
          vipType: 0,
          anonimousUser: false,
          paidFee: false
        },
        profile: {
          userId: 86087017,
          userType: 0,
          nickname: '没四块腹肌不改ID',
          avatarImgId: 18723583510950270,
          avatarUrl:
            'http://p1.music.126.net/-RUgrsay56NqOXHIYKZjKA==/18723583510950274.jpg',
          backgroundImgId: 109951164591180050,
          backgroundUrl:
            'http://p1.music.126.net/OvebeOTHv3egUOxKTs8h-A==/109951164591180043.jpg',
          signature: '2016',
          createTime: 1439569209153,
          userName: '1_********875',
          accountType: 1,
          shortUserName: '********875',
          birthday: 930240000000,
          authority: 0,
          gender: 1,
          accountStatus: 0,
          province: 440000,
          city: 441300,
          authStatus: 0,
          description: null,
          detailDescription: null,
          defaultAvatar: false,
          expertTags: null,
          experts: null,
          djStatus: 0,
          locationStatus: 30,
          vipType: 0,
          followed: false,
          mutual: false,
          authenticated: false,
          lastLoginTime: 1648380665982,
          lastLoginIP: '14.150.143.248',
          remarkName: null,
          viptypeVersion: 1589299906269,
          authenticationTypes: 0,
          avatarDetail: null,
          anchor: false
        }
      },
      listData: {
        dj: [], // 电台
        hotArtists: [], // 热门歌手
        community: [], // 社区
        recommends: [], // 推荐歌单
        records: [], // 听歌记录
        recommendPerson: [], // 推荐新曲
        recommendMv: [] // 推荐MV
      }
    }
  },
  created () {
    this.getCommunity()
    this.getRecommend()
    this.getRecords()
    this.getNewsong()
    this.getMv()
    this.getHotArtists()
  },
  methods: {
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
    // 主页菜单切换
    homeTabsChange (val) {
      console.log(val)
    },
    // fetch数据转json
    fetchToJson (url) {
      return new Promise((resolve, reject) => {
        fetch(url).then((res) => {
          res.json().then((resJson) => {
            if (resJson.code === 200) {
              resolve(resJson)
            } else {
              reject(resJson)
            }
          })
        })
      })
    },
    // 社区精选
    getCommunity () {
      this.fetchToJson(this.API.GET_COMMUNITY).then((resJson) => {
        this.listData.community = resJson.playlists.map((v) => {
          v.picUrl = v.coverImgUrl
          v.desc1 = v.trackCount + '首音乐'
          return v
        })
        // {{ rmdItem.trackCount }}首歌曲
      })
    },
    // 今日推荐
    getRecommend () {
      this.fetchToJson(this.API.GET_RECOMMENDS).then((resJson) => {
        this.listData.recommends = resJson.result.map((v) => {
          v.desc1 = this.convertDate(v.trackNumberUpdateTime / 1000)
          v.desc2 = v.trackCount + '首音乐'
          return v
        })
      })
    },
    // 播放记录/最近播放
    getRecords () {
      this.fetchToJson(this.API.GET_RECORDS).then((resJson) => {
        this.listData.records = resJson.weekData.map((v) => {
          console.dir(v)
          v.desc1 = this.pickUpName(v.song.ar)
          v.desc2 = v.song.al.name
          v.picUrl = v.song.al.picUrl
          return v
        })
      })
    },
    // 播放记录/最近播放
    getNewsong () {
      this.fetchToJson(this.API.GET_PERSON_NEWSONG).then((resJson) => {
        this.listData.recommendPerson = resJson.result.map((v) => {
          v.desc1 = v.song.album.type
          v.desc2 = this.pickUpName(v.song.artists)
          return v
        })
      })
    },
    // 推荐MV
    getMv () {
      this.fetchToJson(this.API.GET_RECOMMENDS_MV).then((resJson) => {
        this.listData.recommendMv = resJson.result.map((v) => {
          v.desc1 = v.artistName
          v.desc2 = v.playCount + '万次播放'
          return v
        })
      })
    },
    // 获取热门歌手
    getHotArtists () {
      this.fetchToJson(this.API.GET_HOT_ARTISTS).then((resJson) => {
        this.listData.hotArtists = resJson.artists.map((v) => {
          v.picUrl = v.img1v1Url
          v.desc1 = '艺人'
          return v
        })
      })
    }
  },
  computed: {
    // 时间转换
    convertDate () {
      return function (date) {
        const recordDate = new Date(date * 1000)
        // const year = recordDate.getFullYear()
        const month = recordDate.getMonth() + 1
        const day = recordDate.getDate()
        // const hours = recordDate.getHours()
        // const minutes = recordDate.getMinutes()
        // ${hours.toString().length === 1 ? '0' + hours : hours}:${minutes.toString().length === 1 ? '0' + minutes : minutes}
        return `${month}月${day}日`
      }
    },
    // 提取歌手名字
    pickUpName () {
      return function (artists, Separator = '/') {
        return artists
          .map((n) => {
            if (n.name) return n.name
            else return n
          })
          .join(Separator)
      }
    },
    // section筛选 无数据时不显示
    sectionScreen () {
      return this.sectionData.filter(
        (v) => this.listData[v.li.source].length > 0
      )
    }
  }
}
</script>

<style lang="less">
#home {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 1);

  #main-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.6)
    );
  }

  #main-img {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    object-fit: cover;
  }

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
        align-items: flex-start;
        font-weight: bold;

        img {
          height: 34px;
          width: 34px;
          margin: 0 4px 0 0;
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
    }

    // 子菜单
    .sub-title {
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    }

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
  }
}
</style>
