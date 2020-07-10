<template>
  <div class="settlement" id="settlement">
    <div class="price" @click="toCart">
      <div class="total">
        <span class="icon"></span>
        <span class="num">{{categoryCount}}</span>
      </div>
      <span class="text">
        合计
        <span class="p1">￥</span>
      </span>
      <span class="money">{{totalAmount|money}}</span>
    </div>
    <div style class="btn" @click="toOrder">下单</div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar).use(TabbarItem);
import * as cartTypes from "@/store/cart/types";
import mixin_detection from "@/mixins/order/detection";
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
    ...mapGetters("cart", {
      categoryCount: cartTypes.CATEGORY_COUNT,
      totalAmount: cartTypes.TOTAL_AMOUNT
    })
  },
  mixins: [mixin_detection],
  methods: {
    async toCart() {
      if (this.categoryCount == 0) {
        this.$toast({
          message: "请选择商品",
          duration: 2000
        });
        return;
      }
      this.$router.push({
        path: "/cart/index"
      });
    },
    async toOrder() {
      if (this.categoryCount == 0) {
        this.$toast({
          message: "请选择商品",
          duration: 2000
        });
        return;
      }
      await this.CheckOpenTime();

      this.$router.push({
        path: "/purchase/order"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.van-list__finished-text {
  font-size: 0.24rem;
  height: 0.8rem;
  line-height: 0.8rem;
}
.settlement {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0.97rem;
  height: 1.02rem;
  padding: 0 2rem 0 0;
  z-index: 103;

  .price {
    background: #f3f3f3;
    height: 1.02rem;
    line-height: 1.02rem;
    position: relative;
    // text-align : center;
    padding: 0 0 0 1.5rem;

    .total {
      position: absolute;
      left: 0.3rem;
      top: 0.1rem;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background: #dfdfdf;

      .icon {
        background: url(../views/images/total_img.png) no-repeat top;
        width: 0.41rem;
        height: 0.44rem;
        display: block;
        background-size: 0.41rem 0.44rem;
        margin: 0.18rem auto 0;
      }
    }

    .num {
      height: 0.36rem;
      line-height: 0.37rem;
      border-radius: 0.18rem;
      padding: 0 0.1rem;
      display: block;
      position: absolute;
      left: 0.62rem;
      top: -0.06rem;
      background: #ec6c4e;
      color: #fff;
    }

    .text {
      font-size: 0.24rem;
      color: #606264;
    }

    .money {
      font-size: 0.34rem;
      color: #e90000;
      vertical-align: -0.01rem;
    }

    .p1 {
      color: #e90000;
    }
  }

  .btn {
    background: #2c7afe;
    font-size: 0.32rem;
    text-align: center;
    line-height: 1rem;
    height: 1.02rem;
    color: #fff;
    width: 2rem;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>