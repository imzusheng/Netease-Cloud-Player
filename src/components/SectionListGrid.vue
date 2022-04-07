<!--
    歌单列表组件
-->
<template>
  <section
    ref="section-common"
    class="section-common"
    :style="{ '--shape-round': $props.round ? '50%' : '4px' }"
  >
    <div v-if="getListData.length" class="section-common-spacing">
      <div class="section-common-title">
        <h2>{{ getTitle }}</h2>
        <span v-if="$props.listData.length > 6" @click="toMore">查看更多</span>
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
    </div>
  </section>
</template>

<script>
import SectionListItem from '@/components/SectionListItem'

export default {
  name: 'SectionListGrid',

  components: {
    SectionListItem
  },

  props: {
    // 标题
    title: String,

    // 数据
    listData: Array,

    // 图片是否圆角
    round: Boolean,

    // 查看更多的路由参数
    type: String,

    // 歌曲id
    id: [String, Number]
  },

  methods: {
    toDetail (data) {
      const { query: name, payload: id } = data
      if (!name) {
        console.log(data)
        console.warn('query 为空，停止跳转')
        return
      }
      this.$router.push({
        name,
        query: {
          id
        }
      })
    },
    toMore () {
      const query = {}
      if (this.$props.type) query.type = this.$props.type
      else return console.warn('路由参数错误，停止跳转')

      if (this.$props.id) query.id = this.$props.id

      this.$router.push({
        name: 'more',
        query
      })
    }
  },

  computed: {
    getTitle () {
      return this.$props.title || ''
    },
    getListData () {
      if (this.$props.listData && this.$props.listData.length > 0) {
        return this.$props.listData.slice(0, this.$store.state.columnCount)
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="less">
.section-common {
  .section-common-spacing {
    margin-bottom: 48px;

    .section-common-title {
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
    .section-row {
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
  }
}
</style>
