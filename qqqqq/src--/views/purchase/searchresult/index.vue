<template>
  <div class="container">
    <div class="search_box">
      <div class="search">
        <van-icon name="search" @click="search_fun()" />
        <!--   
      <input
        type="text"
        placeholder="输入商品名称进行查询"
        v-model="req.productname"
        @keyup.enter="$event.target.blur()"
      />
        -->
        <input
          placeholder="输入商品名称进行查询"
          v-model="req.productname"
          @keyup.enter="search_fun()"
          type="search"
          @focus="focus_fun()"
          id="input"
        />
        <!--
        <div class="cancel" @click="cancel_click">取消</div>
        -->
      </div>
    </div>

    <div class="main">
      <van-pull-refresh
        v-model="pullLoading"
        @refresh="pullRefresh"
        style="min-height:calc(100vh - 1.02rem - 0.97rem);"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="showNoMore && goodlist.length>0 ?'没有更多了':''"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          @load="onLoad"
        >
          <no-list :show="showNoMore && goodlist.length==0" tip="暂无商品" style="margin-top:0;" />
          <div v-for="item in goodlist" class="items" :key="item.ProductID">
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
                    {{ item._defaultPack ? "件" : item.StandardMeasureUnit }}
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
                      v-if="item.ReportingUnit==1 && !item.bIsStandardPack"
                      class="input_2"
                      v-model="item.Packages"
                      v-number.4="item.Packages"
                      @blur="numberInputChange(item)"
                      @keyup.enter="$event.srcElement.blur()"
                    />
                    <input
                      type="number"
                      v-if="item.ReportingUnit!=1||item.bIsStandardPack"
                      class="input_2"
                      v-model="item.Quantity"
                      v-number.4="item.Quantity"
                      @blur="numberInputChange(item)"
                      @keyup.enter="$event.srcElement.blur()"
                      @focus="focus_price_fun(item)"
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
import _methods from "./searchresult-mixin";
import xcart from "@/components/x-cart";

export default {
  components: { xcart },
  beforeRouteLeave(to, from, next) {
    let input = document.getElementById("input");
    if (to.path == "/purchase/search") {
      if (input == document.activeElement) {
        next();
      } else {
        this.$router.push({
          path: "/purchase/index"
        });
      }
    } else {
      next();
    }
  },

  data() {
    return {
      goodlist: [],
      req: {
        customerid: "",
        enterpriseid: "", //供应商ID
        productname: this.productname
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
      actionindex: "actionindex-1",
      enableDropDown: false
    };
  },

  computed: {
    ...mapGetters("store", {
      supplierInfo: storeTypes.SUPPLIER_INFO,
      supplierId: storeTypes.SUPPLIER_ID,
      commodityClassification: storeTypes.SET_COMMODITYCLASSIFICATION_TO_LIST,
      productname: storeTypes.PRODUCTNAME
    }),
    ...mapGetters("cart", {
      categoryCount: cartTypes.CATEGORY_COUNT,
      totalAmount: cartTypes.TOTAL_AMOUNT,
      cartGoodList: cartTypes.GOODLIST
    })
  },
  mixins: [_methods],
  methods: {
    ...mapMutations("store", {
      setproductname: storeTypes.SETPRODUCTNAME
    }),
    focus_fun() {
      this.setproductname(this.req.productname);
      // this.$router.go(-1);
      this.$router.push({
        path: "/purchase/search"
      });
    },
    focus_price_fun(item) {
      if (item.Quantity == 0) {
        item.Quantity = "";
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import url("./style.less");
</style>
