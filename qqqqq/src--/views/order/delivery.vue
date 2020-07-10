<template>
  <div class="main">
    <div class="auxiliary" v-if="isOpenGeneratePurchase">
      <div class="select_item" @click="href_supplier_fun()">
        <div class="select_item_t">供应商</div>
        <div class="select_item_m">
          {{auxiliarySupplier.CustomerName}}
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="select_item" v-show="msginfo.isshowmsg">
        <div class="select_item_t1 ellipsis">{{msginfo.msg}}</div>
        <div
          style="color:#2c7afe; font-size:0.24rem;"
          class="select_item_m"
          @click="href_funaction(0)"
        >立即创建</div>
      </div>
    </div>
    <div class="auxiliary" v-if="isOpenGeneratePurchase">
      <div class="select_item" @click="href_inventory_fun()">
        <div class="select_item_t">入库仓库</div>
        <div class="select_item_m">
          {{auxiliaryWarehouse.WarehouseName}}
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="select_item" v-show="msginfo.warehouseIsShowmsg">
        <div class="select_item_t1">{{msginfo.warehouseMsg}}{{msginfo.WarehouseName||""}}</div>
        <div
          style="color:#2c7afe;font-size:0.24rem;"
          class="select_item_m"
          @click="href_funaction(1)"
        >直接使用</div>
      </div>
    </div>
    <div class="order">
      <div class="title">
        商品
        <span class="strain">品种 {{info.item2.length}}</span>
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
            <p class="p3">￥{{item.BDJ}} / {{item.StandardMeasureUnit}}</p>
            <p class="p4" v-if="item.ReportingUnit==1 || (isDelivered && item.ActualPackages > 0)">
              x {{item.Packages}} 件
              <span v-if="isDelivered">(实送 {{item.ActualPackages}})</span>
            </p>
            <p class="p5" v-if="item.ReportingUnit!=1 || (isDelivered && item.ActualQuantity > 0)">
              x {{item.Quantity}} {{item.StandardMeasureUnit}}
              <span
                v-if="isDelivered"
              >(实送 {{item.ActualQuantity}})</span>
            </p>
          </div>
        </div>
        <div class="footer" v-if="isDelivered">￥ {{item.ActualAmountTotal|money}}</div>
        <div class="footer" v-else>￥ {{item.AmountTotal|money}}</div>
        <div class="select_item" @click="href_goods_fun(item)" v-if="isOpenGeneratePurchase">
          <div class="select_item_t">关联门店商品</div>
          <div class="select_item_m2 ellipsis">
            {{(auxiliaryGoods[item.ProductID]||{}).ProductName}}
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <!-- <div class="footer_inp">
        备注:
        <input type="text" maxlength="100" placeholder="请输入订单备注" />
      </div>-->
    </div>
    <div style="height:1rem;"></div>
    <div class="footer_btn">
      <span class="text">
        合计
        <span class="p1">￥</span>
      </span>
      <span class="money" v-if="isDelivered">{{info.item1.ActualPayment|money}}</span>
      <span class="money" v-else>{{info.item1.AmountTotal|money}}</span>

      <div class="btn" v-if="!isDelivery && !hasError" @click="confirmDelivery">完成收货</div>
      <div class="btn btn_err" v-if="hasError">{{errorMsg}}</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Icon } from "vant";
Vue.use(Icon);

import { mapGetters, mapMutations } from "vuex";
import * as storeTypes from "@/store/store/types";
import * as apiOrder from "@/api/order";
import * as apiPurchase from "@/api/purchase";
import * as orderTypes from "@/store/order/types";
export default {
  data() {
    return {
      msginfo: {
        isshowmsg: false, //是否显示立即创建
        msg: "未检测到关联供应商，是否根据商家信息直接创建?",
        warehouseMsg: "当前供应商最近入库仓库为：",
        warehouseIsShowmsg: true,
        WarehouseID: null,
        WarehouseName: null
      },
      info: {
        item1: {},
        item2: []
      },
      supplierEnterpriseinfo: {
        phone: 0,
        enterpriseid: null,
        enterprisename: null
      },
      numericalorder: null,

      hasError: false,
      errorMsg: "订单异常",
      isDelivery: false, //已收货
      isOpenGeneratePurchase: false //是否开启生成采购入库单选项
    };
  },
  computed: {
    ...mapGetters("order", {
      auxiliarySupplier: orderTypes.AUXILIARY_SUPPLIER, //获取订单辅助信息-供应商
      auxiliaryWarehouse: orderTypes.AUXILIARY_WAREHOUSE, //获取订单辅助信息-入库仓库
      auxiliaryGoods: orderTypes.AUXILIARY_GOODS //获取 订单辅助-关联商品
    }),
    //订单上的供应商Id
    OrderSupplierID() {
      return this.info.item1.SupplierID;
    },
    /** 配送端已确认送达 */
    isDelivered() {
      return this.info.item1.CheckState == 1;
    }
  },
  watch: {
    auxiliarySupplier(item) {
      if (item.CustomerID) {
        this.supplierEnterpriseinfo.enterpriseid = item.CustomerID;
        this.getnewwarehousename();
        this.msginfo.warehouseIsShowmsg = true;
      } else {
        this.setOWarehouseAuxiliary({
          WarehouseID: null,
          WarehouseName: null
        });
      }
    }
  },
  async created() {},
  async activated() {
    var numericalorderChange =
      this.numericalorder != this.$route.params.numericalorder;
    this.numericalorder = this.$route.params.numericalorder;
    this.supplierEnterpriseinfo.enterpriseid = this.$route.params.enterpriseid;

    if (this.$route.meta.shouldFlushData || numericalorderChange) {
      await this.checkIsOpenGeneratePurchase(this.ENTID);
      this.getOrderInfo();
      this.getsupplierList();
    }
  },
  beforeRouteEnter(to, from, next) {
    let notFlushArrPage = [
      "/order/goods",
      "/order/supplier",
      "/order/inventory"
    ]; //不需要刷新的来源页面
    let path = from.path;
    var shouldFlush = (to.meta.shouldFlushData = !notFlushArrPage.some(item => {
      return path.startsWith(item);
    }));
    next(vm => {
      if (shouldFlush) {
        vm.info.item1 = {};
        vm.info.item2 = [];
        vm.hasError = false;
        vm.isDelivery = false;
        vm.isOpenGeneratePurchase = false;
      }
    });
  },
  methods: {
    ...mapMutations("order", {
      setIsFlush: orderTypes.SET_ISFLUSH, //设置订单列表页面是否需要刷新
      clearOrderAuxiliary: orderTypes.CLEAR_AUXILIARY, // //清空订单辅助信息
      setAuxiliaryGoods: orderTypes.SET_AUXILIARY_GOODS, //设置订单辅助商品信息
      setOrderAuxiliary: orderTypes.SET_AUXILIARY_SUPPLIER, //更新供应商数据
      setOWarehouseAuxiliary: orderTypes.SET_AUXILIARY_WAREHOUSE //更新仓库数据
    }),
    //跳转供应商ang
    href_supplier_fun() {
      this.$router.push(`/order/supplier`);
    },
    //库存管理页面
    href_inventory_fun() {
      this.$router.push(`/order/inventory`);
    },
    //商品选择页面
    href_goods_fun(item) {
      let productId = item.ProductID;
      if (!productId) return;
      this.$router.push(`/order/goods/${productId}`);
    },
    async getOrderInfo() {
      this._showLoading();
      let res = await this.$get(
        apiOrder.orderInfo,
        { numericalorder: this.numericalorder },
        re => {},
        err => {
          this.hasError = true;
          this.$toast(err.msg || err.message || err.error);
        }
      );
      res.item2 = await this.orderGoods(res.item2, res.item1);
      await this.restoreClassification(res.item1, res.item2);
      this.info = res;
      this._hideLoading();
    },
    //查找卖家和买家得关联得供应商
    async getsupplierList() {
      this._showLoading();
      let res = await this._post(
        apiOrder.getsupplierState,
        {
          targetid: this.supplierEnterpriseinfo.enterpriseid, //供应商单位ID
          enterpriseid: this.ENTID, //当前单位ID
          custtype: 1 //0客户，1供应商
        },
        re => {},
        err => {
          this.hasError = true;
          this.$toast(err.msg || err.message || err.error);
        }
      );
      if (res.data && (res.data || []).length > 0) {
        this.setOrderAuxiliary(
          res.data.find(f => {
            return f.CustomerID, f.CustomerName;
          })
        );
        this.msginfo.warehouseIsShowmsg = true;
        this.msginfo.isshowmsg = false;
      } else {
        if (this.supplierEnterpriseinfo.enterpriseid)
          this.getenterpriserinfolist();
        this.msginfo.isshowmsg = true;
        this.msginfo.warehouseIsShowmsg = false;
        //清除仓库数据
        this.setOWarehouseAuxiliary({
          WarehouseID: null,
          WarehouseName: null
        });
      }
      this._hideLoading();
    },
    async getenterpriserinfolist() {
      this._showLoading();
      let res = await this.$get(
        apiOrder.getenterpriserinfolistapi,
        { enterpriseids: this.supplierEnterpriseinfo.enterpriseid },
        re => {},
        err => {
          this.hasError = true;
          this.$toast(err.msg || err.message || err.error);
        }
      );
      if (res.length > 0) {
        let data = res.find(x => {
          return x;
        });

        this.supplierEnterpriseinfo.phone = data.creatorPhone;
        this.supplierEnterpriseinfo.enterprisename = data.shortName;
      }
      this._hideLoading();
    },
    //获取最新仓库
    async getnewwarehousename() {
      this._showLoading();
      let res = await this.$get(
        apiOrder.getnewwarehouseapi,
        {
          enterpriseid: this.ENTID,
          supplierid: this.supplierEnterpriseinfo.enterpriseid
        },
        data => {},
        err => {
          this.hasError = true;
          this.$toast(err.msg || err.message || err.error);
        }
      );
      if (res) {
        (this.msginfo.WarehouseID = res.WarehouseID),
          (this.msginfo.WarehouseName = res.WarehouseName);
      } else this.msginfo.warehouseIsShowmsg = false;
      this._hideLoading();
    },
    // 立即创建
    async CreateImmediately() {
      await this.$get(
        apiOrder.addcustomerapi,
        {
          OrgID: this.supplierEnterpriseinfo.enterpriseid,
          OrgName: this.supplierEnterpriseinfo.enterprisename,
          Phone: this.supplierEnterpriseinfo.phone,
          EnterpriseID: this.ENTID,
          Type: 2
        },
        re => {},
        err => {
          this.hasError = true;
          this.$toast(err.msg || err.message || err.error);
        }
      );
      this.getsupplierList();
    },
    href_funaction(item) {
      this._showLoading();
      switch (item) {
        case 0: //立即创建  供应商
          this.CreateImmediately();
          break;
        case 1: //直接使用 仓库
          if (this.supplierEnterpriseinfo.enterpriseid)
            this.getnewwarehousename();
          this.setOWarehouseAuxiliary({
            WarehouseID: this.msginfo.WarehouseID,
            WarehouseName: this.msginfo.WarehouseName
          });
          this.msginfo.warehouseIsShowmsg = false;
          break;
      }
      this._hideLoading();
    },
    async confirmDelivery() {
      if (this.hasError) return;
      this._showLoading();

      let entId = this.ENTID;
      let info = this.info;

      await this.checkEnableOption();
      let oldOpenState = this.isOpenGeneratePurchase;
      let isOpen = await this.checkIsOpenGeneratePurchase(entId); //二次校验，防止isOpenGeneratePurchase长时间未操作过期
      if (oldOpenState != isOpen) {
        this._hideLoading();
        await this.$dialog
          .alert({
            message: "收货业务设置发生变化，请点击确定按钮，后重试"
          })
          .then(() => {
            this.clearOrderAuxiliary();
          });
        return;
      }
      if (isOpen) await this.checkPurchaseParama(info);

      await this.$post(apiOrder.deliveryOrder, {
        numericalorder: this.numericalorder
      });
      this.isDelivery = true;
      this.setIsFlush(true);
      if (isOpen) {
        await this.generatePurchaseOrder(entId, info);
        await this.commitProductUnionRelation();
      }
      this._hideLoading();
      this.$router.go(-1);
    },
    /** 判断当前供应商的系统选项(企联网企业端设置)是否开启了配货环节 */
    checkEnableOption() {
      return new Promise(async (resolve, reject) => {
        let res = await this.$get(apiOrder.systemOption, {
          enterpriseid: this.OrderSupplierID,
          optionid: "20191008162659"
        });
        if (res.OptionValue == 1) {
          let resQ = await this.checkQuantity(this.numericalorder);
          if (resQ.CheckState == 1) {
            resolve();
          } else {
            this._hideLoading();
            this.$toast({
              message: "送货员未核对数量，请核对后再进行操作",
              duration: 2000
            });
          }
        } else {
          resolve();
        }
      });
    },
    /** 如果开启了配送环节，则判断送货员是否已完成送货核对数量，如果未输入核对数量，则不允许完成收货 */
    async checkQuantity() {
      return await this.$get(apiOrder.checkQuantity, {
        numericalorder: this.numericalorder
      });
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
      if (orderInfo.CheckState == 1 && list.length > 1) {
        //排序将未实送的商品放到最后，需求编号：84334
        let listPars = _.partition(
          list,
          item => item.ActualQuantity || item.ActualPackages
        );
        list = _.concat(listPars[0], listPars[1]);
      }
      return list;
    },
    /* 生成采购入库必传参数校验 */
    checkPurchaseParama(info) {
      return new Promise((resolve, reject) => {
        if (_.isEmpty(this.auxiliarySupplier)) {
          this.$toast("请选择供应商");
          this._hideLoading();
          return;
        }
        if (_.isEmpty(this.auxiliaryWarehouse)) {
          this.$toast("请选择入库仓库");
          this._hideLoading();
          return;
        }
        if (
          _.isEmpty(this.auxiliaryGoods) ||
          _.size(this.auxiliaryGoods) != info.item2.length
        ) {
          this.$toast("请选择关联商品");
          this._hideLoading();
          return;
        } else {
          info.item2.forEach(f => {
            let unionP = this.auxiliaryGoods[f.ProductID];
            if (!unionP) {
              this.$toast(`请为[${f.ProductName}]关联门店商品`);
              this._hideLoading();
              return;
            }
          });
        }
        resolve();
      });
    },
    buildPurchasePostData(entId, info) {
      let res = {
        item1: {
          OrderNumericalOrder: this.numericalorder,
          SourceID: 1,
          EnterpriseID: entId,
          DataDate: this._getDate(),
          SupplierID: this.auxiliarySupplier.CustomerID, //内部供应商档案ID
          PurchaserID: 0,
          PurchaseType: "201610140104402102",
          PurchaseAbstract: "201610140104402102",
          OwnerID: "1265174", //上演示需要修改,暂时先固定
          WarehouseID: this.auxiliaryWarehouse.WarehouseID, // "1805251635150000101", //上演示需要修改
          Remarks: "订货宝自动生成",
          TicketedPointID: "1805181012280000130" //固定值
        },
        item2: []
      };
      res.item2 = info.item2.map(m => {
        let unionP = this.auxiliaryGoods[m.ProductID];
        return {
          ProductID: unionP.ProductID,
          ProductName: unionP.ProductName,
          MeasureUnit: unionP.UnitName, //计量单位
          TaxRate: unionP.TaxRate, //税率
          Quantity: m.ActualQuantity || 0, //数量
          UnitPriceTax: m.UnitPriceTax, //含税单位
          Amount: m.ActualAmountTotal || 0, //金额
          UnitDiscount: 0, //单位折扣
          AmountAdjust: 0, //调整金额
          AmountTotal: m.ActualAmountTotal || 0, //结算金额
          Packages: m.ActualPackages || 0,
          AdjustQuantity: 0, //调整数量
          SettlementQuantity: m.ActualQuantity || 0 //结算数量
        };
      });
      let ret = {
        item1: JSON.stringify(res.item1),
        item2: JSON.stringify(res.item2)
      };
      return ret;
    },
    /** 是否开启生成采购入库单位选项 */
    async checkIsOpenGeneratePurchase(entId) {
      let res = await this.$get(apiOrder.systemOption, {
        enterpriseid: entId,
        optionid: "20191010164633"
      });
      let isopen = res.OptionValue == 1;
      this.isOpenGeneratePurchase = isopen;
      return isopen;
    },
    async generatePurchaseOrder(entId, info) {
      let pdata = this.buildPurchasePostData(entId, info);
      await this.$post(
        apiOrder.createPurchaseOrder,
        pdata,
        resd => {},
        err => {
          this.$toast("自动生成采购单失败");
          this.$router.go(-1);
        }
      );
    },
    /** 提交供应商和采购方的商品关联信息 */
    commitProductUnionRelation() {
      var info = this.info.item1;
      // var goods = this.info.item2;
      var entId = this.ENTID;
      var supplierID = info.SupplierID;
      let unionGoods = this.auxiliaryGoods;
      var self = this;
      var goods = [];
      for (var key in unionGoods) {
        var cur = unionGoods[key];
        goods.push({
          ProductID: cur.ProductID,
          PID: key
        });
      }
      var postda = {
        productinfo: goods,
        enterpriseid: entId
      };
      return new Promise(resolve => {
        self.$postJson(
          apiOrder.updateUnionGoods,
          postda,
          res => {
            resolve();
          },
          err => {
            resolve();
          }
        );
      });
    },
    /** 查找关联商品信息 */
    restoreClassification(item1, goods) {
      var self = this;
      var goodIds = goods.map(f => f.ProductID).join(",");
      return new Promise(reslove => {
        self.$postJson(
          apiOrder.getUnionGoods,
          {
            mdId: goodIds, //md_id
            useComId: item1.SupplierID, //use_com_id
            beUseComId: self.ENTID //be_use_com_id
          },
          res => {
            let list = (res || []).map(m => {
              return {
                Key: m.SupplierProductID,
                Val: m
              };
            });
            list.length > 0 && this.setAuxiliaryGoods(list);
            reslove();
          },
          err => {
            reslove();
          }
        );
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./styles/delivery.less");
</style>