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
    <div id="audioPlayerWrap">
      <!-- <audio
        id="audioPlayer"
        ref="audioPlayer"
        crossorigin="anonymous"
        :src="songUrl"
        autoplay
        controls
      ></audio> -->
      <!-- https://music.163.com/song/media/outer/url?id=190360.mp3 -->
      <!-- http://m8.music.126.net/20220329133534/ec5fbb5184ae8b2eb2d5a75acf55181e/ymusic/0728/dfa3/dcd3/9e66df76a49666e41e7a5807005bc329.mp3 -->
      <div class="player-main">
        <!-- 进度条 -->
        <div class="player-progress">
          <div class="player-progress-rail">
            <div class="player-progress-bg">
              <div class="player-progress-point"></div>
            </div>
          </div>
        </div>
        <!-- 歌曲信息 -->
        <div class="player-song">
          <div>
            <img :src="curSong.al.picUrl" alt="" />
          </div>
          <div class="player-song-desc">
            <p>{{ curSong.name }}</p>
            <p>
              {{ pickUpName(curSong.ar) }} •
              {{ new Date(752083200000).getFullYear() }}
            </p>
          </div>
        </div>
        <!-- 中控 -->
        <div class="player-controls">
          <div class="player-controls-left">
            <button
              style="--button-size: 32px"
              class="d4u88Fc9OM6kXh7FYYRj"
              disabled=""
              role="switch"
              aria-checked="false"
              aria-label="开启随机播放"
              data-testid="control-button-shuffle"
              aria-expanded="false"
            >
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                class="Svg-sc-1bi12j5-0 hDgDGI"
              >
                <path
                  d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z"
                ></path>
                <path
                  d="M7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 001.724.804h1.947l-1.017-1.018a.75.75 0 111.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34l-.787-.938z"
                ></path>
              </svg>
            </button>
            <button
              style="--button-size: 32px"
              class="FKTganvAaWqgK6MUhbkx"
              disabled=""
              aria-label="上一首"
              aria-expanded="false"
            >
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                class="Svg-sc-1bi12j5-0 hDgDGI"
              >
                <path
                  d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="player-controls-center">
            <button @click="audioPlay">
              <!-- 开始 -->
              <svg
                v-if="getPlayStatus"
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"
                ></path>
              </svg>
              <!-- 暂停 -->
              <svg v-else role="img" height="16" width="16" viewBox="0 0 16 16">
                <path
                  d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="player-controls-right">
            <button
              style="--button-size: 32px"
              class="ARtnAVxkbmzyEjniZXVO"
              disabled=""
              aria-label="下一首"
              data-testid="control-button-skip-forward"
              aria-expanded="false"
            >
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                class="Svg-sc-1bi12j5-0 hDgDGI"
              >
                <path
                  d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"
                ></path>
              </svg></button
            ><button
              style="--button-size: 32px"
              class="bQY5A9SJfdFiEvBMM6J5"
              disabled=""
              role="checkbox"
              aria-checked="false"
              aria-label="关闭循环播放"
              data-testid="control-button-repeat"
              aria-expanded="false"
            >
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                class="Svg-sc-1bi12j5-0 hDgDGI"
              >
                <path
                  d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 调整音量 -->
        <div class="player-volume">
          <div>
            <button @click="switchVolume">
              <!-- 静音icon -->
              <svg
                v-if="config.volumeProgress === 0"
                role="presentation"
                height="16"
                width="16"
                aria-label="Volume off"
                id="volume-icon"
                viewBox="0 0 16 16"
              >
                <path
                  d="M13.86 5.47a.75.75 0 00-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 008.8 6.53L10.269 8l-1.47 1.47a.75.75 0 101.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 001.06-1.06L12.39 8l1.47-1.47a.75.75 0 000-1.06z"
                ></path>
                <path
                  d="M10.116 1.5A.75.75 0 008.991.85l-6.925 4a3.642 3.642 0 00-1.33 4.967 3.639 3.639 0 001.33 1.332l6.925 4a.75.75 0 001.125-.649v-1.906a4.73 4.73 0 01-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 01-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"
                ></path>
              </svg>
              <!-- 低音量icon -->
              <svg
                v-else-if="config.volumeProgress <= 25"
                role="presentation"
                height="16"
                width="16"
                aria-label="Volume low"
                id="volume-icon"
                viewBox="0 0 16 16"
              >
                <path
                  d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 010 4.88z"
                ></path>
              </svg>
              <!-- 中音量icon -->
              <svg
                v-else-if="config.volumeProgress <= 75"
                role="presentation"
                height="16"
                width="16"
                aria-label="Volume medium"
                id="volume-icon"
                viewBox="0 0 16 16"
                class="Svg-sc-1bi12j5-0 hDgDGI"
              >
                <path
                  d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 000-8.474v1.65a2.999 2.999 0 010 5.175v1.649z"
                ></path>
              </svg>
              <!-- 高音量icon -->
              <svg
                v-else
                role="presentation"
                height="16"
                width="16"
                aria-label="Volume high"
                id="volume-icon"
                viewBox="0 0 16 16"
                class="Svg-sc-1bi12j5-0 hDgDGI"
              >
                <path
                  d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 010 4.88z"
                ></path>
                <path
                  d="M11.5 13.614a5.752 5.752 0 000-11.228v1.55a4.252 4.252 0 010 8.127v1.55z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="player-volume-progress" ref="player-volume-progress">
            <div
              class="player-progress-point"
              :style="{ transform: `translateX(${getVolumeProgress})` }"
            ></div>
            <!-- 滑轨背景 s -->
            <div class="player-progress-bg">
              <!-- 滑轨前景 s -->
              <div
                class="player-progress-fg"
                :style="{ transform: `translateX(${getVolumeProgress})` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTabs from '@/components/sub-tabs'
import API from '@/config/api'

export default {
  name: 'HomeView',
  components: {
    subTabs
  },
  data () {
    return {
      // 当前播放的歌曲
      audioInfo: {
        audioEl: '', // 元素节点
        songUrl: '', // 音频链接
        playStatus: false, // 播放状态
        timeStamp: '' // 歌曲长度 单位秒 audioEl.timeStamp
      },
      curSong: {
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
    // this.getCommunity()
    // this.getRecommend()
    // this.getRecords()
    // this.getNewsong()
    // this.getMv()
    // this.getHotArtists()
    this.getRedirect()
  },
  mounted () {
    const volumeHandle = () => {
      const volumeProgress = this.$refs['player-volume-progress']
      const volumeMouseMove = (e) => {
        let x = e.clientX - volumeProgress.offsetLeft
        if (x <= 0) x = 0
        else if (x >= 100) x = 100
        this.config.volumeProgress = x // 0~100
        this.audioInfo.audioEl.volume = x / 100
      }
      volumeProgress.addEventListener('mousedown', () => {
        document.addEventListener('mousemove', volumeMouseMove)
      })
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', volumeMouseMove)
      })
    }
    volumeHandle()
  },
  methods: {
    // 获取重定向url
    async getRedirect () {
      const url = await fetch(
        `https://zusheng.club/api/redirect?url=${encodeURIComponent(
          'https://music.163.com/song/media/outer/url?id=190360.mp3'
        )}`
      )
      this.audioInfo.songUrl = await url.text()
      //
      //
      //
      this.audioInfo.audioEl = document.createElement('audio')
      this.audioInfo.audioEl.controls = 'controls'
      // this.audioInfo.audioEl.autoplay = 'autoplay'
      // this.audioInfo.audioEl.muted = 'muted'
      this.audioInfo.audioEl.src = this.audioInfo.songUrl
      this.audioInfo.audioEl.load()
      this.audioInfo.audioEl.addEventListener('canplay', (e) => {
        console.log('可以播放')
      })
      this.audioInfo.audioEl.addEventListener('play', (e) => {
        this.audioInfo.playStatus = true
        console.log('播放开始')
      })
      this.audioInfo.audioEl.addEventListener('pause', (e) => {
        this.audioInfo.playStatus = false
        console.log('播放暂停')
      })
      this.audioInfo.audioEl.addEventListener('durationchange', (e) => {
        console.log(e, 'durationchange')
      })

      this.audioInfo.audioEl.addEventListener('seeked', (e) => {
        console.log('缓冲被打断', 'seeked')
      })
      this.audioInfo.audioEl.addEventListener('progress', (e) => {
        console.log('progress', this.audioInfo.audioEl.buffered.end(0))
      })
      this.audioInfo.audioEl.addEventListener('timeupdate', (e) => {
        console.log('timeupdate', this.audioInfo.audioEl.currentTime)
      })
    },
    // 开始/暂停播放
    audioPlay () {
      // 如果正在播放
      if (this.audioInfo.playStatus) {
        this.audioInfo.playStatus = false
        this.audioInfo.audioEl.pause()
      } else {
        this.audioInfo.playStatus = true
        this.audioInfo.audioEl.play()
      }
    },
    // 调整音量
    switchVolume () {
      if (this.config.volumeProgress > 0) {
        this.config.volumeProgress = 0
      } else {
        this.config.volumeProgress = 30
      }
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
    // 播放状态
    getPlayStatus () {
      return this.audioInfo.playStatus
    },
    // 获取音量
    getVolumeProgress () {
      return `${this.config.volumeProgress}px`
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

  #audioPlayerWrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: rgba(24, 24, 24, 1);
    box-shadow: 0px 0px 1px rgba(255, 255, 255, 1);
    // 通用按钮
    button {
      width: 32px;
      height: 32px;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 8px;
      cursor: pointer;
      * {
        color: #535353;
        transition: color 0.2s;
      }
      svg {
        fill: currentcolor;
        height: 16px;
        width: 16px;
      }
      &:hover {
        * {
          color: #ccc;
        }
      }
    }
    // 原生audio标签
    #audioPlayer {
      visibility: hidden;
      height: 0;
      width: 0;
    }
    .player-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 24px 0 12px;
      box-sizing: border-box;
      position: relative;
      // 进度条
      .player-progress {
        width: 100%;
        height: 24px; // 透明区域，鼠标进入后可以调整进度条
        background: transparent;
        position: absolute;
        top: -6px;
        left: 0;
        z-index: 2;
        cursor: pointer;
        .player-progress-rail {
          --progress-rail-height: 3px;
          width: 100%;
          height: var(--progress-rail-height);
          background: #535353;
          margin-top: 3px;
        }
        .player-progress-bg {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          background: rgba(240, 0, 0, 0.8);
          transform: translateX(-90%);
          .player-progress-point {
            display: none;
            --progress-point-size: 16px;
            height: var(--progress-point-size);
            width: var(--progress-point-size);
            background: #fff;
            position: absolute;
            right: calc(var(--progress-point-size) * -1);
            top: calc(
              (var(--progress-point-size) - var(--progress-rail-height)) / -2
            );
            border-radius: 50%;
            z-index: 2;
          }
        }

        &:hover {
          .player-progress-rail {
            --progress-rail-height: 8px;
            width: 100%;
            height: var(--progress-rail-height);
            background: #535353;
            margin-top: 1px;
            .player-progress-point {
              display: block;
            }
          }
        }
      }
      // 歌曲信息
      .player-song {
        flex: 1;
        height: 100%;
        display: flex;
        > div {
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          img {
            height: 48px;
            border-radius: 3px;
            margin-right: 12px;
            cursor: pointer;
          }
          &[class="player-song-desc"] {
            p:hover {
              cursor: pointer;
              text-decoration: underline;
            }
            p:first-child {
              font-size: 14px;
            }
            p:last-child {
              font-size: 11px;
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
      }
      // 控制按钮
      .player-controls {
        display: flex;
        justify-content: center;
        flex: 1;
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          &[class="player-controls-center"] {
            border-radius: 50%;
            background: #535353;
            margin: 0 12px;
            transition: all 0.2s;
            * {
              color: #141414;
            }
            button {
              margin: 0;
            }
            &:hover {
              background: #ccc;
              transform: scale(1.08);
            }
          }
        }
      }
      // 音量控制
      .player-volume {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .player-volume-progress {
          height: 12px;
          width: 100px;
          display: flex;
          align-items: center;
          position: relative;
          .hidden-label {
            visibility: hidden;
            width: 0;
            height: 0;
          }
          .player-progress-point {
            height: 12px;
            width: 12px;
            background: #f2f2f2;
            border-radius: 50%;
            position: absolute;
            left: -6px;
            z-index: 100;
            cursor: pointer;
            transform: translateX(100px);
          }
          .player-progress-bg {
            width: 100px;
            height: 4px;
            border-radius: 4px;
            position: relative;
            background: #fff;
            overflow: hidden;
            .player-progress-fg {
              height: 100%;
              width: 100%;
              transform: translateX(0);
              background: #535353;
            }
          }
        }
      }
    }
  }

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
