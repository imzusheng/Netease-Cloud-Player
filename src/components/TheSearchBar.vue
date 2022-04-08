<!--
    搜索栏组件
-->
<template>
  <div class="search" ref="search" v-if="$store.state.searchDisplay">
    <div class="search-input-content">
      <span @click="exitSearch">
        <svg
          viewBox="0 0 24 24"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
          class="search-back-icon"
        >
          <g class="search-back-icon">
            <path
              class="search-back-icon"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            ></path>
          </g></svg
      ></span>
      <input
        @keyup.enter="toSearchDetail(null)"
        class="search-input"
        type="text"
        @input="searchChange"
        v-model.trim="keywords"
        placeholder="搜索"
      />
    </div>
    <!-- TODO 使li可以用上下键选中 -->
    <ul class="search-suggest-list" v-if="this.searchSuggest.length > 0">
      <li
        class="search-suggest-item"
        v-for="(val, idx) in searchSuggest"
        :key="`search-${idx}`"
        @click="toSearchDetail(val.keyword)"
        tabindex="0"
      >
        {{ val.keyword }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TheSearchBar',

  data () {
    return {
      keywords: '',
      searchSuggest: []
    }
  },

  created () {
    if (this.$route.query.keywords && this.$route.name === 'search') {
      this.keywords = this.$route.query.keywords
    }
  },

  methods: {
    ...mapMutations(['setSearchDisplay']),
    searchChange () {
      if (this.keywords) {
        this.$store
          .dispatch('getSearchSuggest', {
            keywords: this.keywords
          })
          .then((res) => {
            if (this.keywords) {
              this.searchSuggest = res.allMatch
            }
          })
      } else {
        this.searchSuggest = []
      }
    },
    clickHandle (e) {
      const searchRef = this.$refs.search
      const searchRect = searchRef.getBoundingClientRect()
      const top = searchRect.top
      const left = searchRect.left
      const right = searchRect.right
      const bottom = searchRect.bottom
      const clientX = e.clientX
      const clientY = e.clientY
      // 点击的位置X轴是否在范围内
      const includeX = top < clientY && clientY < bottom
      // 点击的位置Y轴是否在范围内
      const includeY = left < clientX && clientX < right
      // 当点击的位置不在在搜索框内，关闭搜索框
      if (!(includeX && includeY)) {
        this.setSearchDisplay(false)
        document.removeEventListener('click', this.clickHandle)
      }
    },
    exitSearch () {
      this.setSearchDisplay(false)
      document.removeEventListener('click', this.clickHandle)
    },
    // 前往搜索页面
    toSearchDetail (keywords) {
      if (this.keywords) {
        const queryKeywords = keywords ?? this.keywords
        this.keywords = queryKeywords
        this.searchSuggest = []
        this.$router.push({
          name: 'search',
          query: {
            keywords: queryKeywords
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 99;
  background: rgba(33, 33, 33, 1);
  width: 60vw;
  border-radius: 4px;
  padding: 5px 16px 5px;
  box-sizing: border-box;
  .search-input-content {
    width: 100%;
    height: 38px;
    position: relative;
    display: flex;
    align-items: center;
    span {
      display: flex;
      align-items: center;
      &:hover .search-back-icon {
        fill: rgba(255, 255, 255, 0.8);
      }
      .search-back-icon {
        height: 28px;
        width: 28px;
        fill: rgba(255, 255, 255, 0.35);
        margin-right: 6px;
        cursor: pointer;
      }
    }
    .search-input {
      width: 100%;
      border: none;
      outline: none;
      box-sizing: border-box;
      padding: 0 4px;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .search-suggest-list {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 68px;
    padding: 10px 0;
    box-sizing: border-box;
    .search-suggest-item {
      padding: 8px 10px;
      font-size: 15px;
      color: #b3b3b3;
      cursor: pointer;
      border-radius: 4px;
      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
