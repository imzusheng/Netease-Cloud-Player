<!--
    歌单列表组件 Flex布局
-->
<template>
  <section
    v-if="getListData.length"
    class="section-common"
    :style="{ '--shape-round': round ? '50%' : '4px' }"
  >
    <div class="section-common-title" v-if="getTitle">
      <h2>{{ getTitle }}</h2>
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
import SectionListItem from '@/components/SectionListItem'

export default {
  name: 'SectionListFlex',

  components: {
    SectionListItem
  },

  data () {
    return {
      round: false
    }
  },

  props: ['title', 'listData'],

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
    },
    // 是否头像是否圆角，艺人的封面要圆角
    setRound (status) {
      this.round = status
    }
  },

  computed: {
    getTitle () {
      return this.$props.title || ''
    },
    getListData () {
      if (this.$props.listData && this.$props.listData.length > 0) {
        this.setRound(
          ['artist', 'users'].includes(this.$props.listData[0].query)
        )
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
  margin-bottom: 48px;
  // 列间距
  --grid-gap: 24px;
  // 每行的列数
  --column-count: 6;

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
