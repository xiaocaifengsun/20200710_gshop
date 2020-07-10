<template>
  <div>
    <form method="POST" :action="payApi" ref="payForm" v-show="false">
      <template v-for="(oVal,oKey) in payda">
        <input type="text" v-if="oVal" :name="oKey" :value="oVal" :key="oKey" />
      </template>
    </form>
    <template v-if="showParam">
      <div v-for="(oVal,oKey) in payda" :key="oKey" class="div_param">{{`${oKey} : ${oVal}`}}</div>
    </template>
  </div>
</template>
<script>
import * as apiPays from "@/api/pay";
import * as apiCommons from "@/api/common";
export default {
  name: "x-pay",
  props: {
    payData: {
      required: true,
      type: Object
    },
    toPay: {
      type: Boolean,
      default: false
    },
    nxAppid: {
      default: "22"
    },
    showParam: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      payda: {
        times: "",
        signmsg: "",
        drawee: "", //付款人ID，买家
        payee: "", //收款人ID，卖家或平台方ID
        busiNo: "NX-I-024", //业务来源
        busiType: "22",
        amount: "",
        busiOrderNo: "", //业务订单号
        orderNo: "", //业务支付订单号
        backRetUrl: "",
        pageRetUrl: "",
        iscomm: "",
        sellerId: "",
        shareData: "", //分账公式 //分账公式
        operator: "", //操作人，非企业订单时付款人与操作相同
        openId: ""
      }
    };
  },
  created() {
    this.initParams(this.payData);
  },
  watch: {
    payData: {
      deep: true,
      handler(val) {
        this.initParams(val);
      }
    },
    toPay(val) {
      val && this.postFn();
    }
  },
  mounted() {},
  computed: {
    payApi() {
      return `https://jr${this._domainPrefix}.nxin.com/cashier/app/initCashier.shtml`;
    }
  },
  methods: {
    initParams(payData) {
      if (!payData.iscomm) this.payda.iscomm = this.IS_PERSON ? "2" : "1";
      this.payda = _.assign(this.payda, payData);
      !this.payda.openId && this.getOpenId();
      !this.payda.operator && this.getOperator();
      if (!this.payda.backRetUrl) {
        if (this._demoPrefix) {
          this.payda.backRetUrl = `https://demoqdqlw.nxin.com/api/PayHandleApi/Handler`;
        } else {
          this.payda.backRetUrl = `https://qdqlw${this._domainPrefix}.nxin.com/api/PayHandleApi/Handler`;
        }
      }
      if (!payData.sellerId) this.payda.sellerId = this.payda.payee;
    },
    genShareData(merchantType) {
      var payda = this.payda;
      var da = [
        {
          busiDetailNo: payda.orderNo,
          channelFeeType: 2, //渠道费用承担方式[1：平台承担；2：商家承担]
          data: [
            {
              amount: payda.amount,
              expenseType: "GOODS",
              merchantId: payda.payee,
              merchantType: merchantType || "1" //收款人类型[1：对公/企业；2：对私/个人]
            }
          ]
        }
      ];
      return JSON.stringify(da);
    },
    async combineParams() {
      this.payda.signmsg = "";
      this.payda.times = this._getDateTime("yyyyMMddhhmm");
      if (_.isEmpty(this.payda.busiOrderNo)) {
        this.$toast("单号无效");
        return false;
      }
      if (!this.payData.orderNo) {
        this.payda.orderNo = await this.$get(
          apiPays.getOrderNo,
          res => {},
          err => {
            this.$toast("获取支付单号失败");
          }
        );
      }
      this.payda.shareData = this.genShareData(1);
      this.payda.signmsg = await this.getStrSign();
      return true;
    },
    async postFn() {
      this._showLoading();
      this.changeToPaySta();
      let checkOk = await this.combineParams();
      if (checkOk) {
        this.$emit("pre-pay", this.payda);
        this.$refs.payForm.submit();
      }
      this._hideLoading();
    },
    changeToPaySta() {
      this.$emit("update:to-pay", false);
    },
    async getStrSign() {
      return await this.$postJson(apiPays.getSign, this.payda);
    },
    async getOpenId() {
      if (this._isWechatEnv()) {
        let openId = await this.$post(apiCommons.getOpenId, {
          appid: this.nxAppid
        });
        this.payda.openId = openId;
      }
    },
    async getOperator() {
      let res = await this.$get(apiCommons.getUserInfo);
      this.payda.operator = res.idStr;
      // this.payda.drawee=res.idStr;
    }
  }
};
</script>
<style lang="less" scoped>
.div_param {
  margin-left: 0.1rem;
  margin-top: 0.1rem;
}
</style>