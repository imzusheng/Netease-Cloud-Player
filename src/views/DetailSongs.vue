<template>
  <section id="songs-list" class="view-spacing">
    <table-songs :songs="songs" size="L"/>
  </section>
</template>

<script>
import { durationConvert } from '@/util'
import { mapMutations } from 'vuex'
import TableSongs from '@/components/TableSongs'

export default {
  name: 'DetailSongs',

  components: {
    TableSongs
  },

  data () {
    return {
      songs: [
        {
          name: '你要不要吃哈密瓜',
          id: 511920318,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: null,
          fee: 8,
          v: 14,
          crbt: null,
          cf: '',
          al: {
            id: 36450449,
            name: '迷雾之子',
            picUrl: 'https://p2.music.126.net/OvA9ioBPtgj4l4MePVJSpQ==/109951163040117096.jpg',
            tns: [],
            pic_str: '109951163040117096',
            pic: 109951163040117090
          },
          dt: 268363,
          h: {
            br: 320000,
            fid: 0,
            size: 10737415,
            vd: -69239
          },
          m: {
            br: 192000,
            fid: 0,
            size: 6442466,
            vd: -69239
          },
          l: {
            br: 128000,
            fid: 0,
            size: 4294992,
            vd: -69239
          },
          a: null,
          cd: '01',
          no: 1,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 0,
          s_id: 0,
          mark: 8192,
          originCoverType: 1,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 14,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 1507564800007
        },
        {
          name: '温蒂公主的侍卫 (Demo)',
          id: 1446902858,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: '',
          fee: 8,
          v: 4,
          crbt: null,
          cf: '',
          al: {
            id: 89230560,
            name: '温蒂公主的侍卫 (Demo)',
            picUrl: 'https://p2.music.126.net/wgStjwY_jbS-F25Umne1yA==/109951164974073087.jpg',
            tns: [],
            pic_str: '109951164974073087',
            pic: 109951164974073090
          },
          dt: 250909,
          h: {
            br: 320000,
            fid: 0,
            size: 10038765,
            vd: -26571
          },
          m: {
            br: 192000,
            fid: 0,
            size: 6023277,
            vd: -23955
          },
          l: {
            br: 128000,
            fid: 0,
            size: 4015533,
            vd: -22221
          },
          a: null,
          cd: '01',
          no: 1,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 1,
          s_id: 0,
          mark: 270336,
          originCoverType: 1,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 4,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 1588953600000
        },
        {
          name: '新世界',
          id: 1472090563,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            },
            {
              id: 12090100,
              name: '阿爆',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: '',
          fee: 8,
          v: 8,
          crbt: null,
          cf: '',
          al: {
            id: 94136575,
            name: '新世界',
            picUrl: 'https://p2.music.126.net/KlgR1M1CedL44arSoCBvWg==/109951165247269075.jpg',
            tns: [],
            pic_str: '109951165247269075',
            pic: 109951165247269070
          },
          dt: 237731,
          h: {
            br: 320000,
            fid: 0,
            size: 9511725,
            vd: -77761
          },
          m: {
            br: 192000,
            fid: 0,
            size: 5707053,
            vd: -75140
          },
          l: {
            br: 128000,
            fid: 0,
            size: 3804717,
            vd: -73427
          },
          a: null,
          cd: '01',
          no: 1,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 1,
          s_id: 0,
          mark: 270336,
          originCoverType: 0,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 8,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 1597766400000
        },
        {
          name: 'WEWE',
          id: 1807796550,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: '',
          fee: 8,
          v: 8,
          crbt: null,
          cf: '',
          al: {
            id: 120954841,
            name: '运气来得若有似无',
            picUrl: 'https://p2.music.126.net/5URIeP6GjMFg_hKhGloNTA==/109951165585701063.jpg',
            tns: [],
            pic_str: '109951165585701063',
            pic: 109951165585701060
          },
          dt: 228009,
          h: {
            br: 320002,
            fid: 0,
            size: 9122925,
            vd: -55161
          },
          m: {
            br: 192002,
            fid: 0,
            size: 5473773,
            vd: -52621
          },
          l: {
            br: 128002,
            fid: 0,
            size: 3649197,
            vd: -51094
          },
          a: null,
          cd: '01',
          no: 2,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 1,
          s_id: 0,
          mark: 270336,
          originCoverType: 0,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 8,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 1609344000000
        },
        {
          name: '果然你还是',
          id: 1368756116,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: '',
          fee: 8,
          v: 5,
          crbt: null,
          cf: '',
          al: {
            id: 79515295,
            name: '我肯定在几百年前就说过爱你',
            picUrl: 'https://p2.music.126.net/5JLQMl8xASllDubCWb9WHw==/109951164111703663.jpg',
            tns: [
              'Somewhere in time, I love you'
            ],
            pic_str: '109951164111703663',
            pic: 109951164111703660
          },
          dt: 377917,
          h: {
            br: 320000,
            fid: 0,
            size: 15119169,
            vd: -52202
          },
          m: {
            br: 192000,
            fid: 0,
            size: 9071553,
            vd: -49633
          },
          l: {
            br: 128000,
            fid: 0,
            size: 6047745,
            vd: -47951
          },
          a: null,
          cd: '01',
          no: 5,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 0,
          s_id: 0,
          mark: 8192,
          originCoverType: 1,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 5,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 0,
          tns: [
            'Fly to the flame'
          ]
        },
        {
          name: '跳海',
          id: 1368754689,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: '',
          fee: 8,
          v: 5,
          crbt: null,
          cf: '',
          al: {
            id: 79515295,
            name: '我肯定在几百年前就说过爱你',
            picUrl: 'https://p2.music.126.net/5JLQMl8xASllDubCWb9WHw==/109951164111703663.jpg',
            tns: [
              'Somewhere in time, I love you'
            ],
            pic_str: '109951164111703663',
            pic: 109951164111703660
          },
          dt: 289136,
          h: {
            br: 320001,
            fid: 0,
            size: 11568129,
            vd: -69712
          },
          m: {
            br: 192001,
            fid: 0,
            size: 6940929,
            vd: -67159
          },
          l: {
            br: 128001,
            fid: 0,
            size: 4627329,
            vd: -65643
          },
          a: null,
          cd: '01',
          no: 3,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 0,
          s_id: 0,
          mark: 8192,
          originCoverType: 1,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 5,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 0,
          tns: [
            'Farewell in the sea'
          ]
        },
        {
          name: '不具名的花',
          id: 1368754746,
          pst: 0,
          t: 0,
          ar: [
            {
              id: 12676697,
              name: '告五人',
              tns: [],
              alias: []
            }
          ],
          alia: [],
          pop: 100,
          st: 0,
          rt: '',
          fee: 8,
          v: 8,
          crbt: null,
          cf: '',
          al: {
            id: 79515295,
            name: '我肯定在几百年前就说过爱你',
            picUrl: 'https://p2.music.126.net/5JLQMl8xASllDubCWb9WHw==/109951164111703663.jpg',
            tns: [
              'Somewhere in time, I love you'
            ],
            pic_str: '109951164111703663',
            pic: 109951164111703660
          },
          dt: 339188,
          h: {
            br: 320000,
            fid: 0,
            size: 13569729,
            vd: -53470
          },
          m: {
            br: 192000,
            fid: 0,
            size: 8141889,
            vd: -50851
          },
          l: {
            br: 128000,
            fid: 0,
            size: 5427969,
            vd: -49111
          },
          a: null,
          cd: '01',
          no: 9,
          rtUrl: null,
          ftype: 0,
          rtUrls: [],
          djId: 0,
          copyright: 0,
          s_id: 0,
          mark: 8192,
          originCoverType: 1,
          originSongSimpleData: null,
          tagPicList: null,
          resourceState: true,
          version: 8,
          songJumpInfo: null,
          entertainmentTags: null,
          single: 0,
          noCopyrightRcmd: null,
          mv: 0,
          rtype: 0,
          rurl: null,
          mst: 9,
          cp: 1400821,
          publishTime: 0,
          tns: [
            'Anonymous flower'
          ]
        }
      ]
    }
  },

  methods: {
    ...mapMutations(['setCurSongid'])
  },

  computed: {
    getSongDt () {
      return function (time) {
        return durationConvert(time / 1000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#songs-list{
  // ul
  .song-table {
    // li
    .table-row {
      display: grid;
      grid-gap: 16px;
      grid-template-columns:
              [index] 16px
              [name] 6fr
              [al] 4fr
              [last] minmax(120px, 1fr);
      padding: 0 16px;
      border-radius: 6px;
      cursor: pointer;
      // li > div
      > div {
        display: flex;
        align-items: center;
        padding: 4px 0;
        &:last-child {
          justify-content: flex-end;
          margin-right: 32px;
        }
      }
      // index单元格
      .table-cell-index {
        justify-content: center;
        align-items: center;
        .playlist-table-index {
          display: block;
        }
        .playlist-table-icon {
          display: none;
        }
      }
      // 歌曲信息
      .table-cell-desc {
        // 歌曲封面
        .table-cell-desc-pic {
          height: 54px;
          width: 54px;
          flex-shrink: 0;
          margin-right: 5px;
          padding: 5px;
          box-sizing: border-box;
        }
        // 歌曲名 和 歌手
        .table-cell-desc-info {
          .table-desc-name {
            grid-area: title;
            color: #fff;
            display: flex;
            align-items: center;
            > span {
              font-size: 15px;
              color: #fff;
              font-weight: 600;
            }
            .table-cell-desc-vip {
              height: 32px;
              width: 32px;
              margin-left: 4px;
            }
          }
        }
      }
      // 专辑
      .table-cell-album,
      .table-cell-dt{
        color: #b3b3b3;
        font-size: 14px;
      }
      // hover样式
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        .playlist-table-index {
          display: none;
        }
        .playlist-table-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .table-desc-name {
          text-decoration: underline;
        }
      }
      // 需要省略的格子
      .table-cell-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    // 正在播放的歌曲样式
    .playing {
      background: rgb(60, 60, 60);
      .playlist-table-index {
        display: none !important;
      }
      .playlist-table-icon {
        display: flex !important;
        align-items: center;
        justify-content: center;
        .icon-pause {
          display: none;
        }
        .icon-equaliser {
          display: block;
        }
      }
      &:hover {
        .playlist-table-icon {
          .icon-pause {
            display: block;
          }
          .icon-equaliser {
            display: none;
          }
        }
      }
    }
  }
}
</style>
