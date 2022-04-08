<template>
  <div class="section-column-spacing">
    <!-- 懒加载封面图 未加载时使用占位图 -->
    <img
      src="../assets/empty_black.png"
      :data-pic-src="picurl"
      ref="lazyload-img"
      class="column-poster"
      alt=""
    />
    <div class="column-info">
      <div class="column-name" :title="name">
        {{ name }}
      </div>
      <div class="column-desc" :title="desc">
        {{ desc }}
      </div>
    </div>
  </div>
</template>

<script>
import { lazyLoadImg } from '@/util'

export default {
  name: 'SectionListItem',

  props: {
    name: String,
    desc: String,
    picurl: String
  },

  mounted () {
    lazyLoadImg(this.$refs['lazyload-img'])
  }
}
</script>

<style lang="less">
.section-column-spacing {
  padding: 14px;
  height: 100%;
  box-sizing: border-box;
  // 封面
  .column-poster {
    width: 100%;
    object-fit: cover;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    border-radius: var(--shape-round);
  }
  .column-info {
    // 歌手名
    .column-name {
      font-size: 15px;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .column-desc {
      margin: 2px 0 6px;
      font-size: 13px;
      font-weight: 400;
      color: #b3b3b3;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      overflow: hidden;
    }
  }
}
</style>
