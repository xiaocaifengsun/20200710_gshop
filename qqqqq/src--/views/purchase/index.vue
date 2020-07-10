<template>
  <div class="main van-clearfix purchase-wrapper">
    <div class="top">
      <div class="supplier van-clearfix" @click="selSupplier">
        当前供应商
        <van-icon name="arrow" />
        <span class="shop">{{supplierInfo.EnterpriseName||"暂无供应商"}}</span>
      </div>
      <div class="search_box">
        <div class="search_border">
          <div class="search" @click="href_search_fun()">
            <van-icon name="search" />输入商品名称进行查询
            <div class="scanning t_r">
              <img alt class="scanning" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li
          :class="{'action':req.classificationid==0}"
          @click="CommodityClasschange({id:0,name:'全部商品'})"
        >
          <span></span>全部商品
        </li>
        <li
          v-for="(item) in commodityClassList"
          :key="item.id"
          @click="CommodityClasschange(item)"
          :class="{'action':req.classificationid==item.id}"
        >
          <span></span>
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class style="min-height: calc(100vh - 1.7rem - 1.02rem - 0.97rem);">
      <van-pull-refresh v-model="pullLoading" @refresh="pullRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="showNoMore && goodlist.length>0 ?'没有更多了':''"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          @load="onLoad"
          class="van-clearfix"
        >
          <div style="height:0.3rem;"></div>
          <div class="items_title">{{classificationName}}</div>
          <no-list
            :show="showNoMore && goodlist.length==0"
            tip="暂无商品"
            style="height: calc(100vh - 1.7rem - 1.02rem - 0.97rem - 2.1rem);margin-top:0.8rem;"
          />

          <div v-for="item in goodlist" class="items van-clearfix" :key="item.ProductID">
            <div class="item1">
              <x-img :src="item.ImageUrl" alt />
            </div>
            <p class="title ellipsis">{{item.ProductName}}</p>
            <div class="clear details">
              <div class="item2">
                <p class="p2">规格：{{item.Specification}}</p>
                <p class="p3">
                  <span class="font24">￥</span>
                  {{item.BDJ}}
                  <span
                    style="font-size:0.27rem;"
                  >/ {{item.StandardMeasureUnit}}</span>
                </p>
              </div>
              <div class="item3">
                <div class="itemchild1">
                  <div
                    class="input_1"
                    @click="item._showDropList=!item._showDropList"
                    v-if="!item.bIsStandardPack && enableDropDown"
                    :class="{'action':item._showDropList}"
                  >
                    {{ item.ReportingUnit==1 ? "件" : item.StandardMeasureUnit }}
                    <div class="icon"></div>
                    <ul class="list" v-if="item._showDropList">
                      <li @click="standardPackChange(item,1)">件</li>
                      <li @click="standardPackChange(item,0)">{{item.StandardMeasureUnit}}</li>
                    </ul>
                  </div>
                </div>
                <div class>
                  <div class="itemchild2" :class="{'reporting':item.ReportingUnit==1}">
                    <!-- <div class="itemchild2" :class="{'reporting':item.ReportingUnit!=0}"> -->
                    <span class="btn reduce" @click="prepareAddCart(item,0)">-</span>
                    <input
                      type="number"
                      v-if="item.ReportingUnit==1"
                      class="input_2"
                      v-model="item.Packages"
                      v-number.4="item.Packages"
                      @blur="numberInputChange(item)"
                      @keyup.enter="$event.srcElement.blur()"
                      @focus="focus_packages_fun(item)"
                    />
                    <input
                      type="number"
                      v-if="item.ReportingUnit!=1"
                      class="input_2"
                      v-model="item.Quantity"
                      v-number.4="item.Quantity"
                      @blur="numberInputChange(item)"
                      @keyup.enter="$event.srcElement.blur()"
                      @focus="focus_quantity_fun(item)"
                    />
                    <span class="btn add action" @click="prepareAddCart(item,1)">+</span>
                  </div>

                  <span class="text_1" v-if="item.ReportingUnit==1">件</span>
                  <!-- <span class="text_1" v-if="item.ReportingUnit!=0">件</span> -->
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <div style="height:1.99rem;"></div>
    <xcart></xcart>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, List, Card, Icon, PullRefresh } from "vant";
Vue.use(Field)
  .use(List)
  .use(Card)
  .use(Icon)
  .use(PullRefresh);
import * as storeTypes from "@/store/store/types";
import * as cartTypes from "@/store/cart/types";
import { mapGetters, mapMutations } from "vuex";
import _methods from "./purchase-mixin";
import xcart from "@/components/x-cart";

export default {
  data() {
    return {
      goodlist: [],
      req: {
        customerid: "",
        enterpriseid: "", //供应商ID
        productname: "",
        classificationid: 0
      },
      reqdata: {
        datadate: this._getDate(),
        pageindex: 0,
        pagesize: 10
      },
      loading: false,
      finished: true,
      error: false,
      showNoMore: false,
      pullLoading: false,
      commodityClassList: [],
      indexcount: 0,
      classificationName: "全部商品",
      enableDropDown: false
    };
  },
  components: { xcart },
  computed: {
    ...mapGetters("store", {
      supplierInfo: storeTypes.SUPPLIER_INFO,
      supplierId: storeTypes.SUPPLIER_ID,
      commodityClassification: storeTypes.SET_COMMODITYCLASSIFICATION_TO_LIST
    }),
    ...mapGetters("cart", {
      categoryCount: cartTypes.CATEGORY_COUNT,
      totalAmount: cartTypes.TOTAL_AMOUNT,
      cartGoodList: cartTypes.GOODLIST
    })
  },
  mixins: [_methods],
  methods: {
    touchmove_fun() {
      console.log(1);
    },
    CommodityClasschange(value) {
      this.req.classificationid = value.id;
      //console.log(value.name);
      this.classificationName = value.name;
    },
    focus_quantity_fun(item) {
      if (item.Quantity == 0) {
        item.Quantity = "";
      }
    },
    focus_packages_fun(item) {
      if (item.Packages == 0) {
        item.Packages = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./style.less");
</style>
<style lang="less">
.purchase-wrapper {
  .van-pull-refresh {
    margin-top: 1.7rem;
    // margin-bottom: calc(0.97rem + 1.02rem);
    padding-left: 1.82rem;
    // min-height: calc(100vh - 1.72rem - 1.02rem - 0.97rem);
    .van-list {
      // overflow: auto;
      // height: calc(100vh - 1.72rem - 1.02rem - 0.97rem);
      min-height: calc(100vh - 1.7rem - 1.02rem - 0.97rem);
      padding-left: 0rem;
    }
  }
}
.van-list__finished-text {
  font-size: 0.24rem;
  height: 0.8rem;
  line-height: 0.8rem;
  overflow-y: hidden;
}
</style>