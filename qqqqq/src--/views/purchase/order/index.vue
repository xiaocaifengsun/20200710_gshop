<template>
  <div class="main">
    <div class="user" @click="selAddress">
      <div v-if="selectedAddress">
        <div class="item">
          <span class="co1">收货人：</span>
          {{selectedAddress.name}}
        </div>
        <div class="item address">
          <span class="co1">收货地址：</span>
          {{selectedAddress.areaFullName}} {{selectedAddress.addr}}
        </div>
        <div class="item">
          <span class="co1">联系电话：</span>
          {{selectedAddress.tel}}
        </div>
      </div>
      <img src="../images/user_icon.jpg" alt class="user_icon" />
    </div>
    <div class="supplier">{{supplierInfo.EnterpriseName}}</div>
    <div class="order">
      <div class="title">
        商品
        <span class="strain">品种 {{categoryCount}}</span>
      </div>
      <div class="order_item" v-for="item in list" :key="item.ProductID">
        <div class="clear items">
          <div class="item1">
            <x-img :src="item.ImageUrl" alt />
          </div>
          <div class="item2">
            <p class="p1">{{item.ProductName}}</p>
            <p class="p2">规格：{{item.Specification}}</p>
          </div>
          <div class="item3">
            <p class="p3">￥{{item.BDJ}} / {{item.StandardMeasureUnit}}</p>
            <!-- <p class="p4" v-if="!item.bIsStandardPack">x {{item.Packages}}件</p> -->
            <p class="p4" v-if="item.ReportingUnit==1">x {{item.Packages}}件</p>
            <p class="p5" v-else>x {{item.Quantity}} {{item.StandardMeasureUnit}}</p>
          </div>
        </div>
        <div class="footer">小计：￥{{(item.BDJ*item.Quantity)|money}}</div>
      </div>
      <div class="footer_inp">
        备注：
        <input type="text" v-model="daInfo.Remarks" maxlength="100" placeholder="请输入订单备注" />
      </div>
      <div class="state">
        <div class="co1">交易方式：</div>
        <div class="co2">线下交易</div>
      </div>
    </div>
    <div style="height:1rem;"></div>
    <div class="footer_btn" id="footer_btn">
      <span class="text">
        合计
        <span class="p1">￥</span>
      </span>
      <span class="money">{{totalAmount|money}}</span>
      <div class="btn" @click="generateOrder">确认下单</div>
    </div>

    <div class="dialog" v-if="dialog_show">
      <div class="dash" @click="dialog_show=false;"></div>
      <div class="dialog_main">
        <div class="header">
          <van-icon name="cross" @click="dialog_show=false;" />付款详情
        </div>
        <p class="price">
          {{totalAmount|money}}
          <span>元</span>
        </p>
        <div class="btns clear">
          <div class="btn" @click="payBtnType=1;" :class="{'btn1':payBtnType==1}">
            <span>在线支付</span>
          </div>
          <div class="btn" @click="payBtnType=0;" :class="{'btn1':payBtnType==0}">
            <span>暂不支付</span>
          </div>
        </div>
        <div class="btn3" @click="placeOrder">立即下单</div>
      </div>
    </div>
    <x-pay :pay-data="payda" :show-param="false" :to-pay.sync="toPay"></x-pay>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import * as types from "@/store/cart/types";
import * as storeTypes from "@/store/store/types";
import * as addressTypes from "@/store/address/types";
import * as apiMine from "@/api/mine";
import * as apiOrder from "@/api/order";
import mixin_detection from "@/mixins/order/detection";
import mixin_pay from "@/mixins/order/pay";

import xPay from "@/components/x-pay";

import Vue from "vue";
import { Icon } from "vant";

Vue.use(Icon);
export default {
  data() {
    return {
      daInfo: {
        Remarks: ""
      },
      dialog_show: false,
      payda: {
        drawee: "", //付款人ID，买家
        payee: "", //收款人ID，卖家或平台方ID
        amount: "",
        busiOrderNo: "", //业务订单号
        pageRetUrl: ``,
      },
      toPay: false,
      payBtnType: 0,
      reqdata: {}
    };
  },
  components: { xPay },
  computed: {
    ...mapGetters("cart", {
      list: types.GOODLIST,
      categoryCount: types.CATEGORY_COUNT,
      totalAmount: types.TOTAL_AMOUNT
    }),
    ...mapGetters("store", {
      supplierInfo: storeTypes.SUPPLIER_INFO,
      supplierId: storeTypes.SUPPLIER_ID
    }),
    ...mapGetters("address", {
      selectedAddress: addressTypes.SELECTED_ADDR
    })
  },
  async created() {
    await this.GET_ENTID();
    this.getDefaultAddress();
  },
  watch: {
    dialog_show(val) {
      this.payBtnType = val ? 1 : 0;
    }
  },
  mixins: [mixin_detection, mixin_pay],
  methods: {
    ...mapMutations("cart", {
      removeGood: types.REMOVE
    }),
    ...mapMutations("address", {
      removeAddress: addressTypes.REMOVE_SELECTED,
      setSelectedAddr: addressTypes.SET_SELECTED_ADDR
    }),
    selAddress() {
      this.$router.push({ path: "/mine/address/index", query: { back: 1 } });
    },
    async getDefaultAddress() {
      if (_.isEmpty(this.selectedAddress)) {
        let list = await this.$post(apiMine.addresslist, { type: 1 });
        this.setSelectedAddr((list || [])[0]);
      }
    },
    async generateOrder() {
      let list = this.list; //购物车商品列表
      if (list.length <= 0) {
        this.$toast("还未选择商品");
        return;
      }
      if (_.isEmpty(this.selectedAddress)) {
        this.$toast("请选择收货地址");
        return;
      }
      this._showLoading();
      await this.CheckOpenTime();

      let supplierId = this.supplierId;
      let addr = this.selectedAddress;
      let orderinfo = _.assign(
        {
          DataDate: this._getDate(),
          CustomerID: this.ENTID,
          SupplierID: supplierId,
          EnterpriseID: supplierId,
          PaymentType: "201612070104402301", //-- 支付方式  暂不结算
          Consignee: addr.name,
          DeliveryAddress: `${addr.areaFullName || ""} ${addr.addr || ""}`,
          DeliveryPhone: addr.tel,
          Remarks: "" //备注
        },
        this.daInfo
      );
      let reqdata = {
        order: JSON.stringify(orderinfo),
        orderdetail: JSON.stringify(
          list.map(item => {
            return {
              ProductID: item.ProductID,
              Quantity: item.Quantity,
              Packages: item.Packages,
              UnitPriceTax: item.BDJ, //开票价
              UnitDiscount: 0, //折扣
              bIsStandardPack: item.bIsStandardPack //是否标品
            };
          })
        )
      };

      this.reqdata = reqdata;
      if (await this.checkRepeat(reqdata)) {
        this._hideLoading();
        await this.confirmDialog("", "你今日已下过此单，是否继续下单？");
        this._showLoading();
      }
      let retCPA = await this.CheckProductAvg(list);
      if (retCPA.list.length > 0) {
        this._hideLoading();
        await this.confirmDialog("超过订货标准提醒", retCPA.tip);
        this._showLoading();
      }
      //判断价格是否是0 如果0 直接执行未开启在线支付模式    this.payBtnType = 0
      if(this.totalAmount==0){
        this.placeOrder();
        return false;
      }
/** 在这判断是否需要谈框显示支付 */
      var shouldPay = await this.CheckToPay();
      if (shouldPay) {
        //开启了在线支付
        this._hideLoading();
        this.dialog_show = true;
      } else {
        //未开启在线支付
        this.placeOrder();
      }
    },
    onlinePay() {
      this.toPay = true;
    },
    async placeOrder() {       //
      //下单
      this._showLoading();
      let res = await this.$post(
        apiOrder.addOrder,
        this.reqdata,
        res => {},
        err => {
          this.$toast({ message: "下单失败，请稍后再试", duration: 2000 });
        }
      );
      var totalAmount = this.totalAmount;
      this.removeGood(true);
      this._hideLoading();
      this.dialog_show = false;

      if (this.payBtnType == 1) {     //开启在线支付 中 在线支付
        this.payda.drawee = this.ENTID;
        this.payda.payee = this.supplierId;
        this.payda.amount = totalAmount;
        this.payda.busiOrderNo = res.numericalOrder;
        this.payda.pageRetUrl = `${location.origin}${location.pathname}#/order/index`;
        this.toPay = true;
      } else {     //未开启在线支付  和 开启在线支付中的的暂不支付 
        this.$router.replace({ path: "/order/index" });
      }
    },

    confirmDialog(title, message, className) {
      return new Promise((resolve, reject) => {
        this.$dialog
          .confirm({
            title: title,
            message: message,
            className: className || "tip_avg_cls"
          })
          .then(() => {
            resolve();
          })
          .catch(() => {});
      });
    },
    async checkRepeat(data) {
      var res = await this._post(apiOrder.checkOrderRepeat, data);
      return res.code == 1;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./style.less");
</style>
<style lang="less">
.tip_avg_cls {
  .van-dialog__header {
    font-weight: 700;
  }
  .tip_avg_strong {
    color: #000;
  }
}
.van-dialog__message--has-title {
  line-height: 0.48rem;
}
</style>