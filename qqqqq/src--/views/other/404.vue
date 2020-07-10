<template>
  <div class="wrapper">
    <van-image :src="require('@/static/imgs/404.jpg')"></van-image>
    <!-- <div class="info">这里什么都没有</div> -->
  </div>
</template>
<script>
export default {
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrapper {
  margin-top: 20px;
  .info {
    height: 50px;
    text-align: center;
    line-height: 50px;
    margin: auto;
  }
  .van-image {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }
}
</style>