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
  </main>
</template>

<script>
import SectionListFlex from '@/components/SectionListFlex.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'DetailDisplayMore',

  components: {
    SectionListFlex
  },

  data () {
    return {
      listData: [],
      title: ''
    }
  },

  methods: {
    ...mapMutations(['setError', 'setLoading'])
  },

  created () {
    this.setLoading(true)
    const { action } = this.$route.query
    // store.actions中是否存在该函数名
    if (Object.keys(this.$store._actions).includes(action)) {
      // 调用store函数并传入参数
      this.$store.dispatch(action, this.$route.query).then((res) => {
        this.listData = res.data
        this.title = res.title
        this.setLoading(false)
      })
    } else {
      this.setError({
        status: true,
        msg: '无法找到该页面'
      })
    }
  },

  mounted () {
    const headerMaskRef = this.$parent.$refs['main-header-mask']
    headerMaskRef.style.opacity = 1
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
}
</style>
