<template>
  <div v-if="show" class="no-list">
    <img src="./null_list.jpg" />
    <span>{{tip}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    tip: {
      default: "暂无信息"
    },
    show: {
      default: false
    }
  }
};
</script>
<style lang="less" scoped>
.no-list {
  background:#FFF;
  text-align: center;
  // height: 100%;
  // background: #FFF;
  // height:100vh;
  margin-top: 1.6rem;
  // padding-top: 2.6rem;
  & > img {
    width: 2rem;
    height:2rem;
    margin: 0 auto;
  }
  & > span {
    display: inline-block;
    margin-top: 0.3rem;
    color: #757575;
    font-size: 0.28rem;
  }
}
</style>