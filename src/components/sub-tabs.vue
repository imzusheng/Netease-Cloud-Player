<!-- 大标题下的tabs组件 -->
<template>
  <ul class="sub-tabs">
    <li v-for="(item, index) in sourceData.list" :key="`tabs${index}`">
      <input
        type="radio"
        :id="item.id"
        :value="item.title"
        :name="sourceData.name"
        v-model="tabsChecked"
      />
      <label :for="item.id">{{ item.title }}</label>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SubTabs',
  data () {
    return {
      tabsChecked: ''
    }
  },
  props: ['sourceData'],
  mounted () {
    this.tabsChecked = this.$props.sourceData.checked
  },
  watch: {
    tabsChecked (newVal) {
      this.$emit('change', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
ul[class="sub-tabs"] {
  display: flex;
  padding-left: 24px;

  li {
    padding: 0 9px;
    position: relative;
    line-height: 2;
    font-size: 15px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);

    input {
      visibility: hidden;
      position: absolute;
      cursor: pointer;
    }

    label {
      transition: all 0.4s;
      cursor: pointer;
    }

    input:checked + label {
      color: red;
    }
  }
}
</style>
