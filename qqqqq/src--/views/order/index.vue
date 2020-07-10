<template>
  <div class="main order_customer">
    <van-tabs
      class="tab-wrapper"
      v-model="active"
      @change="tabChange"
      :swipe-threshold="5"
      type="card"
    >
      <van-tab title="全部" name="all-0"></van-tab>
      <van-tab title="待处理" name="pending-1"></van-tab>
      <van-tab title="待发货" name="sending-2"></van-tab>
      <van-tab title="待收货" name="receiving-3"></van-tab>
      <van-tab title="已完成" name="completed-4"></van-tab>
    </van-tabs>

    <van-pull-refresh v-model="pullLoading" @refresh="pullRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="showNoMore && list.length>0 ?'没有更多了':''"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
        @load="onLoad"
      >
        <no-list :show="showNoMore && list.length==0" tip="暂无订单" />
        <div v-for="(item,ind) in list" :key="item.NumericalOrder" class="item">
          <div class="container">
            <div class="title">
              {{item.EnterpriseName}}
              <span class="state">
                {{item.DistributionStatus|orderstatus}}
                <template
                  v-if="item.OptionValue == 1 && item.AmountTotal > 0"
                >
                  (
                  <span v-if="item.realAmount == 0">待付款</span>
                  <span v-if="item.realAmount > 0 && item.realAmount < item.AmountTotal">部分付款</span>
                  <span v-if="item.realAmount >= item.AmountTotal">已付款</span>
                  )
                </template>
              </span>
            </div>
            <div class="main ellipsis" @click="viewDetail(item.NumericalOrder,ind)">
              {{item.ProductName|filterProductName}}
              <p class="price">
                <span>￥</span>
                {{(item.CheckState?item.ActualPayment:item.AmountTotal)|money}}
              </p>
            </div>
            <div class="btns">
              <span
                class="btn"
                v-if="item.DistributionStatus == 1 && item.realAmount == 0"
                @click="deleteOrder(item.NumericalOrder,ind)"
              >删除订单</span>
              <span class="btn" @click="buyAgain(item.NumericalOrder)">再次购买</span>

              <template v-if="item.OptionValue == 1 && item.AmountTotal > 0 && item.LossAmount > 0">
                <span class="btn btn2" @click="placeOrder(item)">付款</span>
              </template>
              <span
                class="btn btn1"
                v-if="item.DistributionStatus==3"
                @click="viewDelivery(item,ind)"
              >确认收货</span>
            </div>
          </div>
          <div class="null"></div>
        </div>
      </van-list>
    </van-pull-refresh>
    <x-pay :pay-data="payda" :show-param="false" :to-pay.sync="toPay"></x-pay>
  </div>
</template>
<script>
import Vue from "vue";
import { List, Tab, Tabs, PullRefresh } from "vant";
Vue.use(List)
  .use(Tab)
  .use(Tabs)
  .use(PullRefresh);
import indexMixin from "./index-mixin";
import xPay from "@/components/x-pay";
export default {
  data() {
    return {
      active: "all-0",
      pullLoading: false,
      list: [],
      req: {
        distributiondtatus: 0, //状态，全部  0、待处理 1 、待发货  2 、待收货 3 、已完成 4
        customerid: "", //单位Id
        begindate: "",
        enddate: ""
      },
      reqdata: {
        pageindex: 0,
        pagesize: 10
      },
      preReq: {}, //上一次请求数据,用于防抖后数据拼接判断
      loaded: false,
      loading: false,
      finished: true,
      error: false,
      showNoMore: false,
      payda: {
        drawee: "", //付款人ID，买家
        payee: "", //收款人ID，卖家或平台方ID
        amount: "",
        busiOrderNo: "", //业务订单号
        pageRetUrl: ``
      },
      toPay: false
    };
  },
  mixins: [indexMixin],
  filters: {
    filterProductName(val) {
      let products = val.split(",");
      let prefix = _.take(products, 2).join("、");
      if (products.length > 2) {
        return prefix + ` 等${products.length}种商品`;
      }
      return prefix;
    }
  },
  components: { xPay },
  methods: {
    async placeOrder(item) {
      this.payda.drawee = this.ENTID;
      this.payda.payee = item.EnterpriseID;
      this.payda.amount = item.LossAmount;
      this.payda.busiOrderNo = item.NumericalOrder;
      this.payda.pageRetUrl = `${location.origin}${location.pathname}#/order/index`;

      this.toPay = true;
    }
  }
};
</script>
<style lang="less" scoped>
.item {
  background: #fff;
  .container {
    padding: 0 0.3rem 0.1rem;
    .title {
      font-size: 0.32rem;
      color: #202328;
      height: 0.92rem;
      line-height: 0.92rem;
      position: relative;
      font-weight: 700;
      border-bottom: 1px solid #e9ebef;
      padding: 0 1.2rem 0 0;
      .state {
        position: absolute;
        color: #3067fc;
        font-size: 0.26rem;
        right: 0;
        top: 0.02rem;
      }
    }
    .main {
      position: relative;
      color: #646668;
      font-size: 0.28rem;
      height: 0.85rem;
      line-height: 0.85rem;
      padding-right: 1.6rem;
      .price {
        position: absolute;
        right: 0;
        top: 0rem;
        color: #202328;
        font-size: 0.32rem;
        span {
          font-size: 0.26rem;
        }
      }
    }
    .btns {
      text-align: right;
      .btn {
        height: 0.68rem;
        line-height: 0.68rem;
        border-radius: 0.34rem;
        display: inline-block;
        padding: 0 0.28rem;
        margin: 0 0 0.2rem 0.2rem;
        text-align: center;
        color: #8b8c8e;
        border: 1px solid #d9dce0;
      }
      .btn1 {
        color: #2f68fc;
        border: 1px solid #2f68fc;
      }
      .btn2 {
        background: #2f68fc;
        color: #fff;
        border: 1px solid #2f68fc;
      }
    }
  }
  .null {
    height: 0.2rem;
    background: #f6f6f6;
  }
}
</style>
<style lang="less">
.order_customer {
  .van-pull-refresh {
    background: #f6f6f6;
    margin-top: 0.9rem;
    // margin-bottom: 50px;
    padding-left: 0;
  }

  .van-list {
    padding-top: 0.2rem;
    min-height: calc(100vh - 0.9rem - 0.97rem);
    padding-bottom: 50px;
  }
  .van-tabs__wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
  }
  .van-tabs__nav--card .van-tab {
    border-right: none;
  }
  .tab-wrapper .van-tabs__nav--card {
    margin: 0;
  }
  .van-tabs__nav--card {
    border: none;
    height: 0.9rem;
  }
  .van-tabs--card > .van-tabs__wrap {
    height: 0.9rem;
  }
  .van-tabs__nav--card .van-tab {
    line-height: 0.9rem;
  }
  .tab-wrapper {
    padding-top: 0;
  }
  .van-tab span {
    height: 0.9rem;
    display: inline-block;
    color: #949596;
    font-size: 0.28rem;
  }
  .van-tabs__nav--card .van-tab.van-tab--active {
    background: none;
    color: #2f68fc;
  }
  .van-tabs__nav--card .van-tab.van-tab--active span {
    border-bottom: 2px solid #2f68fc;
  }
  .van-list {
    padding-left: 0rem;
  }
}
</style>