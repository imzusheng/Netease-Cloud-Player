<template>
  <div id="home">
    <header>
      <nav>
        <div class="logo">
          <img src="../assets/logo.png" alt="" />
          Music
        </div>
        <ul>
          <li>首页</li>
          <li>探索</li>
          <li>媒体库</li>
          <li>搜索</li>
        </ul>
        <div class="avatar">
          <img :src="userInfo.profile.avatarUrl" alt="" />
          <span>{{ userInfo.profile.nickname }}</span>
        </div>
      </nav>
    </header>
    <main>
      <!-- 模板 -->
      <section
        class="section-common"
        v-for="sectionItem in sectionData"
        :key="`section-${sectionItem.id}`"
      >
        <div class="section-common-title">
          <div>
            <p>{{ sectionItem.subTitle }}</p>
            <h2>{{ sectionItem.title }}</h2>
          </div>
          <div>查看更多</div>
        </div>
        <ul class="section-common-list">
          <li
            class="section-common-item"
            v-for="(listItem, listKey) in listData[sectionItem.li.source]"
            :key="`${sectionItem.id}-${listKey}`"
          >
            <figure>
              <img :src="listItem[sectionItem.li.img]" alt="" />
              <p>{{ listItem.name }}</p>
              <p>
                {{ listItem.desc1 }}
                 {{ sectionItem.li.join }} 
                {{ listItem.desc2 }}
              </p>
            </figure>
          </li>
        </ul>
      </section>
      <!-- 今日推荐 -->
      <section class="section-common">
        <div class="section-common-title">
          <div>
            <p>挑选歌曲，开始收听电台</p>
            <h2>为你推荐</h2>
          </div>
          <div>查看更多</div>
        </div>
        <ul class="section-common-list">
          <li
            class="section-common-item"
            v-for="rmdItem in listData.recommends"
            :key="rmdItem.id"
          >
            <figure>
              <img :src="rmdItem.picUrl" alt="" />
              <p>{{ rmdItem.name }}</p>
              <p>
                {{ convertDate(rmdItem.trackNumberUpdateTime / 1000) }} •
                {{ rmdItem.trackCount }}首歌曲
              </p>
            </figure>
          </li>
        </ul>
      </section>
      <!-- 听歌记录 -->
      <section class="section-common records" data-auth>
        <div class="section-common-title">
          <div>
            <h2>最近播放</h2>
          </div>
          <div>
            <a href="#">查看更多</a>
          </div>
        </div>
        <ul class="section-common-list">
          <li
            class="section-common-item"
            v-for="rmdItem in listData.records"
            :key="rmdItem.song.id"
          >
            <figure>
              <img :src="rmdItem.song.al.picUrl" alt="" />
              <p>{{ rmdItem.song.name }}</p>
              <p>
                {{ pickUpName(rmdItem.song.ar) }} - {{ rmdItem.song.al.name }}
              </p>
            </figure>
          </li>
        </ul>
      </section>
      <!-- 新曲 -->
      <section class="section-common recommend-person">
        <div class="section-common-title">
          <h2>为你准备的新曲</h2>
        </div>
        <ul class="section-common-list">
          <li
            class="section-common-item"
            v-for="rmdItem in listData.recommendPerson"
            :key="rmdItem.id"
          >
            <figure>
              <img
                :src="rmdItem.picUrl"
                :class="{ posterRound: rmdItem.song.album.type !== '专辑' }"
                alt=""
              />
              <p>{{ rmdItem.name }}</p>
              <p>
                {{ rmdItem.song.album.type }} •
                {{ pickUpName(rmdItem.song.artists) }}
              </p>
            </figure>
          </li>
        </ul>
      </section>
      <!-- MV -->
      <section class="section-common">
        <div class="section-common-title">
          <div><h2>推荐的MV</h2></div>
          <div><a href="#">查看更多</a></div>
        </div>
        <ul class="section-common-list">
          <li
            class="section-mv-item"
            v-for="rmdItem in listData.recommendMv"
            :key="rmdItem.id"
          >
            <figure>
              <img :src="rmdItem.picUrl" alt="" />
              <p>{{ rmdItem.name }}</p>
              <p>{{ rmdItem.artistName }} • {{ rmdItem.playCount }}万次播放</p>
            </figure>
          </li>
        </ul>
      </section>
      <!-- 社区精选 -->
      <section class="section-common">
        <div class="section-common-title">
          <div>
            <h2>来自社区</h2>
          </div>
          <div><a href="#">查看更多</a></div>
        </div>
        <ul class="section-common-list">
          <li
            class="section-common-item"
            v-for="rmdItem in listData.community"
            :key="rmdItem.id"
          >
            <figure>
              <span> <img :src="rmdItem.coverImgUrl" alt="" /></span>
              <p>{{ rmdItem.name }}</p>
              <p>{{ rmdItem.trackCount }}首歌曲</p>
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
        GET_COMMUNITY: `${API_ROOT}/top/playlist?limit=6`
      },
      sectionData: [
        {
          id: 'section-tj',
          title: '为你推荐',
          subTitle: '挑选歌曲，开始收听电台',
          moreUrl: '',
          li: {
            source: 'recommends',
            img: 'picUrl',
            join: '•'
          }
        }
      ],
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
        community: [], // 社区
        // http://localhost:3000/user/record?type=1
        records: [
          {
            playCount: 1,
            score: 100,
            song: {
              name: 'sense of alienation',
              id: 558261050,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 12610111,
                  name: 'drcchen',
                  tns: [],
                  alias: []
                }
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: null,
              fee: 0,
              v: 10,
              crbt: null,
              cf: '',
              al: {
                id: 38602577,
                name: '失落',
                picUrl:
                  'http://p4.music.126.net/3VF32YF6KxiWhu5HPThHIw==/109951163287304909.jpg',
                tns: [],
                pic_str: '109951163287304909',
                pic: 109951163287304910
              },
              dt: 144199,
              h: {
                br: 320000,
                fid: 0,
                size: 5769970,
                vd: 1526
              },
              m: {
                br: 192000,
                fid: 0,
                size: 3462000,
                vd: 4378
              },
              l: {
                br: 128000,
                fid: 0,
                size: 2308014,
                vd: 5199
              },
              a: null,
              cd: '01',
              no: 1,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 2,
              s_id: 0,
              mark: 262144,
              originCoverType: 1,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 0,
              mv: 0,
              publishTime: 1525651200000,
              privilege: {
                id: 558261050,
                fee: 0,
                payed: 0,
                st: 0,
                pl: 320000,
                dl: 320000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 320000,
                fl: 320000,
                toast: false,
                flag: 0,
                preSell: false
              }
            }
          },
          {
            playCount: 1,
            score: 100,
            song: {
              name: 'Something Just Like This',
              id: 506288341,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 12074883,
                  name: 'We Rabbitz',
                  tns: [],
                  alias: []
                },
                {
                  id: 13157086,
                  name: 'Adam Christopher',
                  tns: [],
                  alias: []
                },
                {
                  id: 203178,
                  name: 'Guy Berryman',
                  tns: [],
                  alias: []
                },
                {
                  id: 688269,
                  name: 'Chris Martin',
                  tns: [],
                  alias: []
                },
                {
                  id: 13080339,
                  name: 'Andrew Taggart',
                  tns: [],
                  alias: []
                }
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: null,
              fee: 1,
              v: 15,
              crbt: null,
              cf: '',
              al: {
                id: 36234175,
                name: 'Something Just Like This',
                picUrl:
                  'http://p3.music.126.net/UD3kw3eRSkROgYV1F3A8bA==/109951165777579745.jpg',
                tns: [],
                pic_str: '109951165777579745',
                pic: 109951165777579740
              },
              dt: 201040,
              h: {
                br: 320002,
                fid: 0,
                size: 8044713,
                vd: -51084
              },
              m: {
                br: 192002,
                fid: 0,
                size: 4826845,
                vd: -48552
              },
              l: {
                br: 128002,
                fid: 0,
                size: 3217911,
                vd: -47093
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
              mark: 262144,
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 1416618,
              mv: 0,
              publishTime: 1487952000000,
              privilege: {
                id: 506288341,
                fee: 1,
                payed: 0,
                st: 0,
                pl: 0,
                dl: 0,
                sp: 0,
                cp: 0,
                subp: 0,
                cs: false,
                maxbr: 999000,
                fl: 0,
                toast: false,
                flag: 0,
                preSell: false
              }
            }
          },
          {
            playCount: 1,
            score: 100,
            song: {
              name: 'All My Love (feat. Conor Maynard)',
              id: 488953680,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 50905,
                  name: 'Cash Cash',
                  tns: [],
                  alias: []
                }
              ],
              alia: [],
              pop: 90,
              st: 0,
              rt: null,
              fee: 1,
              v: 30,
              crbt: null,
              cf: '',
              al: {
                id: 35683622,
                name: 'All My Love (feat. Conor Maynard)',
                picUrl:
                  'http://p4.music.126.net/xK9Lnplo3blu82sOj2qxag==/109951166176833651.jpg',
                tns: [],
                pic_str: '109951166176833651',
                pic: 109951166176833650
              },
              dt: 191373,
              h: {
                br: 320000,
                fid: 0,
                size: 7656011,
                vd: -30800
              },
              m: {
                br: 192000,
                fid: 0,
                size: 4593624,
                vd: -28300
              },
              l: {
                br: 128000,
                fid: 0,
                size: 3062431,
                vd: -26800
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
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5673191,
              publishTime: 1499356800007,
              privilege: {
                id: 488953680,
                fee: 1,
                payed: 0,
                st: 0,
                pl: 0,
                dl: 0,
                sp: 0,
                cp: 0,
                subp: 0,
                cs: false,
                maxbr: 320000,
                fl: 0,
                toast: false,
                flag: 4,
                preSell: false
              }
            }
          },
          {
            playCount: 1,
            score: 100,
            song: {
              name: 'Love Me Like You Do',
              id: 36308236,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 56598,
                  name: 'Ellie Goulding',
                  tns: [],
                  alias: []
                }
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: null,
              fee: 8,
              v: 49,
              crbt: null,
              cf: '',
              al: {
                id: 3295555,
                name: 'Delirium',
                picUrl:
                  'http://p3.music.126.net/7deg2d350EGJ2Y8TzIPGMw==/109951166006469869.jpg',
                tns: [],
                pic_str: '109951166006469869',
                pic: 109951166006469870
              },
              dt: 252533,
              h: {
                br: 320000,
                fid: 0,
                size: 10104207,
                vd: -25600
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6062542,
                vd: -23200
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4041709,
                vd: -21800
              },
              a: null,
              cd: '1',
              no: 9,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              mark: 270336,
              originCoverType: 1,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7003,
              mv: 380438,
              publishTime: 1446739200000,
              privilege: {
                id: 36308236,
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
                flag: 4,
                preSell: false
              }
            }
          },
          {
            playCount: 1,
            score: 100,
            song: {
              name: 'you’ve changed, i’ve changed',
              id: 1849196940,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 1017035,
                  name: 'San Holo',
                  tns: [],
                  alias: []
                },
                {
                  id: 1150093,
                  name: 'Chet Porter',
                  tns: [],
                  alias: []
                }
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: '',
              fee: 8,
              v: 6,
              crbt: null,
              cf: '',
              al: {
                id: 128204234,
                name: 'bb u ok?',
                picUrl:
                  'http://p3.music.126.net/YW4YW9d1tDD0VJ22aGe8Mw==/109951166046770518.jpg',
                tns: [],
                pic_str: '109951166046770518',
                pic: 109951166046770510
              },
              dt: 311625,
              h: {
                br: 320000,
                fid: 0,
                size: 12467766,
                vd: -59872
              },
              m: {
                br: 192000,
                fid: 0,
                size: 7480677,
                vd: -57341
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4987133,
                vd: -55858
              },
              a: null,
              cd: '01',
              no: 19,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              mark: 270336,
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 1416676,
              mv: 14291862,
              publishTime: 1622736000000,
              privilege: {
                id: 1849196940,
                fee: 8,
                payed: 0,
                st: 0,
                pl: 128000,
                dl: 0,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 320000,
                fl: 128000,
                toast: false,
                flag: 4,
                preSell: false
              }
            }
          }
        ],
        topList: [
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '刚刚更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 3908677,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648347412098,
            userId: 1,
            createTime: 1404115136883,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166952713760,
            anonimous: false,
            updateTime: 1648347412164,
            trackUpdateTime: 1648360474158,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg',
            commentThreadId: 'A_PL_0_19723756',
            totalDuration: 0,
            privacy: 0,
            playCount: 4891031552,
            description: '云音乐中每天热度上升最快的100首单曲，每日更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '飙升榜',
            id: 19723756,
            coverImgId_str: '109951166952713766',
            ToplistType: 'S'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '刚刚更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 2679275,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648347020237,
            userId: 1,
            createTime: 1378721398225,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166952686380,
            anonimous: false,
            updateTime: 1648347020319,
            trackUpdateTime: 1648360241856,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/wVmyNS6b_0Nn-y6AX8UbpQ==/109951166952686384.jpg',
            commentThreadId: 'A_PL_0_3779629',
            totalDuration: 0,
            privacy: 0,
            playCount: 2543299584,
            description:
              '云音乐新歌榜：云音乐用户一周内收听所有新歌（一月内最新发行） 官方TOP排行榜，每天更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '新歌榜',
            id: 3779629,
            coverImgId_str: '109951166952686384',
            ToplistType: 'N'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 698026,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648121649109,
            userId: 201586,
            createTime: 1374732325894,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166961388700,
            anonimous: false,
            updateTime: 1648121649282,
            trackUpdateTime: 1648327261075,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/iFZ_nw2V86IFk90dc50kdQ==/109951166961388699.jpg',
            commentThreadId: 'A_PL_0_2884035',
            totalDuration: 0,
            privacy: 0,
            playCount: 526439424,
            description:
              '云音乐独立原创音乐人作品官方榜单，以推荐优秀原创作品为目的。每周四网易云音乐首发。申请网易音乐人：http://music.163.com/nmusician/',
            ordered: true,
            tags: [],
            status: 0,
            name: '原创榜',
            id: 2884035,
            coverImgId_str: '109951166961388699',
            ToplistType: 'O'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '更新18首',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 11442545,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648341516038,
            userId: 1,
            createTime: 1378721406014,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166952706660,
            anonimous: false,
            updateTime: 1648341516333,
            trackUpdateTime: 1648341516329,
            trackCount: 200,
            coverImgUrl:
              'https://p2.music.126.net/ZyUjc7K_GDpD8MO1-GQkmA==/109951166952706664.jpg',
            commentThreadId: 'A_PL_0_3778678',
            totalDuration: 0,
            privacy: 0,
            playCount: 10316638208,
            description:
              '云音乐热歌榜：云音乐用户一周内收听所有线上歌曲官方TOP排行榜，每日更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '热歌榜',
            id: 3778678,
            coverImgId_str: '109951166952706664',
            ToplistType: 'H'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 722540,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648088929403,
            userId: 1452176465,
            createTime: 1610087424470,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165698553070,
            anonimous: false,
            updateTime: 1648088929560,
            trackUpdateTime: 1648111842051,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/G91csin09maPrNgqcUKnBQ==/109951165698553069.jpg',
            commentThreadId: 'A_PL_0_5453912201',
            totalDuration: 0,
            privacy: 0,
            playCount: 113304432,
            description:
              '黑胶VIP听的歌竟是这些？\n\n搜罗全站曲库，盘点黑胶VIP最爱听的好歌！\n为你提供百分百黑胶VIP专享歌单！\n做最尊贵的黑胶，听最好的歌！\n【每周四更新】',
            ordered: true,
            tags: ['榜单'],
            status: 0,
            name: '黑胶VIP爱听榜',
            id: 5453912201,
            coverImgId_str: '109951165698553069'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 619289,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648174432139,
            userId: 1,
            createTime: 1510290389440,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611553140,
            anonimous: false,
            updateTime: 1648174432252,
            trackUpdateTime: 1648198301526,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/EJyXfGYsiHxxxoCiTAz6Kg==/109951165611553137.jpg',
            commentThreadId: 'A_PL_0_991319590',
            totalDuration: 0,
            privacy: 0,
            playCount: 312227008,
            description:
              '云音乐原创说唱音乐人作品官方榜单，每周五更新。以云音乐用户一周播放热度为主，收录3个月内发行的原创说唱作品，按照综合数据排名取前50名。申请网易音乐人：http://music.163.com/nmusician',
            ordered: true,
            tags: ['华语', '说唱'],
            status: 0,
            name: '云音乐说唱榜',
            id: 991319590,
            coverImgId_str: '109951165611553137'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 392694,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648091918964,
            userId: 1,
            createTime: 1430968920537,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611553520,
            anonimous: false,
            updateTime: 1648091919198,
            trackUpdateTime: 1648091919197,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/7XQ7j5GKsiWQ6hLMtjGGKQ==/109951165611553527.jpg',
            commentThreadId: 'A_PL_0_71384707',
            totalDuration: 0,
            privacy: 0,
            playCount: 58421480,
            description:
              '云音乐用户一周内收听所有古典音乐官方TOP排行榜，每周四更新。',
            ordered: true,
            tags: ['古典'],
            status: 0,
            name: '云音乐古典榜',
            id: 71384707,
            coverImgId_str: '109951165611553527'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 1261428,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648176954011,
            userId: 1,
            createTime: 1510825632233,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951167192415170,
            anonimous: false,
            updateTime: 1648176954099,
            trackUpdateTime: 1648176954100,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/oxltgfAKwRIPhin-5Kxzhw==/109951167192415163.jpg',
            commentThreadId: 'A_PL_0_1978921795',
            totalDuration: 0,
            privacy: 0,
            playCount: 308063776,
            description:
              '云音乐用户一周内收听电子音乐官方TOP排行榜，每周五更新。喜力星电音，用先锋电音带你解锁全新维度和体验！',
            ordered: true,
            tags: ['电子'],
            status: 0,
            name: '云音乐电音榜',
            id: 1978921795,
            coverImgId_str: '109951167192415163'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 212840,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648091975899,
            userId: 1,
            createTime: 1430968935040,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611551680,
            anonimous: false,
            updateTime: 1648091976025,
            trackUpdateTime: 1648091976023,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/pAFaa_EVMj0ktkDo381dnw==/109951165611551680.jpg',
            commentThreadId: 'A_PL_0_71385702',
            totalDuration: 0,
            privacy: 0,
            playCount: 65655804,
            description:
              '云音乐用户一周内收听所有ACG音乐官方TOP排行榜，每周四更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐ACG榜',
            id: 71385702,
            coverImgId_str: '109951165611551680'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 218464,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648094403631,
            userId: 1,
            createTime: 1496201691281,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611550670,
            anonimous: false,
            updateTime: 1648094403755,
            trackUpdateTime: 1648094403741,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/v--zfW0Y0jbexl3CiALGlw==/109951165611550672.jpg',
            commentThreadId: 'A_PL_0_745956260',
            totalDuration: 0,
            privacy: 0,
            playCount: 86545624,
            description:
              '云音乐用户一周内收听所有韩语歌曲官方TOP排行榜，每周四更新。',
            ordered: true,
            tags: ['韩语', '榜单'],
            status: 0,
            name: '云音乐韩语榜',
            id: 745956260,
            coverImgId_str: '109951165611550672'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 227968,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648185848740,
            userId: 48102,
            createTime: 1395988377813,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611482700,
            anonimous: false,
            updateTime: 1648185848806,
            trackUpdateTime: 1648189455610,
            trackCount: 20,
            coverImgUrl:
              'https://p2.music.126.net/6la5fQwcd3YW6ZQHvTiZqw==/109951165611482698.jpg',
            commentThreadId: 'A_PL_0_10520166',
            totalDuration: 0,
            privacy: 0,
            playCount: 79823400,
            description:
              '▲▲▲本榜排名按作品发行时间顺序▲▲▲网易云音乐联合网易放刺、Loopy、加菲众、DJ WENGWENG（灯笼Club）、3ASiC（同步计划）、DJ Senders（沉睡电台）、Eiasn电音厂牌、电悦台（EDM Station） \n打造云音乐“国电榜” ! 每周五为大家带来网易电子音乐人优质新作！',
            ordered: true,
            tags: ['电子', '榜单'],
            status: 0,
            name: '云音乐国电榜',
            id: 10520166,
            coverImgId_str: '109951165611482698'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周一更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 282851,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1647845702698,
            userId: 48333,
            createTime: 1361239766844,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165613082770,
            anonimous: false,
            updateTime: 1647845740382,
            trackUpdateTime: 1648038648699,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/fhAqiflLy3eU-ldmBQByrg==/109951165613082765.jpg',
            commentThreadId: 'A_PL_0_180106',
            totalDuration: 0,
            privacy: 0,
            playCount: 133314752,
            description: 'UK排行榜',
            ordered: true,
            tags: ['榜单', '欧美'],
            status: 0,
            name: 'UK排行榜周榜',
            id: 180106,
            coverImgId_str: '109951165613082765'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周三更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 1293770,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648018157151,
            userId: 48171,
            createTime: 1358823076818,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611413730,
            anonimous: false,
            updateTime: 1648019168212,
            trackUpdateTime: 1648019168211,
            trackCount: 99,
            coverImgUrl:
              'https://p2.music.126.net/rwRsVIJHQ68gglhA6TNEYA==/109951165611413732.jpg',
            commentThreadId: 'A_PL_0_60198',
            totalDuration: 0,
            privacy: 0,
            playCount: 549448640,
            description: '美国Billboard排行榜',
            ordered: true,
            tags: ['流行', '欧美', '榜单'],
            status: 0,
            name: '美国Billboard榜',
            id: 60198,
            coverImgId_str: '109951165611413732'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周三更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 267786,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648016818177,
            userId: 1589393,
            createTime: 1378886589466,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166093489620,
            anonimous: false,
            updateTime: 1648016818313,
            trackUpdateTime: 1648034943594,
            trackCount: 90,
            coverImgUrl:
              'https://p2.music.126.net/oT-RHuPBJiD7WMoU7WG5Rw==/109951166093489621.jpg',
            commentThreadId: 'A_PL_0_3812895',
            totalDuration: 0,
            privacy: 0,
            playCount: 91993320,
            description: 'Beatport全球电子舞曲排行榜TOP100（本榜每周三更新）',
            ordered: true,
            tags: ['欧美', '电子', '榜单'],
            status: 0,
            name: 'Beatport全球电子舞曲榜',
            id: 3812895,
            coverImgId_str: '109951166093489621'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 242580,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1596793320079,
            userId: 30728956,
            createTime: 1405653093230,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165613100060,
            anonimous: false,
            updateTime: 1637920603975,
            trackUpdateTime: 1648022708235,
            trackCount: 10,
            coverImgUrl:
              'https://p2.music.126.net/5wDP78s43ydVTKt62C8OjQ==/109951165613100063.jpg',
            commentThreadId: 'A_PL_0_21845217',
            totalDuration: 0,
            privacy: 0,
            playCount: 64498256,
            description:
              'KTV唛榜是目前国内首个以全国超过200家KTV点歌平台真实数据的当红歌曲榜单。所涉及的KTV店铺覆盖全国近100多个城市，囊括一、二、三线各级城市及地区。在综合全国各地KTV点唱数据的前提下进行汇总与统计。为了保证信息的及时性，唛榜每周五更新。提供给K迷们最新和最准确的数据。',
            ordered: true,
            tags: ['华语', 'KTV', '榜单'],
            status: 0,
            name: 'KTV唛榜',
            id: 21845217,
            coverImgId_str: '109951165613100063'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周三更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 149766,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648046809447,
            userId: 48160,
            createTime: 1357635084874,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611417800,
            anonimous: false,
            updateTime: 1648046809530,
            trackUpdateTime: 1648236583592,
            trackCount: 20,
            coverImgUrl:
              'https://p2.music.126.net/aXUPgImt8hhf4cMUZEjP4g==/109951165611417794.jpg',
            commentThreadId: 'A_PL_0_60131',
            totalDuration: 0,
            privacy: 0,
            playCount: 56550328,
            description: '日本Oricon数字单曲周榜，每周三更新，欢迎关注。',
            ordered: true,
            tags: ['榜单', '日语'],
            status: 0,
            name: '日本Oricon榜',
            id: 60131,
            coverImgId_str: '109951165611417794'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 557353,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648094676863,
            userId: 1,
            createTime: 1558493373769,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165752868980,
            anonimous: false,
            updateTime: 1648094677080,
            trackUpdateTime: 1648094677095,
            trackCount: 200,
            coverImgUrl:
              'https://p2.music.126.net/uN5PupU0rXEuMq0HIlxb_w==/109951165752868980.jpg',
            commentThreadId: 'A_PL_0_2809513713',
            totalDuration: 0,
            privacy: 0,
            playCount: 124743120,
            description:
              '云音乐用户一周内收听所有欧美歌曲官方TOP排行榜，每周四更新。\nWestern Hit Chart (updated every Thursday)',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐欧美热歌榜',
            id: 2809513713,
            coverImgId_str: '109951165752868980'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每天更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 183916,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648265705371,
            userId: 1,
            createTime: 1558493214795,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611546420,
            anonimous: false,
            updateTime: 1648265705528,
            trackUpdateTime: 1648265705526,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/zmcB55ghLQeUSBqbX1SJuA==/109951165611546419.jpg',
            commentThreadId: 'A_PL_0_2809577409',
            totalDuration: 0,
            privacy: 0,
            playCount: 79659616,
            description:
              '云音乐用户一周内收听所有欧美新歌（一月内最新发行）官方TOP排行榜，每天更新。\nWestern New Release Chart (new songs released in last 30 days, updated daily)\n',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐欧美新歌榜',
            id: 2809577409,
            coverImgId_str: '109951165611546419'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 59073,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648179919977,
            userId: 5190793,
            createTime: 1409825013948,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165613108580,
            anonimous: false,
            updateTime: 1648179920031,
            trackUpdateTime: 1648179920027,
            trackCount: 20,
            coverImgUrl:
              'https://p2.music.126.net/-fyzrPWd06FfWl_0JDAxMQ==/109951165613108584.jpg',
            commentThreadId: 'A_PL_0_27135204',
            totalDuration: 0,
            privacy: 0,
            playCount: 21977164,
            description:
              '法国NRJ电台（national Radio de Jeunes）成立于1981年，总部位于法国巴黎。是法国最受欢迎的音乐电台和听众最多的广播电台之一。NRJ音乐奖素有法国的“格莱美”之称。此榜单针对NRJ电台法国本土热门歌曲排行。【每周五更新】',
            ordered: true,
            tags: ['榜单'],
            status: 0,
            name: '法国 NRJ Vos Hits 周榜',
            id: 27135204,
            coverImgId_str: '109951165613108584'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '更新76首',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 47900,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648353610710,
            userId: 1,
            createTime: 1569549838610,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951164432300400,
            anonimous: false,
            updateTime: 1648353610901,
            trackUpdateTime: 1648353610897,
            trackCount: 99,
            coverImgUrl:
              'https://p2.music.126.net/SkGlKQ6acixthb77VlD9eQ==/109951164432300406.jpg',
            commentThreadId: 'A_PL_0_3001835560',
            totalDuration: 0,
            privacy: 0,
            playCount: 4602398,
            description:
              '云音乐中每天热度上升最快的100首ACG动画单曲，每日更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐ACG动画榜',
            id: 3001835560,
            coverImgId_str: '109951164432300406'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '更新87首',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 9571,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648353620313,
            userId: 1,
            createTime: 1569549896656,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951164432303700,
            anonimous: false,
            updateTime: 1648353620512,
            trackUpdateTime: 1648353620510,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/hivOOHMwEmnn9s_6rgZwEQ==/109951164432303700.jpg',
            commentThreadId: 'A_PL_0_3001795926',
            totalDuration: 0,
            privacy: 0,
            playCount: 1683309,
            description:
              '云音乐中每天热度上升最快的100首ACG游戏单曲，每日更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐ACG游戏榜',
            id: 3001795926,
            coverImgId_str: '109951164432303700'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '更新69首',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 9972,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648353627854,
            userId: 1,
            createTime: 1569549925472,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951164432303700,
            anonimous: false,
            updateTime: 1648353628070,
            trackUpdateTime: 1648353628067,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/Ag7RyRCYiINcd9EtRXf6xA==/109951164432303690.jpg',
            commentThreadId: 'A_PL_0_3001890046',
            totalDuration: 0,
            privacy: 0,
            playCount: 711188,
            description: null,
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐ACG VOCALOID榜',
            id: 3001890046,
            coverImgId_str: '109951164432303690'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '双周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 33700,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1647511203366,
            userId: 1861504131,
            createTime: 1575963485139,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165613110610,
            anonimous: false,
            updateTime: 1648116002937,
            trackUpdateTime: 1648116002935,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/_3PD8PcncjtWE0l8WpACGA==/109951165613110607.jpg',
            commentThreadId: 'A_PL_0_3112516681',
            totalDuration: 0,
            privacy: 0,
            playCount: 6851659,
            description:
              '中国新乡村音乐排行榜是国内首个以“新乡村”为主题的音乐榜单。该主题歌曲能够反映出“乡音、乡情、乡恋、乡愁”的情感，让听众感受到“新时代、新乡村、新音乐”。榜单选取符合条件且最近14天热度最高的前50歌曲，每周四更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '中国新乡村音乐排行榜',
            id: 3112516681,
            coverImgId_str: '109951165613110607'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周二更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 74304,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1647911700132,
            userId: 1,
            createTime: 1591863000459,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611548670,
            anonimous: false,
            updateTime: 1647911700322,
            trackUpdateTime: 1648198463699,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/z3pYLlO2LdVNzcuo9PLnFg==/109951165611548673.jpg',
            commentThreadId: 'A_PL_0_5059644681',
            totalDuration: 0,
            privacy: 0,
            playCount: 18735374,
            description:
              '云音乐用户一周内收听所有日语歌曲官方TOP排行榜，每周二更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐日语榜',
            id: 5059644681,
            coverImgId_str: '109951165611548673'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 53548,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648177045990,
            userId: 1,
            createTime: 1591863213389,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611542370,
            anonimous: false,
            updateTime: 1648177046086,
            trackUpdateTime: 1648177046083,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/sk_T3eQMwIOjkOPylZ1vLQ==/109951165611542373.jpg',
            commentThreadId: 'A_PL_0_5059633707',
            totalDuration: 0,
            privacy: 0,
            playCount: 21145430,
            description:
              '云音乐用户一周内收听所有摇滚歌曲官方TOP排行榜，每周五更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐摇滚榜',
            id: 5059633707,
            coverImgId_str: '109951165611542373'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 303168,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648177158870,
            userId: 1,
            createTime: 1591863258438,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611544270,
            anonimous: false,
            updateTime: 1648177158980,
            trackUpdateTime: 1648177158977,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/dAYiKqH9owbhiKy1_okqEw==/109951165611544270.jpg',
            commentThreadId: 'A_PL_0_5059642708',
            totalDuration: 0,
            privacy: 0,
            playCount: 81028648,
            description:
              '云音乐用户一周内收听所有古风歌曲官方TOP排行榜，每周五更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐古风榜',
            id: 5059642708,
            coverImgId_str: '109951165611544270'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周一更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 25536,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1647792183844,
            userId: 3265840429,
            createTime: 1605594274077,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165498334720,
            anonimous: false,
            updateTime: 1647792183844,
            trackUpdateTime: 1648189009064,
            trackCount: 197,
            coverImgUrl:
              'https://p2.music.126.net/Mi4QPklg1mtbWAfq74tEqQ==/109951165498334721.jpg',
            commentThreadId: 'A_PL_0_5338990334',
            totalDuration: 0,
            privacy: 0,
            playCount: 7856896,
            description: '全民一起赏音PICK好歌，每周一更新',
            ordered: true,
            tags: ['流行', '榜单'],
            status: 0,
            name: '潜力爆款榜',
            id: 5338990334,
            coverImgId_str: '109951165498334721'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 408964,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648177243146,
            userId: 1,
            createTime: 1591863052757,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165611547180,
            anonimous: false,
            updateTime: 1648177243261,
            trackUpdateTime: 1648177243259,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/SMWYiPf7br4enzCNQeX2cw==/109951165611547181.jpg',
            commentThreadId: 'A_PL_0_5059661515',
            totalDuration: 0,
            privacy: 0,
            playCount: 112808048,
            description:
              '云音乐用户一周内收听所有民谣歌曲官方TOP排行榜，每周五更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '云音乐民谣榜',
            id: 5059661515,
            coverImgId_str: '109951165611547181'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 27774,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648089378895,
            userId: 1,
            createTime: 1617180354803,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165850003300,
            anonimous: false,
            updateTime: 1648089379010,
            trackUpdateTime: 1648089379008,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/fgb1AEGAtJ79tygFWyIsQg==/109951165850003297.jpg',
            commentThreadId: 'A_PL_0_6688069460',
            totalDuration: 0,
            privacy: 0,
            playCount: 12417682,
            description:
              '网易云音乐站内歌曲按用户“听歌识曲”次数排列，每周四更新',
            ordered: true,
            tags: [],
            status: 0,
            name: '听歌识曲榜',
            id: 6688069460,
            coverImgId_str: '109951165850003297'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 154548,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648191604523,
            userId: 1,
            createTime: 1619059306654,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165911602420,
            anonimous: false,
            updateTime: 1648191604733,
            trackUpdateTime: 1648191604731,
            trackCount: 100,
            coverImgUrl:
              'https://p2.music.126.net/k0yGVnDaTLeDe6-rbZahJA==/109951165911602412.jpg',
            commentThreadId: 'A_PL_0_6723173524',
            totalDuration: 0,
            privacy: 0,
            playCount: 69943160,
            description:
              '网罗一周热门网络歌曲，反映云音乐用户近一周网络热歌收听趋势。每周五更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '网络热歌榜',
            id: 6723173524,
            coverImgId_str: '109951165911602412'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 8896,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648092037253,
            userId: 1,
            createTime: 1619582712108,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165928424640,
            anonimous: false,
            updateTime: 1648092037376,
            trackUpdateTime: 1648092037374,
            trackCount: 50,
            coverImgUrl:
              'https://p2.music.126.net/nOxTj0zDqUVYv2XBJcTigQ==/109951165928424636.jpg',
            commentThreadId: 'A_PL_0_6732051320',
            totalDuration: 0,
            privacy: 0,
            playCount: 2660742,
            description:
              '网易云音乐用户一周内收听所有俄罗斯语歌曲官方TOP排行榜，每周四更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '俄语榜',
            id: 6732051320,
            coverImgId_str: '109951165928424636'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 7614,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648092542294,
            userId: 1,
            createTime: 1619582749349,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951165928417420,
            anonimous: false,
            updateTime: 1648092542406,
            trackUpdateTime: 1648103398574,
            trackCount: 50,
            coverImgUrl:
              'https://p1.music.126.net/aML0vCjmsp8sgoFiGVsBAQ==/109951165928417426.jpg',
            commentThreadId: 'A_PL_0_6732014811',
            totalDuration: 0,
            privacy: 0,
            playCount: 3069227,
            description:
              '网易云音乐用户一周内收听所有越南语歌曲官方TOP排行榜，每周四更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '越南语榜',
            id: 6732014811,
            coverImgId_str: '109951165928417426'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '刚刚更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 72284,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648353628265,
            userId: 4002134943,
            createTime: 1627466999260,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166225857170,
            anonimous: false,
            updateTime: 1648353628349,
            trackUpdateTime: 1648353628349,
            trackCount: 50,
            coverImgUrl:
              'https://p1.music.126.net/4AA1vyL7_Q-dL7DnBQoTMg==/109951166225857165.jpg',
            commentThreadId: 'A_PL_0_6886768100',
            totalDuration: 0,
            privacy: 0,
            playCount: 17648692,
            description: null,
            ordered: true,
            tags: [],
            status: 0,
            name: '中文DJ榜',
            id: 6886768100,
            coverImgId_str: '109951166225857165'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周五更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 2147,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648177266740,
            userId: 6790397,
            createTime: 1630035002268,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166327316580,
            anonimous: false,
            updateTime: 1648177266777,
            trackUpdateTime: 1648177266775,
            trackCount: 49,
            coverImgUrl:
              'https://p1.music.126.net/KLVO8PxVZzOoLdWQQNyprA==/109951166327316568.jpg',
            commentThreadId: 'A_PL_0_6939992364',
            totalDuration: 0,
            privacy: 0,
            playCount: 1059391,
            description:
              'top hit榜根据俄罗斯及全球400多个无线广播的音乐播放量和YouTube播放量计算得来，每周一更新。',
            ordered: true,
            tags: [],
            status: 0,
            name: '俄罗斯top hit流行音乐榜',
            id: 6939992364,
            coverImgId_str: '109951166327316568'
          },
          {
            subscribers: [],
            subscribed: null,
            creator: null,
            artists: null,
            tracks: null,
            updateFrequency: '每周四更新',
            backgroundCoverId: 0,
            backgroundCoverUrl: null,
            titleImage: 0,
            titleImageUrl: null,
            englishTitle: null,
            opRecommend: false,
            recommendInfo: null,
            subscribedCount: 2135,
            cloudTrackCount: 0,
            adType: 0,
            trackNumberUpdateTime: 1648123202930,
            userId: 1,
            createTime: 1638166937809,
            highQuality: false,
            specialType: 10,
            newImported: false,
            coverImgId: 109951166670042860,
            anonimous: false,
            updateTime: 1648123203007,
            trackUpdateTime: 1648123203007,
            trackCount: 50,
            coverImgUrl:
              'https://p1.music.126.net/mFZktANUzjhfX6IZnT7Y5w==/109951166670042863.jpg',
            commentThreadId: 'A_PL_0_7095271308',
            totalDuration: 0,
            privacy: 0,
            playCount: 786721,
            description:
              '网易云音乐用户一周内收听所有泰语歌曲官方TOP排行榜，每周四更新。',
            ordered: true,
            tags: ['小语种'],
            status: 0,
            name: '泰语榜',
            id: 7095271308,
            coverImgId_str: '109951166670042863'
          }
        ],
        // http://localhost:3000/personalized/mv
        recommendMv: [
          {
            id: 14511981,
            type: 5,
            name: "Better Best Forgotten (Live from Noel's House Party, 1999)",
            copywriter: '最新热门MV推荐',
            picUrl:
              'https://p2.music.126.net/xzIjqcHfMqTa69468-SHEQ==/109951167183373544.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            duration: 207000,
            playCount: 16,
            subed: false,
            artists: [
              {
                id: 100070,
                name: 'Steps'
              }
            ],
            artistName: 'Steps',
            artistId: 100070,
            alg: 'hot_server'
          },
          {
            id: 14514402,
            type: 5,
            name: 'DEPAPEPE 15周年纪念线上演唱会 限时回放',
            copywriter: '最新热门MV推荐',
            picUrl:
              'https://p2.music.126.net/C1OOhYNP74zdWDHJnjv1Tg==/109951167192274578.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            duration: 8955000,
            playCount: 2657,
            subed: false,
            artists: [
              {
                id: 19107,
                name: 'DEPAPEPE'
              }
            ],
            artistName: 'DEPAPEPE',
            artistId: 19107,
            alg: 'hot_server'
          },
          {
            id: 14514752,
            type: 5,
            name: 'Feel My Rhythm | MBC 音乐中心 22/03/26 现场版',
            copywriter: '最新热门MV推荐',
            picUrl:
              'https://p2.music.126.net/aswpuYkA743-A8BXGHmcPw==/109951167197984164.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            duration: 216000,
            playCount: 8394,
            subed: false,
            artists: [
              {
                id: 976157,
                name: 'Red Velvet'
              }
            ],
            artistName: 'Red Velvet',
            artistId: 976157,
            alg: 'hot_server'
          },
          {
            id: 14513747,
            type: 5,
            name: 'Forever (Lyric Video)',
            copywriter: '最新热门MV推荐',
            picUrl:
              'https://p2.music.126.net/IyCrMoxMd-27IZEBi2ZOUA==/109951167195880063.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            duration: 235000,
            playCount: 8,
            subed: false,
            artists: [
              {
                id: 74628,
                name: 'Sheryl Crow'
              }
            ],
            artistName: 'Sheryl Crow',
            artistId: 74628,
            alg: 'hot_server'
          }
        ],
        // http://localhost:3000/personalized/newsong?limit=5
        recommendPerson: [
          {
            id: 1931301795,
            type: 4,
            name: '旋律．故事',
            copywriter: null,
            picUrl:
              'http://p1.music.126.net/k9M_QkvOd8h45q52PwRoLw==/109951167189048122.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            song: {
              name: '旋律．故事',
              id: 1931301795,
              position: 0,
              alias: [],
              status: 0,
              fee: 8,
              copyrightId: 7003,
              disc: '01',
              no: 1,
              artists: [
                {
                  name: '卢冠廷',
                  id: 3697,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                {
                  name: '麦浚龙',
                  id: 4483,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                }
              ],
              album: {
                name: '旋律．故事',
                id: 142350830,
                type: 'Single',
                size: 1,
                picId: 109951167189048130,
                blurPicUrl:
                  'http://p4.music.126.net/k9M_QkvOd8h45q52PwRoLw==/109951167189048122.jpg',
                companyId: 0,
                pic: 109951167189048130,
                picUrl:
                  'http://p3.music.126.net/k9M_QkvOd8h45q52PwRoLw==/109951167189048122.jpg',
                publishTime: 1648137600000,
                description: '',
                tags: '',
                company: 'Universal Music Ltd.',
                briefDesc: '',
                artist: {
                  name: '',
                  id: 0,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                songs: [],
                alias: [],
                status: 1,
                copyrightId: 7003,
                commentThreadId: 'R_AL_3_142350830',
                artists: [
                  {
                    name: '卢冠廷',
                    id: 3697,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  },
                  {
                    name: '麦浚龙',
                    id: 4483,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  }
                ],
                subType: '录音室版',
                transName: null,
                onSale: false,
                mark: 0,
                picId_str: '109951167189048122'
              },
              starred: false,
              popularity: 100,
              score: 100,
              starredNum: 0,
              duration: 298031,
              playedNum: 0,
              dayPlays: 0,
              hearTime: 0,
              ringtone: '',
              crbt: null,
              audition: null,
              copyFrom: '',
              commentThreadId: 'R_SO_4_1931301795',
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              copyright: 1,
              transName: null,
              sign: null,
              mark: 0,
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              bMusic: {
                name: null,
                id: 7177273087,
                size: 4768958,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128001,
                playTime: 298031,
                volumeDelta: -5244
              },
              mp3Url: null,
              rtype: 0,
              rurl: null,
              mvid: 0,
              hMusic: {
                name: null,
                id: 7177273083,
                size: 11922329,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 320001,
                playTime: 298031,
                volumeDelta: -9664
              },
              mMusic: {
                name: null,
                id: 7177273085,
                size: 7153415,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 192001,
                playTime: 298031,
                volumeDelta: -7028
              },
              lMusic: {
                name: null,
                id: 7177273087,
                size: 4768958,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128001,
                playTime: 298031,
                volumeDelta: -5244
              },
              exclusive: false,
              privilege: {
                id: 1931301795,
                fee: 8,
                payed: 0,
                st: 0,
                pl: 128000,
                dl: 0,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 320000,
                fl: 128000,
                toast: false,
                flag: 260,
                preSell: false,
                playMaxbr: 320000,
                downloadMaxbr: 320000,
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
              }
            },
            alg: 'hot_server'
          },
          {
            id: 1931191699,
            type: 4,
            name: 'No Love (Extended Version)',
            copywriter: null,
            picUrl:
              'http://p1.music.126.net/FjRFRe771ZENXG_rv6M_eA==/109951167187702272.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            song: {
              name: 'No Love (Extended Version)',
              id: 1931191699,
              position: 0,
              alias: [],
              status: 0,
              fee: 8,
              copyrightId: 7003,
              disc: '01',
              no: 1,
              artists: [
                {
                  name: 'Summer Walker',
                  id: 13806114,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                {
                  name: 'SZA',
                  id: 905232,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                {
                  name: 'Cardi B',
                  id: 12504253,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                }
              ],
              album: {
                name: 'No Love (Extended Version)',
                id: 142336054,
                type: 'Single',
                size: 1,
                picId: 109951167187702270,
                blurPicUrl:
                  'http://p3.music.126.net/FjRFRe771ZENXG_rv6M_eA==/109951167187702272.jpg',
                companyId: 0,
                pic: 109951167187702270,
                picUrl:
                  'http://p3.music.126.net/FjRFRe771ZENXG_rv6M_eA==/109951167187702272.jpg',
                publishTime: 1648137600000,
                description: '',
                tags: '',
                company: 'LVRN/Interscope Records',
                briefDesc: '',
                artist: {
                  name: '',
                  id: 0,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                songs: [],
                alias: [],
                status: 1,
                copyrightId: 7003,
                commentThreadId: 'R_AL_3_142336054',
                artists: [
                  {
                    name: 'Summer Walker',
                    id: 13806114,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  },
                  {
                    name: 'SZA',
                    id: 905232,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  },
                  {
                    name: 'Cardi B',
                    id: 12504253,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  }
                ],
                subType: '录音室版',
                transName: null,
                onSale: false,
                mark: 0,
                picId_str: '109951167187702272'
              },
              starred: false,
              popularity: 100,
              score: 100,
              starredNum: 0,
              duration: 276244,
              playedNum: 0,
              dayPlays: 0,
              hearTime: 0,
              ringtone: '',
              crbt: null,
              audition: null,
              copyFrom: '',
              commentThreadId: 'R_SO_4_1931191699',
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              copyright: 1,
              transName: null,
              sign: null,
              mark: 0,
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              bMusic: {
                name: null,
                id: 7176543438,
                size: 4420380,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128000,
                playTime: 276244,
                volumeDelta: -58673
              },
              mp3Url: null,
              rtype: 0,
              rurl: null,
              mvid: 14514524,
              hMusic: {
                name: null,
                id: 7176543434,
                size: 11050885,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 320000,
                playTime: 276244,
                volumeDelta: -62963
              },
              mMusic: {
                name: null,
                id: 7176543436,
                size: 6630548,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 192000,
                playTime: 276244,
                volumeDelta: -60382
              },
              lMusic: {
                name: null,
                id: 7176543438,
                size: 4420380,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128000,
                playTime: 276244,
                volumeDelta: -58673
              },
              exclusive: false,
              privilege: {
                id: 1931191699,
                fee: 8,
                payed: 0,
                st: 0,
                pl: 128000,
                dl: 0,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 320000,
                fl: 128000,
                toast: false,
                flag: 260,
                preSell: false,
                playMaxbr: 320000,
                downloadMaxbr: 320000,
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
              }
            },
            alg: 'hot_server'
          },
          {
            id: 1928727781,
            type: 4,
            name: 'Legend',
            copywriter: null,
            picUrl:
              'http://p1.music.126.net/kzE6SxnfbLrJvujOOIAV1g==/109951167156684257.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            song: {
              name: 'Legend',
              id: 1928727781,
              position: 0,
              alias: [],
              status: 0,
              fee: 8,
              copyrightId: 2706413,
              disc: '01',
              no: 1,
              artists: [
                {
                  name: 'Round_2',
                  id: 12127507,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                }
              ],
              album: {
                name: 'L.E.G.E.N.D',
                id: 141912227,
                type: 'Single',
                size: 2,
                picId: 109951167156684260,
                blurPicUrl:
                  'http://p4.music.126.net/kzE6SxnfbLrJvujOOIAV1g==/109951167156684257.jpg',
                companyId: 0,
                pic: 109951167156684260,
                picUrl:
                  'http://p3.music.126.net/kzE6SxnfbLrJvujOOIAV1g==/109951167156684257.jpg',
                publishTime: 1648137600000,
                description: '',
                tags: '',
                company: '天津锐思派文化传播有限公司',
                briefDesc: '',
                artist: {
                  name: '',
                  id: 0,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                songs: [],
                alias: [],
                status: 0,
                copyrightId: 2706413,
                commentThreadId: 'R_AL_3_141912227',
                artists: [
                  {
                    name: 'Round_2',
                    id: 12127507,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  }
                ],
                subType: '录音室版',
                transName: null,
                onSale: false,
                mark: 0,
                picId_str: '109951167156684257'
              },
              starred: false,
              popularity: 100,
              score: 100,
              starredNum: 0,
              duration: 156000,
              playedNum: 0,
              dayPlays: 0,
              hearTime: 0,
              ringtone: '',
              crbt: null,
              audition: null,
              copyFrom: '',
              commentThreadId: 'R_SO_4_1928727781',
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              copyright: 0,
              transName: null,
              sign: null,
              mark: 0,
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              bMusic: {
                name: null,
                id: 7161944956,
                size: 2496863,
                extension: 'mp3',
                sr: 48000,
                dfsId: 0,
                bitrate: 128002,
                playTime: 156000,
                volumeDelta: -65231
              },
              mp3Url: null,
              rtype: 0,
              rurl: null,
              mvid: 0,
              hMusic: {
                name: null,
                id: 7161944952,
                size: 6242015,
                extension: 'mp3',
                sr: 48000,
                dfsId: 0,
                bitrate: 320002,
                playTime: 156000,
                volumeDelta: -69489
              },
              mMusic: {
                name: null,
                id: 7161944954,
                size: 3745247,
                extension: 'mp3',
                sr: 48000,
                dfsId: 0,
                bitrate: 192002,
                playTime: 156000,
                volumeDelta: -66898
              },
              lMusic: {
                name: null,
                id: 7161944956,
                size: 2496863,
                extension: 'mp3',
                sr: 48000,
                dfsId: 0,
                bitrate: 128002,
                playTime: 156000,
                volumeDelta: -65231
              },
              exclusive: false,
              privilege: {
                id: 1928727781,
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
                flag: 4,
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
              }
            },
            alg: 'hot_server'
          },
          {
            id: 1931356169,
            type: 4,
            name: 'Sigue',
            copywriter: null,
            picUrl:
              'http://p1.music.126.net/a8SultuvaP-ynwmwkyGtsA==/109951167189768088.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            song: {
              name: 'Sigue',
              id: 1931356169,
              position: 0,
              alias: [],
              status: 0,
              fee: 8,
              copyrightId: 7003,
              disc: '01',
              no: 1,
              artists: [
                {
                  name: 'J. Balvin',
                  id: 309127,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                {
                  name: 'Ed Sheeran',
                  id: 33184,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                }
              ],
              album: {
                name: 'Sigue/Forever My Love',
                id: 142360286,
                type: 'Single',
                size: 2,
                picId: 109951167189768100,
                blurPicUrl:
                  'http://p3.music.126.net/a8SultuvaP-ynwmwkyGtsA==/109951167189768088.jpg',
                companyId: 0,
                pic: 109951167189768100,
                picUrl:
                  'http://p4.music.126.net/a8SultuvaP-ynwmwkyGtsA==/109951167189768088.jpg',
                publishTime: 1648137600000,
                description: '',
                tags: '',
                company: 'Universal Music Latino / Asylum Records UK',
                briefDesc: '',
                artist: {
                  name: '',
                  id: 0,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                songs: [],
                alias: [],
                status: 1,
                copyrightId: 7003,
                commentThreadId: 'R_AL_3_142360286',
                artists: [
                  {
                    name: 'J. Balvin',
                    id: 309127,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  },
                  {
                    name: 'Ed Sheeran',
                    id: 33184,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  }
                ],
                subType: '录音室版',
                transName: null,
                onSale: false,
                mark: 0,
                picId_str: '109951167189768088'
              },
              starred: false,
              popularity: 100,
              score: 100,
              starredNum: 0,
              duration: 159425,
              playedNum: 0,
              dayPlays: 0,
              hearTime: 0,
              ringtone: '',
              crbt: null,
              audition: null,
              copyFrom: '',
              commentThreadId: 'R_SO_4_1931356169',
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              copyright: 1,
              transName: null,
              sign: null,
              mark: 0,
              originCoverType: 0,
              originSongSimpleData: null,
              single: 0,
              noCopyrightRcmd: null,
              bMusic: {
                name: null,
                id: 7177638785,
                size: 2551266,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128000,
                playTime: 159425,
                volumeDelta: -62198
              },
              mp3Url: null,
              rtype: 0,
              rurl: null,
              mvid: 14513460,
              hMusic: {
                name: null,
                id: 7177638781,
                size: 6378101,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 320000,
                playTime: 159425,
                volumeDelta: -66460
              },
              mMusic: {
                name: null,
                id: 7177638783,
                size: 3826878,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 192000,
                playTime: 159425,
                volumeDelta: -63821
              },
              lMusic: {
                name: null,
                id: 7177638785,
                size: 2551266,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128000,
                playTime: 159425,
                volumeDelta: -62198
              },
              exclusive: false,
              privilege: {
                id: 1931356169,
                fee: 8,
                payed: 0,
                st: 0,
                pl: 128000,
                dl: 0,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 320000,
                fl: 128000,
                toast: false,
                flag: 260,
                preSell: false,
                playMaxbr: 320000,
                downloadMaxbr: 320000,
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
              }
            },
            alg: 'hot_server'
          },
          {
            id: 1931262830,
            type: 4,
            name: '为你写诗',
            copywriter: null,
            picUrl:
              'http://p1.music.126.net/RTJNnHkBr8fJhCvczPnZnw==/109951167188505394.jpg',
            canDislike: true,
            trackNumberUpdateTime: null,
            song: {
              name: '为你写诗',
              id: 1931262830,
              position: 0,
              alias: [],
              status: 0,
              fee: 0,
              copyrightId: 0,
              disc: '01',
              no: 0,
              artists: [
                {
                  name: '刘大拿',
                  id: 29588305,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                }
              ],
              album: {
                name: '为你写诗',
                id: 142346349,
                type: '专辑',
                size: 2,
                picId: 109951167188505390,
                blurPicUrl:
                  'http://p3.music.126.net/RTJNnHkBr8fJhCvczPnZnw==/109951167188505394.jpg',
                companyId: 0,
                pic: 109951167188505390,
                picUrl:
                  'http://p4.music.126.net/RTJNnHkBr8fJhCvczPnZnw==/109951167188505394.jpg',
                publishTime: 1648137600000,
                description: '',
                tags: '',
                company: '',
                briefDesc: '',
                artist: {
                  name: '',
                  id: 0,
                  picId: 0,
                  img1v1Id: 0,
                  briefDesc: '',
                  picUrl:
                    'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  img1v1Url:
                    'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                  albumSize: 0,
                  alias: [],
                  trans: '',
                  musicSize: 0,
                  topicPerson: 0
                },
                songs: [],
                alias: [],
                status: 0,
                copyrightId: -1,
                commentThreadId: 'R_AL_3_142346349',
                artists: [
                  {
                    name: '刘大拿',
                    id: 29588305,
                    picId: 0,
                    img1v1Id: 0,
                    briefDesc: '',
                    picUrl:
                      'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    img1v1Url:
                      'http://p4.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
                    albumSize: 0,
                    alias: [],
                    trans: '',
                    musicSize: 0,
                    topicPerson: 0
                  }
                ],
                subType: '',
                transName: 'poems for you',
                onSale: false,
                mark: 0,
                picId_str: '109951167188505394',
                transNames: ['poems for you']
              },
              starred: false,
              popularity: 100,
              score: 100,
              starredNum: 0,
              duration: 216780,
              playedNum: 0,
              dayPlays: 0,
              hearTime: 0,
              ringtone: '',
              crbt: null,
              audition: null,
              copyFrom: '',
              commentThreadId: 'R_SO_4_1931262830',
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              copyright: 0,
              transName: '为你我做了太多的傻事',
              sign: null,
              mark: 0,
              originCoverType: 2,
              originSongSimpleData: {
                songId: 156193,
                name: '为你写诗',
                artists: [
                  {
                    id: 5350,
                    name: '吴克群'
                  }
                ],
                albumMeta: {
                  id: 15730,
                  name: '为你写诗'
                }
              },
              single: 0,
              noCopyrightRcmd: null,
              bMusic: {
                name: null,
                id: 7177061238,
                size: 3469523,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128000,
                playTime: 216780,
                volumeDelta: -51132
              },
              mp3Url: null,
              rtype: 0,
              rurl: null,
              mvid: 0,
              hMusic: {
                name: null,
                id: 7177061234,
                size: 8673742,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 320000,
                playTime: 216780,
                volumeDelta: -55388
              },
              mMusic: {
                name: null,
                id: 7177061236,
                size: 5204262,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 192000,
                playTime: 216780,
                volumeDelta: -52782
              },
              lMusic: {
                name: null,
                id: 7177061238,
                size: 3469523,
                extension: 'mp3',
                sr: 44100,
                dfsId: 0,
                bitrate: 128000,
                playTime: 216780,
                volumeDelta: -51132
              },
              transNames: ['为你我做了太多的傻事'],
              exclusive: false,
              privilege: {
                id: 1931262830,
                fee: 0,
                payed: 0,
                st: 0,
                pl: 320000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 320000,
                toast: false,
                flag: 1,
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
                    chargeType: 0
                  },
                  {
                    rate: 320000,
                    chargeUrl: null,
                    chargeMessage: null,
                    chargeType: 0
                  },
                  {
                    rate: 999000,
                    chargeUrl: null,
                    chargeMessage: null,
                    chargeType: 1
                  }
                ]
              }
            },
            alg: 'hot_server'
          }
        ],
        // http://localhost:3000/personalized?limit=5
        recommends: []
      }
    }
  },
  created () {
    this.getCommunity()
    this.getRecommend()
  },
  methods: {
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
    fetchToJson (url) {
      return new Promise((resolve) => {
        fetch(url).then((res) => {
          res.json().then((resJson) => resolve(resJson))
        })
      })
    },
    // 社区精选
    getCommunity () {
      this.fetchToJson(this.API.GET_COMMUNITY).then((resJson) => {
        this.listData.community = resJson.playlists
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
        //  ${hours.toString().length === 1 ? '0' + hours : hours}:${minutes.toString().length === 1 ? '0' + minutes : minutes}
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
        // margin: 0 12px;
        // --pic-size: 190px;
        // width: var(--pic-size);
        position: relative;
        width: calc(100% / 6);
        padding: 0 10px;
        box-sizing: border-box;

        img {
          border-radius: 12px;
          // height: var(--pic-size);
          // width: var(--pic-size);
          width: 100%;

          &[class="posterRound"] {
            border-radius: 50%;
          }
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

          img {
            width: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
}
</style>
