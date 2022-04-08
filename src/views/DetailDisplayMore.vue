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
      <SectionListFlex :listData="listData" />
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
      pageIndex: 0,

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
            pageIndex: this.pageIndex
          })
          .then((res) => {
            const listDataIds = this.listData.map((v) => v.payload)
            // 用id来排除重复值
            res.data.forEach((resVal) => {
              if (!listDataIds.includes(resVal.payload)) {
                this.listData.push(resVal)
              }
            })
            this.title = res.title
            this.setLoading(false)

            console.log('\n\n\n', res.data, '\n\n\n')

            // 当获取的数据为空 或 获取的数据都是重复的
            if (
              res.data.length === 0 ||
              listDataIds.length === this.listData.length
            ) {
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
            this.pageIndex += 1
            this.getData()
            if (this.pageIndex > 10) {
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
