<template>
  <div class="loading">
    <van-loading color="#919090" type="Circular" />
  </div>
</template>
<script>
import Vue from "vue";
import { Loading } from "vant";
Vue.use(Loading);

export default {
  name: "loading"
};
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10001;
  background: rgba(0, 0, 0, 0);
  text-align: center;
}
.van-loading__spinner {
  width: 40px;
  height: 40px;
}
.van-loading--Circular {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
}
</style>
