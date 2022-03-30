<template>
  <div id="home">
    <header>
      <nav>
        <div class="logo">
          <img src="../assets/logo.png" alt="" />
          Music
        </div>
        <SubTabs :sourceData="config.homeTabsData" @change="homeTabsChange" />
        <div class="avatar">
          <img :src="$store.getters.userInfo.profile.avatarUrl" alt="" />
          <!-- <span>{{ userInfo.profile.nickname }}</span> -->
        </div>
      </nav>
    </header>
    <main>
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
          <li v-for="rmdItem in listData.recommendPerson" :key="rmdItem.id">
            <figure>
              <img :src="rmdItem.picUrl" alt="" />
              <div class="section-newSong-desc">
                <p>{{ rmdItem.name }}</p>
                <p>{{ pickUpName(rmdItem.song.artists) }}</p>
              </div>
            </figure>
          </li>
        </ul>
      </section>
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
            <SubTabs
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
    <PlayerAudio
      :name="curSong.name"
      :poster="curSong.al.picUrl"
      :artisis="pickUpName(curSong.ar)"
      :pubTime="getPubTime(curSong.publishTime)"
      :songUrl="curSong.songUrl"
    ></PlayerAudio>
  </div>
</template>

<script>
import SubTabs from '@/components/SubTabs'
import PlayerAudio from '@/components/PlayerAudio'
import API from '@/config/api'
import moment from 'moment'

export default {
  name: 'HomeView',
  components: {
    SubTabs,
    PlayerAudio
  },
  data () {
    return {
      curSong: {
        songUrl: '',
        name: '等你等到我心痛',
        id: 190360,
        pst: 0,
        t: 0,
        ar: [
          {
            id: 6460,
            name: '张学友',
            tns: [],
            alias: ['Jacky Cheung'],
            alia: ['Jacky Cheung']
          }
        ],
        alia: [],
        pop: 100,
        st: 0,
        rt: '',
        fee: 8,
        v: 38,
        crbt: null,
        cf: '',
        al: {
          id: 19237,
          name: '等你等到我心痛 张学友精选',
          picUrl:
            'http://p3.music.126.net/Frx9MSEa-t_QtBLNy2GDew==/109951166860255517.jpg',
          tns: [],
          pic_str: '109951166860255517',
          pic: 109951166860255520
        },
        dt: 255466,
        h: {
          br: 320000,
          fid: 0,
          size: 10221236,
          vd: 675
        },
        m: {
          br: 192000,
          fid: 0,
          size: 6132759,
          vd: 675
        },
        l: {
          br: 128000,
          fid: 0,
          size: 4088520,
          vd: 675
        },
        a: null,
        cd: '1',
        no: 1,
        rtUrl: null,
        ftype: 0,
        rtUrls: [],
        djId: 0,
        copyright: 1,
        s_id: 0,
        mark: 8192,
        originCoverType: 1,
        originSongSimpleData: null,
        resourceState: true,
        version: 38,
        single: 0,
        noCopyrightRcmd: null,
        rtype: 0,
        rurl: null,
        mst: 9,
        cp: 7003,
        mv: 5343605,
        publishTime: 752083200000,
        privilege: {
          id: 190360,
          fee: 8,
          payed: 0,
          st: 0,
          pl: 128000,
          dl: 0,
          sp: 7,
          cp: 1,
          subp: 1,
          cs: false,
          maxbr: 999000,
          fl: 128000,
          toast: false,
          flag: 260,
          preSell: false,
          playMaxbr: 999000,
          downloadMaxbr: 999000,
          rscl: null,
          freeTrialPrivilege: {
            resConsumable: false,
            userConsumable: false
          },
          chargeInfoList: [
            {
              rate: 128000,
              chargeUrl: null,
              chargeMessage: null,
              chargeType: 0
            },
            {
              rate: 192000,
              chargeUrl: null,
              chargeMessage: null,
              chargeType: 1
            },
            {
              rate: 320000,
              chargeUrl: null,
              chargeMessage: null,
              chargeType: 1
            },
            {
              rate: 999000,
              chargeUrl: null,
              chargeMessage: null,
              chargeType: 1
            }
          ]
        },
        lyrics: [
          '<b>等你等你等你</b>',
          '一世一世<b>等你</b>',
          '<b>我</b>真的真的不愿舍弃',
          '很想当天的一切能回味',
          '想<b>你</b>想<b>你</b>苦<b>痛</b>'
        ]
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
        volumeProgress: 30,
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
    this.getRedirect()
  },
  mounted () {},
  methods: {
    // 获取重定向url(MP3url)
    getRedirect () {
      fetch(
        `https://zusheng.club/api/redirect?url=${encodeURIComponent(
          'https://music.163.com/song/media/outer/url?id=190360.mp3'
        )}`
      ).then((res) => {
        res.text().then((url) => {
          this.curSong.songUrl = url
        })
      })
    },
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
      this.fetchToJson(API.GET_COMMUNITY).then((resJson) => {
        this.listData.community = resJson.playlists.map((v) => {
          v.picUrl = v.coverImgUrl
          v.desc1 = v.trackCount + '首音乐'
          return v
        })
      })
    },
    // 今日推荐
    getRecommend () {
      this.fetchToJson(API.GET_RECOMMENDS).then((resJson) => {
        this.listData.recommends = resJson.result.map((v) => {
          v.desc1 = this.convertDate(v.trackNumberUpdateTime / 1000)
          v.desc2 = v.trackCount + '首音乐'
          return v
        })
      })
    },
    // 播放记录/最近播放
    getRecords () {
      this.fetchToJson(API.AUTH.GET_RECORDS).then((resJson) => {
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
      this.fetchToJson(API.GET_PERSON_NEWSONG).then((resJson) => {
        this.listData.recommendPerson = resJson.result.map((v) => {
          v.desc1 = v.song.album.type
          v.desc2 = this.pickUpName(v.song.artists)
          return v
        })
      })
    },
    // 推荐MV
    getMv () {
      this.fetchToJson(API.GET_RECOMMENDS_MV).then((resJson) => {
        this.listData.recommendMv = resJson.result.map((v) => {
          v.desc1 = v.artistName
          v.desc2 = v.playCount + '万次播放'
          return v
        })
      })
    },
    // 获取热门歌手
    getHotArtists () {
      this.fetchToJson(API.GET_HOT_ARTISTS).then((resJson) => {
        this.listData.hotArtists = resJson.artists.map((v) => {
          v.picUrl = v.img1v1Url
          v.desc1 = '艺人'
          return v
        })
      })
    }
  },
  computed: {
    // player获取时间
    getPubTime () {
      return function (timeStamp) {
        return moment(timeStamp).format('YYYY')
      }
    },
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
              display: flex;
              align-items: center;
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
}
</style>
