<template>
  <van-tabbar
    v-model="curActive"
    :safe-area-inset-bottom="true"
    class="all_footer"
    style="z-index:104" 
    id="footer"
  >
    <van-tabbar-item replace to="/purchase/index" name="purchase" :icon="icoPurchase">订货</van-tabbar-item>
    <van-tabbar-item replace to="/order/index" name="order" :icon="icoOrder">订单</van-tabbar-item>
    <!-- <van-tabbar-item replace to="/cart/index" name="cart" icon="friends-o">购物车</van-tabbar-item> -->
    <van-tabbar-item replace to="/mine/index" name="mine" :icon="icoMine">我的</van-tabbar-item>
  </van-tabbar>
</template>
<script>
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar).use(TabbarItem);
export default {
  props: {
    active: {
      default: "purchase"
    }
  },
  watch: {
    active(val) {
      this.curActive = val;
    }
  },
  data() {
    return {
      curActive: this.active
    };
  },
  computed: {
    icoPurchase() {
      return this.curActive == "purchase"
        ? require("@/static/imgs/ico-purchase-active.png")
        : require("@/static/imgs/ico-purchase.png");
    },
    icoOrder() {
      return this.curActive == "order"
        ? require("@/static/imgs/ico-order-active.png")
        : require("@/static/imgs/ico-order.png");
    },
    icoMine() {
      return this.curActive == "mine"
        ? require("@/static/imgs/ico-mine-active.png")
        : require("@/static/imgs/ico-mine.png");
    }
  }
};
</script>
<style lang="less" scoped>
.all_footer {
  z-index: 104;
  height:0.97rem;

}

</style>
<style  lang="less">
.all_footer {
  z-index: 104;
  height:1rem;
  border-top:1px solid #dde1e5;
  border-bottom:none;

  .van-icon__image{
    width:0.46rem;
    height:0.43rem;
    img{
      width:100%;
      height:100%;
    }
  }
  .van-tabbar-item__text{
    font-size:0.24rem;

  }
}
.van-tabbar--fixed{
      bottom: -0.01rem;
}
</style>