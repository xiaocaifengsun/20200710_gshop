<template>
  <div class="main">
    <div v-for="item in list" class="items clear" :key="item.ProductID">
      <div class="item4" @click="remove(item)">
        <img src="./images/delete_icon.jpg" alt />
      </div>
      <div class="item1">
        <x-img :src="item.ImageUrl" alt />
      </div>

      <p class="title ellipsis">{{item.ProductName}}</p>
      <div class="clear details">
        <div class="item2">
          <!-- <p class="p1 ellipsis">{{item.ProductName}}</p> -->
          <p class="p2">规格：{{item.Specification}}</p>
          <p class="p3">￥{{item.BDJ}} / {{item.StandardMeasureUnit}}</p>
        </div>
        <div class="item3">
          <!-- <div class="itemchild1" v-if="!item.bIsStandardPack">
            <input
              type="number"
              v-if="!item.bIsStandardPack"
              class="input_1"
              v-model="item.Packages" 
              v-number.4="item.Packages"
              @blur="numberInputChange(item)"
              @keyup.enter="$event.srcElement.blur()" 
              @focus="focus_packages_fun(item)"
            />
            <span class="text_1">件</span>
          </div>
          <div v-if="item.bIsStandardPack" style="height:0.55rem;"></div>
          <div class="itemchild2">
            <div class="itemchild2_chi">
              <span class="btn reduce" @click="flushGoodInfo(item,0)">-</span>
              <input
                type="number"
                class="input_2"
                v-model="item.Quantity"
                v-number.4="item.Quantity"
                @blur="numberInputChange(item)"
                @keyup.enter="$event.srcElement.blur()" 
                @focus="focus_quantity_fun(item)"
              />
              <span class="btn add " @click="flushGoodInfo(item,1)">+</span>
            </div>
            <span class="text_1">{{item.StandardMeasureUnit}}</span>
          </div>-->
          <div style="height:0.55rem;"></div>
          <div class="itemchild2">
            <div class="itemchild2_chi" :class="{'reporting':item.ReportingUnit==1 }">
              <span class="btn reduce" @click="flushGoodInfo(item,0)">-</span>
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
              <span class="btn add" @click="flushGoodInfo(item,1)">+</span>
            </div>
            <span class="text_1" v-if="item.ReportingUnit==1">件</span>
          </div>
        </div>
      </div>
    </div>
    <div style="height:1rem;"></div>
    <div class="footer_btn" id="footer_btn">
      <span class="text">
        合计
        <span class="p1">￥</span>
      </span>
      <span class="money">{{totalAmount|money}}</span>
      <div class="btn" @click="toOrder">下单</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Card, List } from "vant";
Vue.use(Card).use(List);
import { mapGetters, mapMutations } from "vuex";
import * as types from "@/store/cart/types";
import * as storeTypes from "@/store/store/types";
import mixin_detection from "@/mixins/order/detection";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("cart", {
      list: types.GOODLIST,
      categoryCount: types.CATEGORY_COUNT,
      totalAmount: types.TOTAL_AMOUNT
    }),
    ...mapGetters("store", {
      supplierId: storeTypes.SUPPLIER_ID
    })
  },
  watch: {
    supplierId(val) {
      this.removeGood(true);
    },
    list: {
      deep: true,
      handler(val) {
        this.updateGoodList(val || []);
      }
    }
  },
  mounted() {},
  mixins: [mixin_detection],
  methods: {
    ...mapMutations("cart", {
      addGood: types.ADD,
      removeGood: types.REMOVE,
      updateGood: types.UPDATE,
      updateGoodList: types.SET_GOODLIST
    }),
    // monitor_footer_fun(){
    //   var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //   window.onresize = function(){
    //       var thisHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //       if (winHeight - thisHeight > 10) {
    //           document.getElementById("footer_btn").style.display="none"
    //       } else {
    //           document.getElementById("footer_btn").style.display="block"
    //       }
    //   }
    // },
    async toOrder() {
      if (this.list.length <= 0) {
        this.$toast("还未选择商品");
        return;
      }
      await this.CheckOpenTime();
      this.$router.push({ path: "/purchase/order" });
    },
    remove(item) {
      this.removeGood(item.ProductID);
    },
    numberInputChange(item) {
      item.Packages = _.floor(item.Packages, 4);
      item.Quantity = _.floor(item.Quantity, 4);
      if (item.Packages <= 0 && item.Quantity <= 0) this.remove(item);
    },
    flushGoodInfo(item, plus) {
      item.Packages = _.floor(item.Packages, 4);
      item.Quantity = _.floor(item.Quantity, 4);
      let ispack = item.ReportingUnit == 1; //是否走辅计量
      if (ispack) {
        let curpack = _.round(plus ? item.Packages + 1 : item.Packages - 1, 4);
        item.Packages = curpack > 0 ? curpack : 0;
        item.Quantity = 0;
      } else {
        let curqua = _.round(plus ? item.Quantity + 1 : item.Quantity - 1, 4);
        item.Quantity = curqua > 0 ? curqua : 0;
        item.Packages = 0;
      }
      if (item.Packages <= 0 && item.Quantity <= 0) this.remove(item);
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
