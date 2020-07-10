<template>
  <div class="main">
    <div class="header">
      <img src="../images/dcl.jpg" v-if="!isCompleted" alt />
      <img src="../images/ywc.jpg" v-if="isCompleted" alt />
      {{info.item1.DistributionStatus|orderstatus}}
      <template
        v-if="info.item1.OptionValue == 1 && info.item1.AmountTotal > 0"
      >
        (
        <span v-if="info.item1.realAmount == 0">待付款</span>
        <span v-if="info.item1.realAmount > 0 && info.item1.realAmount < info.item1.AmountTotal">部分付</span>
        <span v-if="info.item1.realAmount >= info.item1.AmountTotal">已付款</span>
        )
      </template>
      <span class="store">{{info.item1.EnterpriseName}}</span>
    </div>

    <div class="user">
      <div>
        <div class="item">
          <span class="co1">收货人：</span>
          {{info.item1.Consignee}}
        </div>
        <div class="item address1">
          <span class="co1">收货地址：</span>
          {{info.item1.DeliveryAddress}}
        </div>
        <div class="item">
          <span class="co1">联系电话：</span>
          {{info.item1.DeliveryPhone}}
        </div>
      </div>
      <!-- <img src="../images/user_icon.jpg" alt class="user_icon" /> -->
    </div>
    <div class="order">
      <div class="title">
        商品
        <span class="strain">品种：{{info.item2.length}}</span>
      </div>
      <div class="order_item" v-for="item in info.item2" :key="item.ProductID">
        <div class="clear items">
          <div class="item1">
            <x-img :src="item.ImageUrl" alt />
          </div>
          <div class="item2">
            <p class="p1">{{item.ProductName}}</p>
            <p class="p2">规格：{{item.Specification}}</p>
          </div>
          <div class="item3">
            <p class="p3">￥{{item.UnitPriceTax}} / {{item.StandardMeasureUnit}}</p>
            <p class="p4" v-if="item.ReportingUnit==1">
              x {{item.Packages}} 件
              <span v-if="isDelivered">(实收 {{item.ActualPackages}})</span>
            </p>
            <p v-else sytle="height:0.3rem; width:100%;">&nbsp;</p>
            <p class="p5" v-if="item.ReportingUnit!=1">
              x {{item.Quantity}} {{item.StandardMeasureUnit}}
              <span
                v-if="isDelivered"
              >(实收 {{item.ActualQuantity}})</span>
            </p>
          </div>
        </div>
        <div class="footer" v-if="isDelivered">￥ {{item.ActualAmountTotal|money}}</div>
        <div class="footer" v-else>￥ {{item.AmountTotal|money}}</div>
      </div>
      <!--  <div class="footer_inp">
        备注:
        <input type="text" maxlength="100" placeholder="请输入订单备注" />
      </div>-->
    </div>
    <div style="height:0.2rem;background: rgb(246, 246, 246);"></div>
    <div class="details">
      <div class="title">付款信息</div>
      <div class="item clear">
        <div class="item_20">交易方式</div>
        <div class="item_80">{{info.item1|PaymentTypeFilter}}</div>
      </div>
      <div class="item clear">
        <div class="item_20">订单总价</div>
        <div class="item_80" v-if="isDelivered">￥ {{info.item1.ActualPayment}}</div>
        <div class="item_80" v-else>￥ {{info.item1.AmountTotal}}</div>
      </div>
      <div class="item clear">
        <div class="item_20">应付金额</div>
        <div class="item_80" v-if="isDelivered">￥ {{info.item1.ActualPayment}}</div>
        <div class="item_80" v-else>￥ {{info.item1.AmountTotal}}</div>
      </div>
      <!--
      <div class="item clear" v-if="isCompleted">
        <div class="item_20">实付金额</div>
        <div class="item_80 co1">￥ {{info.item1.ActualPayment}}</div>
      </div>
      -->
      <div class="item clear">
        <div class="item_20">已付金额</div>
        <div class="item_80 co1">￥ {{info.item1.realAmount}}</div>
      </div>
    </div>
    <div style="background:#f6f6f6;height:0.2rem;"></div>
    <div class="details">
      <div class="title">其它信息</div>
      <div class="item clear">
        <div class="item_20">订单编号</div>
        <div class="item_80">{{info.item1.NumericalOrder}}</div>
      </div>
      <div class="item clear">
        <div class="item_20">采购员</div>
        <div class="item_80">{{info.item1.OwnerName}}</div>
      </div>
      <div class="item clear">
        <div class="item_20">下单日期</div>
        <div class="item_80">{{info.item1.CreatedDate|datetime("yyyy-MM-dd hh:mm:ss")}}</div>
      </div>
      <div class="item clear" v-if="orderState == 4">
        <div class="item_20">收货时间</div>
        <div class="item_80">{{info.item1.ReceivingDate|datetime("yyyy-MM-dd hh:mm:ss")}}</div>
      </div>
    </div>

    <!--
this.info.item1.DistributionStatus

      <span class="btn btn_2">确认收款</span>
      <span class="btn btn_1">付款记录</span>
     
    -->
    <!--待处理 -->
    <!-- 
    <template v-if="orderState==1">
      <div style="height:1.56rem; background: rgb(246, 246, 246);" ></div>
      <div class="delete_item clear" >
        <template v-if="info.item1.OptionValue == 1 && info.item1.AmountTotal > 0 && info.item1.LossAmount > 0">
          <span class="btn btn_2" @click="placeOrder(info.item1)">付款</span>
        </template>
        <span @click="deleteOrder" class="btn btn_1">删除</span>
    -->
    <!-- <div class="dialog">
          <span class="icon"></span>
          <span class="icon"></span>
          <span class="icon"></span>
          <ul>
            <li>再次购买</li>
            <li>联系商家</li>
          </ul>
    </div>-->
    <!-- 
      </div>
    </template>
    <div @click="paylist">付款记录</div>

    已经付款
     开启了在线支付 总金额不是0元  需要支付的金额 大于0 
     <!--待处理状态 出现删除按钮
    -->

    <div style="height:1.56rem; background: rgb(246, 246, 246);"></div>

    <!--待处理 -->
    <!--
    <template v-if="orderState==1">
      <div class="operation">
        <span class="btn btn_1" @click="buyAgain(info.item1.NumericalOrder)">再次购买</span>
        <span class="btn btn_1" v-if="orderState==1" @click="deleteOrder">删除</span>  
       
        <template v-if="info.item1.OptionValue == 1 && info.item1.AmountTotal > 0 && info.item1.LossAmount > 0">
          <span class="btn btn_1" @click="placeOrder(info.item1)">付款</span>
        </template>
         <span  class="btn btn_1" v-if="info.item1.OptionValue == 1 && info.item1.realAmount > 0" @click="paylist">付款记录</span>
      </div>
    </template>
    -->
    <!--待发货 -->
    <!--
    <template v-if="orderState==2">
      <div class="operation">
        <span class="btn btn_1" @click="buyAgain(info.item1.NumericalOrder)">再次购买</span>
        <template v-if="info.item1.OptionValue == 1 && info.item1.AmountTotal > 0 && info.item1.LossAmount > 0">
          <span class="btn btn_1" @click="placeOrder(info.item1)">付款</span>
        </template>
        <span  class="btn btn_1" v-if="info.item1.OptionValue == 1 && info.item1.realAmount > 0" @click="paylist">付款记录</span>
      </div>
    </template>
    -->
    <!--待收货-->
    <!--
    <template v-if="orderState==3">
      <div class="operation">
        <span class="btn btn_1" @click="buyAgain(info.item1.NumericalOrder)">再次购买</span>
       
        <template v-if="info.item1.OptionValue == 1 && info.item1.AmountTotal > 0 && info.item1.LossAmount > 0">
          <span class="btn btn_1" @click="placeOrder(info.item1)">付款</span>
        </template> 
          <span
            class="btn btn_1"
            @click="viewDelivery(info.item1)"
          >确认收货</span>
         <span  class="btn btn_1" v-if="info.item1.OptionValue == 1 && info.item1.realAmount > 0" @click="paylist">付款记录</span>
      </div>
    </template>
    -->
    <!--已完成 -->
    <!--
    <template v-if="orderState==4">
      <div class="operation">
        <span class="btn btn_1" @click="buyAgain(info.item1.NumericalOrder)">再次购买</span>
       
        <template v-if="info.item1.OptionValue == 1 && info.item1.AmountTotal > 0 && info.item1.LossAmount > 0">
          <span class="btn btn_1" @click="placeOrder(info.item1)">付款</span>
        </template>    
      </div>
      <span  class="btn btn_1" v-if="info.item1.OptionValue == 1 && info.item1.realAmount > 0" @click="paylist">付款记录</span>
    </template>
    -->
    <div class="operation">
      <!--确认收货  -->
      <span class="btn btn_1" @click="viewDelivery(info.item1)" v-if="orderState == '3'">确认收货</span>
      <template v-if="info.item1.OptionValue == 1">
        <!--开启了在线支付 总金额不是0元  需要支付的金额 大于0  -->
        <span class="btn btn_2" v-if="info.item1.AmountTotal > 0 && info.item1.LossAmount > 0" @click="placeOrder(info.item1)">付款</span>
        <template v-if="info.item1.realAmount > 0 || this.myPayRecordList>0">
          <span  class="btn btn_1" @click="paylist" v-if="IS_PERSON">付款记录</span>
          <span  class="btn btn_1" @click="paylist" v-if="!IS_PERSON && (myPayRecordState & 1)==1">付款记录</span>
        </template>
      </template>
      <span class="btn btn_1" @click="buyAgain(info.item1.NumericalOrder)">再次购买</span>
      <!-- 删除按钮  订单状态待处理-->
      <span class="btn btn_1" v-if="orderState == 1 && info.item1.realAmount == 0" @click="deleteOrder">删除订单</span>
    </div>

    <x-pay :pay-data="payda" :show-param="false" :to-pay.sync="toPay"></x-pay>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import * as apiOrder from "@/api/order";
import * as apiMine from "@/api/mine";
import * as apiPurchase from "@/api/purchase";
import * as orderTypes from "@/store/order/types";
import * as storeTypes from "@/store/store/types";
import * as cartTypes from "@/store/cart/types";
import xPay from "@/components/x-pay";
export default {
  data() {
    return {
      info: {
        item1: {},
        item2: []
      },
      numericalorder: null,
      payda: {
        drawee: "", //付款人ID，买家
        payee: "", //收款人ID，卖家或平台方ID
        amount: "",
        busiOrderNo: "", //业务订单号
        pageRetUrl: ``
      },
      toPay: false,
      myPayRecordState:"",     //Record 付款记录权限判断
      myPayRecordList:""  //付款记录 数据是否 有
    };
  },
  computed: {
    isCompleted() {
      return this.info.item1.DistributionStatus == 4;
    },
    orderState() {
      /** 1 = 待处理，2 = 待发货，3 = 待收货，4 = 已完成 */
      return this.info.item1.DistributionStatus;
    },
    /** 配送端已确认送达 */
    isDelivered() {
      return this.info.item1.CheckState == 1;
    }
  },
  created() {
    this.numericalorder = this.$route.params.numericalorder;
    this.getOrderInfo();
    this.getMyPayRecordState();
    this.getMyPayRecordList()
  },
  filters: {
    PaymentTypeFilter(info) {
      return info.PaymentType == "201612070104402300"
        ? "线下交易"
        : info.PaymentTypeName;
    }
  },
  components: { xPay },
  methods: {
    ...mapMutations("cart", {
      setCartGoodList: cartTypes.SET_GOODLIST
    }),
    ...mapMutations("order", {
      // setFlushPageIndex: orderTypes.SET_PAGEINDEX,
      setIsFlush: orderTypes.SET_ISFLUSH, //设置订单列表页面是否需要刷新
      clearOrderAuxiliary: orderTypes.CLEAR_AUXILIARY // //设置订单辅助信息
    }),
    ...mapMutations("store", {
      setSelectedSupplier: storeTypes.SET_SUPPLIER_INFO
      // setSupplierList: storeTypes.SET_SUPPLIER_LIST
    }),
    async getMyPayRecordList(){
      let params= {
        reqtype: 0,
        actortype: 0,
        drawee:this.ENTID,
        numericalorder:this.numericalorder
      };
      this.$post(
        apiMine.paysList,
        params,
        da => {
          this.myPayRecordList = da.total
        }
      )
    },
    async getMyPayRecordState(){
      this.myPayRecordState = await this.$get(apiOrder.enterprise, {
        menuID: "2004091528110000101",
        enterpriseID: this.ENTID,
        groupID: "0"
      });
    },     
    //确认收货
    viewDelivery(item, ind) {
      this.clearOrderAuxiliary(); //清除上一次关联信息
      if (!item.NumericalOrder) return;
      // this.setFlushPageIndex(this.getCurrentPageByIndex(ind));
      this.$router.push({
        name: "orderDelivery",
        params: {
          numericalorder: item.NumericalOrder,
          enterpriseid: item.EnterpriseID
        }
      });
    },
    //再次购买
    async buyAgain(numericalOrder) {
      if (!numericalOrder) return;
      this._showLoading();
      let res = await this.$get(apiOrder.orderInfo, {
        numericalorder: numericalOrder
      });
      let goods = res.item2; //获取到商品信息，但是数据不全面,重新购买先不考虑商品下架问题
      goods = goods.map(f => {
        return {
          ProductID: f.ProductID,
          Quantity: f.Quantity,
          Packages: f.Packages
        };
      });

      /** 产品要求，直接把供应商切换成当前要再次购买的供应商，供应商不存在了就提示阻止 */
      await this.switchSupplier(res.item1.SupplierID);

      let reqGoodListParams = {
        customerid: this.ENTID,
        enterpriseid: res.item1.SupplierID, // this.supplierId
        datadate: this._getDate(),
        pageindex: 0,
        pagesize: goods.length,
        productidlist: goods.map(f => f.ProductID).toString()
      };

      let resl = await this.$get(
        apiPurchase.goodList,
        reqGoodListParams,
        res => {},
        err => {
          this.$toast({
            message: "再次购买,获取商品列表失败",
            duration: 2000
          });
        }
      );
      let list = resl.list || [];
      if (list.length == 0) {
        this._hideLoading();
        this.$dialog.alert({
          message: "未获取到商品信息,可能商品已下架"
        });
        return;
      }
      list.forEach(f => {
        let curGood = goods.find(g => g.ProductID == f.ProductID) || {};
        f.Quantity = curGood.Quantity || 0;
        f.Packages = f.bIsStandardPack ? 0 : curGood.Packages || 0;
      });
      let lastlist = list.filter(f => f.Quantity > 0 || f.Packages > 0);
      let lengLastList = lastlist.length;
      let lengList = list.length;
      let lengGoods = goods.length;

      let strInfo = "";
      if (lengLastList == 0) {
        strInfo = "该订单商品已全部失效，请重新选择";
      } else {
        if (lengList < lengGoods)
          strInfo = `${lengGoods - lengList}种商品已下架${
            lengLastList < lengList ? "," : ""
          }`;
        /** 商品发生过变化,由非标品转变为标品,且只购入Packages */
        if (lengLastList < lengList)
          strInfo += `${lengList - lengLastList}种是否标品发生变化`;
        if (strInfo)
          strInfo = `${lengGoods - lengLastList}种商品已失效（${strInfo}）`; //X种商品已失效（X种已下架，X种是否标品发生变化）
      }
      strInfo &&
        this.$toast({
          message: strInfo,
          duration: 2000
        });

      this.setCartGoodList(lastlist);
      this._hideLoading();
      if (lengLastList > 0)
        this.$router.push({
          path: "/cart/index"
        });
    },
    switchSupplier(supplierId) {
      return new Promise(async (resolve, reject) => {
        let list = await this.$get(apiPurchase.supplierList, {
          enterpriseid: this.ENTID,
          itype: 0
        });
        let curSupplier = list.find(f => f.EnterpriseID == supplierId);
        if (!_.isEmpty(curSupplier)) {
          this.setSelectedSupplier(curSupplier);
          resolve(curSupplier);
        } else {
          this._hideLoading();
          this.$toast("该供应商已与您解除交易关系，请重新选择");
        }
      });
    },
    paylist() {
      this.$router.push(`/mine/paylist/${this.info.item1.NumericalOrder}`);
    },
    //付款
    async placeOrder(item) {
      this.payda.drawee = this.ENTID; //item.EnterpriseID
      this.payda.payee = item.SupplierID;
      this.payda.amount = item.LossAmount;
      this.payda.busiOrderNo = item.NumericalOrder;
      this.payda.pageRetUrl = `${location.origin}${location.pathname}#/order/index`;

      this.toPay = true;
    },
    async getOrderInfo() {
      this._showLoading();
      let res = await this.$get(apiOrder.orderInfo, {
        numericalorder: this.numericalorder
      });
      res.item2 = await this.orderGoods(res.item2, res.item1);
      this.info = res;

      this._hideLoading();
    },
    async orderGoods(goods, orderInfo) {
      let reqGoodListParams = {
        customerid: this.ENTID,
        enterpriseid: orderInfo.SupplierID, // this.supplierId
        datadate: this._getDate(),
        pageindex: 0,
        pagesize: goods.length,
        productidlist: goods.map(f => f.ProductID).toString()
      };

      let resl = await this.$get(
        apiPurchase.goodList,
        reqGoodListParams,
        res => {},
        err => {
          this.$toast({ message: "获取商品列表失败", duration: 2000 });
        }
      );
      let list = resl.list || [];
      if (list.length == 0) {
        this._hideLoading();
        this.$dialog.alert({ message: "未获取到商品信息,可能商品已下架" });
        return;
      } else if (list.length < goods.length) {
        this.$toast({ message: "部分商品已下架", duration: 2000 });
      }
      list.forEach(f => {
        let curGood = goods.find(g => g.ProductID == f.ProductID) || {};
        _.assignIn(f, curGood);
      });
      return list;
    },
    async deleteOrder() {
      this.$dialog
        .confirm({
          message: "确认删除该订单？"
        })
        .then(async () => {
          await this.$get(
            apiOrder.deleteOrder,
            { numericalorder: this.numericalorder },
            res => {},
            err => {
              this.$toast({ message: "删除失败，请稍后再试", duration: 2000 });
            }
          );
          this.setIsFlush(true);
          this.$router.go(-1);
        })
        .catch(e => {});
    }
  }
};
</script>
<style lang="less" scoped>
.operation {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // padding: 0.31rem 0rem 0;
  // height: 1.36rem;
  background: #fff;
  border-top: 1px solid #e9ebef;
  span.btn {
    // padding: 0 0.2rem;
    height: 0.6rem;
    line-height: 0.6rem;
    height: 0.76rem;
    line-height: 0.76rem;
    border-radius: 0.38rem;
    font-size: 0.26rem;
    display: block;
    float: right;
    text-align: center;

    padding: 0 0.35rem;
    margin: 0.2rem 0.3rem 0.2rem 0;
  }
  span.btn_1 {
    border: 1px solid #2f68fc;
    color: #2f68fc;
  }
  span.btn_2 {
    color: #fff;
    background: #2f68fc;
  }
  .dialog {
    width: 0.8rem;
    height: 0.76rem;
    position: relative;
    float: left;
    margin: 0.15rem 0 0 0;
    text-align: center;

    .icon {
      width: 0.08rem;
      height: 0.08rem;
      display: inline-block;
      background: #9c9da1;
      border-radius: 50%;
      margin: 0 0 0 0.1rem;
    }
    ul {
      position: absolute;
      left: 0.7rem;
      bottom: 0.76rem;
      /* padding: 0.1rem 0 0.1rem 0; */
      background: #fff;
      border: 1px solid RGBA(230, 227, 230, 1);
      border-top: none;
      border-radius: 3px;
      overflow: hidden;
      li {
        width: 1.64rem;
        color: rgba(32, 36, 42, 0.9);
        /* padding: 0.1rem 0; */
        line-height: 0.7rem;
        text-align: center;
        border-top: 1px solid RGBA(230, 227, 230, 1);
      }
    }
  }
}
.header {
  line-height: 0.36rem;
  padding: 0.3rem 0.3rem;
  font-size: 0.32rem;
  color: #202328;
  font-weight: 700;
  position: relative;
  background: #fff;
  margin-bottom: 0.2rem;
  img {
    width: 0.38rem;
    height: 0.38rem;
    display: inline-block;
    vertical-align: middle;
  }
  .store {
    position: absolute;
    right: 0.3rem;
    color: #646668;
    font-size: 0.28rem;
    text-align: right;
    font-weight: 300;
  }
}
.user {
  color: #202328;
  font-size: 0.28rem;
  padding: 0.2rem 1rem 0.2rem 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
  position: relative;
  .item {
    line-height: 0.45rem;
    margin-bottom: 0.13rem;
  }
  .co1 {
    color: #7d7e80;
  }
  .user_icon {
    height: 0.42rem;
    width: 0.18rem;
    position: absolute;
    right: 0.3rem;
    top: 50%;
    margin: -0.21rem 0 0 0;
  }
  // .address1 {
  //   padding: 0 0 0 1.5rem;
  //   position: relative;
  //   .co1 {
  //     position: absolute;
  //     left: 0;
  //     top: 0;
  //   }
  // }
}
.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f6f6f6;
}
.order {
  background: #fff;
  padding: 0 0.3rem;
  // margin-bottom: 0.2rem;
  .title {
    border-bottom: 1px solid #e9ebef;
    color: #202328;
    font-size: 0.32rem;
    height: 0.9rem;
    line-height: 0.9rem;
    font-weight: 700;
    position: relative;
    .strain {
      position: absolute;
      right: 0.3rem;
      top: 0.22rem;
      font-size: 0.24rem;
      color: #949596;
      height: 0.5rem;
      line-height: 0.5rem;
      font-weight: 300;
    }
  }
  .order_item {
    border-bottom: 1px solid #e9ebef;
  }
  .order_item:last-child {
    border-bottom: none;
  }
  .items {
    padding: 0.3rem 0rem 0.1rem 0rem;
    position: relative;
    background: #fff;
    .item1 {
      width: 1.2rem;
      height: 1.2rem;
      float: left;
      img {
        height: 100%;
        height: 100%;
        // background: #f00;
      }
    }
    .item2 {
      position: absolute;
      left: 1.4rem;
      top: 0.3rem;
      right: 2.35rem;
    }
    .item3 {
      position: absolute;
      left: 4.7rem;
      top: 0.3rem;
      right: 0rem;
    }
    .p1 {
      color: #202328;
      font-size: 0.28rem;
      line-height: 0.42rem;
    }
    .p2 {
      font-size: 0.24rem;
      color: #949596;
      line-height: 0.4rem;
    }
    .p3 {
      font-size: 0.28rem;
      color: #202328;
      text-align: right;
      line-height: 0.42rem;
    }
    .p4 {
      color: #949596;
      font-size: 0.24rem;
      text-align: right;
      line-height: 0.45rem;
    }
    .p5 {
      color: #949596;
      font-size: 0.24rem;
      text-align: right;
    }
  }
  .footer {
    padding: 0.1rem 0 0.25rem 0;
    text-align: right;
    color: #202328;
  }
  // .footer_inp {
  //   height: 1rem;
  //   line-height: 1rem;
  //   font-size: 0.28rem;
  // }
  // .footer_inp ::-webkit-input-placeholder {
  //   color: #cecece;
  //   font-size: 0.28rem;
  // }
}
.details {
  //margin-bottom: 0.2rem;
  background: #fff;
  padding: 0 0.3rem 0.2rem;
  .title {
    font-size: 0.32rem;
    color: #202328;
    height: 0.9rem;
    line-height: 0.9rem;
    border-bottom: 1px solid #e9ebef;
    font-weight: 700;
    margin-bottom: 0.15rem;
  }
  .item {
    font-size: 0.28rem;
    line-height: 0.6rem;
    height: 0.6rem;
    color: #202328;
  }
  .item_20 {
    float: left;
    width: 20%;
    color: #7d7e80;
  }
  .item_80 {
    float: left;
    width: 80%;
    color: #202328;
    text-align: right;
  }
  .co1 {
    color: #e90000;
  }
}
// .delete_item {
//   position: fixed;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   padding: 0.31rem 0rem 0;
//   height: 1.36rem;
//   background: #fff;
//   border-top: 1px solid #e9ebef;
  
//   .dialog {
//     width: 0.8rem;
//     height: 0.76rem;
//     position: relative;
//     float: left;
//     margin: 0.15rem 0 0 0;
//     text-align: center;

//     .icon {
//       width: 0.08rem;
//       height: 0.08rem;
//       display: inline-block;
//       background: #9c9da1;
//       border-radius: 50%;
//       margin: 0 0 0 0.1rem;
//     }
//     ul {
//       position: absolute;
//       left: 0.7rem;
//       bottom: 0.76rem;
//       /* padding: 0.1rem 0 0.1rem 0; */
//       background: #fff;
//       border: 1px solid RGBA(230, 227, 230, 1);
//       border-top: none;
//       border-radius: 3px;
//       overflow: hidden;
//       li {
//         width: 1.64rem;
//         color: rgba(32, 36, 42, 0.9);
//         /* padding: 0.1rem 0; */
//         line-height: 0.7rem;
//         text-align: center;
//         border-top: 1px solid RGBA(230, 227, 230, 1);
//       }
//     }
//   }
// }
</style>