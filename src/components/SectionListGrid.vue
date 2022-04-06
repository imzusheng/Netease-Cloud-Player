<!--
    歌单列表组件
-->
<template>
  <section
    v-if="getListData.length"
    class="section-common"
    :style="{ '--shape-round': $props.round ? '50%' : '4px' }"
  >
    <div class="section-common-title">
      <h2>{{ getTitle }}</h2>
      <span v-if="$props.listData.length > 6">查看更多</span>
    </div>
    <ul class="section-row">
      <li
        @click="toDetail(item)"
        class="section-column"
        v-for="(item, index) in getListData"
        :key="`${getTitle}-${index}`"
      >
        <SectionListItem
          :name="item.name"
          :desc="item.desc"
          :picurl="item.picUrl"
        />
      </li>
    </ul>
  </section>
</template>

<script>
// import { lazyLoadImg } from '@/util'
import SectionListItem from '@/components/SectionListItem'

export default {
  name: 'SectionListGrid',

  components: {
    SectionListItem
  },

  data () {
    return {
      // 行列数
      columnCount: 6
    }
  },

  props: ['title', 'listData', 'round'],

  mounted () {
    const route = {
      '(min-width: 1200px)': 6,
      '(min-width: 968px)': 5,
      '(min-width: 728px)': 4,
      '(min-width: 528px)': 3,
      '(min-width: 0)': 2
    }
    const mediaChangeHandle = (e) => {
      if (e.matches === true) {
        this.columnCount = route[e.media]
      } else {
        this.columnCount = route[e.media] - 1
      }
    }
    let init = false
    Object.keys(route)
      .reverse()
      .forEach((media) => {
        const mm = window.matchMedia(media)
        if (!mm.matches && !init) {
          // console.log(media, route[media])
          this.columnCount = route[media] - 1
          init = true
        }
        mm.addEventListener('change', mediaChangeHandle)
      })
  },

  methods: {
    toDetail ({ query: name, payload: id }) {
      if (!name) {
        console.error('query 为空')
        return
      }
      this.$router.push({
        name,
        query: {
          id
        }
      })
    }
  },

  computed: {
    getTitle () {
      return this.$props.title || ''
    },
    getListData () {
      if (this.$props.listData && this.$props.listData.length > 0) {
        return this.$props.listData.slice(0, this.columnCount)
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.section-common {
  // 列间距
  --grid-gap: 24px;
  // 每行的列数
  --column-count: 4;
  // 图片圆角
  --shape-round: 4px;
  margin-bottom: 48px;

  > .section-common-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    h2 {
      font-size: 28px;
      font-weight: 700;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #b3b3b3;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  > .section-row {
    display: grid;
    grid-gap: var(--grid-gap);
    grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
    .section-column {
      background: #181818;
      transition: background 0.2s;
      cursor: pointer;
      &:hover {
        will-change: auto;
        background: rgb(39, 39, 39);
      }
      border-radius: 12px;
    }
  }

  @media screen and (max-width: 528px) {
    // 列间距
    --grid-gap: 12px;
    // 每行的列数
    --column-count: 2;
  }

  @media screen and (min-width: 528px) {
    // 列间距
    --grid-gap: 16px;
    // 每行的列数
    --column-count: 3;
  }

  @media screen and (min-width: 728px) {
    // 列间距
    --grid-gap: 18px;
    // 每行的列数
    --column-count: 4;
  }

  @media screen and (min-width: 968px) {
    // 列间距
    --grid-gap: 22px;
    // 每行的列数
    --column-count: 5;
  }

  @media screen and (min-width: 1200px) {
    // 列间距
    --grid-gap: 24px;
    // 每行的列数
    --column-count: 6;
  }
}
</style>
