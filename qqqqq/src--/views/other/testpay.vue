<template>
  <div class="wrapper">
    <van-field v-model="payda.amount" type="digit" label="支付金额" />
    <van-button type="primary" size="large" @click="signFn">去支付</van-button>
    <x-pay :pay-data="payda" :to-pay.sync="toPay" show-param></x-pay>
  </div>
</template>
<script>
import Vue from "vue";
import { Field } from "vant";
Vue.use(Field);
import xPay from "@/components/x-pay";
import * as types from "@/store/store/types";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      payda: {
        drawee: "", //付款人ID，买家
        payee: "", //收款人ID，卖家或平台方ID
        amount: "0.01",
        // busiNo: "NX-I-024",
        busiOrderNo: "202001071441412033", //业务订单号
        // orderNo: "202001071441412035", //业务支付订单号
        // backRetUrl: "",
        pageRetUrl: `${location.origin}${location.pathname}#/`
        // sellerId: "" //卖家或平台方ID
      },
      toPay: false
    };
  },
  computed: {
    ...mapGetters("store", {
      supplierId: types.SUPPLIER_ID
    })
  },
  watch: {
    supplierId: {
      handler(val) {
        this.payda.payee = this.supplierId;
        // this.payda.sellerId = this.supplierId;
      },
      immediate: true
    },
    ENTID: {
      handler(val) {
        this.payda.drawee = this.ENTID;
      },
      immediate: true
    }
  },
  components: { xPay },
  methods: {
    signFn() {
      this.toPay = true;
    }
  }
};
</script>
<style lang="less" scoped>
</style>