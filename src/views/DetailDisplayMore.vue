<!--
    显示更多
-->

<template>
  <main id="display-more">
    <div class="section-spacing">
      <!-- 标题 -->
      <div class="section-more-title">
        <span>
          {{ title }}
        </span>
      </div>
      <!-- 列表 -->
      <SectionListFlex :listData="listData" :round="false" />
    </div>
    <div class="loading-spacing">
      <TheLoading
        v-if="more"
        class="display-more-loading"
        ref="display-more-loading"
      />
      <div v-else class="display-no-more">没有更多了</div>
    </div>
  </main>
</template>

<script>
import SectionListFlex from '@/components/SectionListFlex.vue'
import TheLoading from '@/components/TheLoading.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'DetailDisplayMore',

  components: {
    SectionListFlex,
    TheLoading
  },

  data () {
    return {
      listData: [],
      title: '',

      // 当前页
      offset: 0,

      // 是否还有更多
      more: true
    }
  },

  created () {
    this.setLoading(true)
    this.getData()
  },

  methods: {
    ...mapMutations(['setError', 'setLoading']),
    getData () {
      // store.actions中是否存在该函数名
      if (
        Object.keys(this.$store._actions).includes(this.$route.query.action)
      ) {
        // 调用store函数并传入参数
        this.$store
          .dispatch(this.$route.query.action, {
            ...this.$route.query,
            offset: this.offset
          })
          .then((res) => {
            this.listData.push(...res.data)
            this.title = res.title
            this.setLoading(false)
            if (res.data.length === 0) {
              this.more = false
            }
          })
      } else {
        this.setError({
          status: true,
          msg: '无法找到该页面'
        })
      }
    }
  },

  mounted () {
    const headerMaskRef = this.$parent.$refs['main-header-mask']
    headerMaskRef.style.opacity = 1
    // IntersectionObserver
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          // 图片出现，挂上src
          if (item.intersectionRatio > 0) {
            // 停止观察
            this.offset += 1
            this.getData()
            if (this.offset > 10) {
              intersectionObserver.unobserve(item.target)
              this.more = false
            }
          }
        })
      },
      {
        threshold: [0]
      }
    )
    // 开始观察
    intersectionObserver.observe(
      document.querySelector('.display-more-loading')
    )
  }
}
</script>

<style lang="less" scoped>
#display-more {
  background: rgb(12, 12, 12);
  padding: 68px 0 72px;
  .section-spacing {
    padding: 0 40px 0;
    .section-more-title {
      font-size: 28px;
      line-height: 1.5;
      font-weight: 700;
      padding: 32px 0 16px;
      background: rgb(12, 12, 12);
    }
  }
  .loading-spacing {
    position: relative;
    height: 50px;
    margin-bottom: 50px;
    .display-more-loading {
      position: absolute;
    }
    .display-no-more {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      color: #b3b3b3;
    }
  }
}
</style>
