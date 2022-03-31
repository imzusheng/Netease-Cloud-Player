<template>
  <header>
    <nav>
      <div class="logo">
        <img src="../assets/logo_m.png" alt="" />
        <h2>Music</h2>
      </div>
      <SubTabs :sourceData="config.homeTabsData" @change="homeTabsChange" />
      <div class="avatar">
        <img :src="$store.getters.userInfo.profile.avatarUrl" alt="" />
        <!-- <span>{{ userInfo.profile.nickname }}</span> -->
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'LayoutDefault',

  data () {
    return {}
  },

  mounted () {},

  methods: {}
}
</script>
