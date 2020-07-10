<template>
  <div class="main">
    <div class="wrapper">
      <div class="storename">
        <span class="icon_p icon_p1" v-if="!IS_PERSON">企业</span>
        <span class="icon_p icon_p2" v-if="IS_PERSON">个人</span>
        <b v-if="!IS_PERSON">{{storeInfo.ShortName}}</b>
        <b v-if="IS_PERSON">{{userInfo.realName}}</b>
        <span v-if="showSwitch" @click="switchEnt" class="check_box">切换身份</span>
      </div>
    </div>
    <!-- state:0,   // 单位是0 个人是1
    -->
    <van-cell
      style="margin-top: 10px;"
      title="我的对账单"
      is-link
      to="/mine/mystatement/index"
      v-if="IS_PERSON"
    />
    <van-cell
      style="margin-top: 10px;"
      title="我的对账单"
      is-link
      to="/mine/mystatement/index"
      v-if="!IS_PERSON && (mystatementState & 1)==1"
    />

    <!--
    <van-cell-group title="支付管理">
      <van-cell title="余额" is-link :url="yuEUrl" v-if="IS_PERSON" />
      <van-cell title="余额" is-link :url="yuEUrl" v-if="!IS_PERSON && (myBalanceState & 1)==1" />
      <van-cell title="付款记录" is-link to="/mine/paylist" v-if="IS_PERSON" />
      <van-cell title="付款记录" is-link to="/mine/paylist" v-if="!IS_PERSON && (myPayRecordState & 1)==1" />
    </van-cell-group>
-->

    <van-cell-group title="支付管理" v-if="IS_PERSON" >
      <van-cell title="余额" is-link :url="yuEUrl" />
      <van-cell title="付款记录" is-link to="/mine/paylist" />
    </van-cell-group>
    <template v-if="!IS_PERSON">
      <van-cell-group title="支付管理" v-if="((myBalanceState & 1)==1) || ((myPayRecordState & 1)==1)">
        <van-cell title="余额" is-link :url="yuEUrl" v-if="(myBalanceState & 1)==1" />
        <van-cell title="付款记录" is-link to="/mine/paylist" v-if="(myPayRecordState & 1)==1" />
      </van-cell-group>
    </template>






    <van-cell-group title="订货设置">
      <van-cell title="收货地址管理" is-link to="/mine/address/index" />
    </van-cell-group>
    <div class="btn_exit_c" @click="logout" v-if="showLogout">退出登录</div>
  </div>
</template>
<script>
import Vue from "vue";
import { Cell, CellGroup } from "vant";
Vue.use(Cell).use(CellGroup);

import { mapGetters } from "vuex";
import * as storeTypes from "@/store/store/types";
import * as rootTypes from "@/store/root/types";
import * as apiMine from "@/api/mine";
import * as apiOrder from "@/api/order";
import * as commonOrder from "@/api/common";

export default {
  data() {
    return {
      showSwitch: false, //是否显示切换采购单位
      showLogout: false,
      mystatementState: "",    // 我的对账单权限判断
      myBalanceState: "",   //余额权限 判断
      myPayRecordState:""       //Record 付款记录权限判断
    };
  },
  computed: {
    ...mapGetters("store", {
      storeInfo: storeTypes.ENT_INFO
    }),
    ...mapGetters({
      userInfo: rootTypes.USERINFO
    }),
    yuEUrl() {
      return `https://mjr${this._domainPrefix}.nxin.com/balance.html`;
    }
  },
  async created() {
    await this.GET_ENTID();
    if (!this._isZntEnv()) {
      this.showLogout = true;
      await this.getEntList();
    }  
    this.getMyStatement();  // 我的对账单权限判断
    this.getMyBalance();   //余额权限 判断
    this.getMyPayRecordState();//Record 付款记录权限判断
  },
  mounted() {},
  methods: {
    async getMyPayRecordState(){
      this.myPayRecordState = await this.$get(apiOrder.enterprise, {
        menuID: "2004091528110000101",
        enterpriseID: this.ENTID,
        groupID: "0"
      });
    },
    async getMyBalance() {
      this.myBalanceState = await this.$get(apiOrder.enterprise, {
        menuID: "1803081440450000101",
        enterpriseID: this.ENTID,
        groupID: "0"
      });
    },
    async getMyStatement() {
      this.mystatementState = await this.$get(apiOrder.enterprise, {
        menuID: "2003311403020000101",
        enterpriseID: this.ENTID,
        groupID: "0"
      });
    },
    switchEnt() {
      this.$router.push({ path: "/mine/enterpriselist", query: { back: 1 } });
    },
    async getEntList() {
      let list = await this.$get(apiMine.enterpriseList, { source: 16 });
      this.showSwitch = list.length > 1;
    },
    async logout() {
      this.$dialog
        .confirm({ message: "确认退出登录？" })
        .then(() => {
          let curUrl = window.location.href;
          let page = window.location.hash;
          if (page) curUrl = curUrl.substring(0, curUrl.length - page.length);
          this.TO_LOGOUT(curUrl);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.icon_p {
  font-weight: 300;
  font-size: 0.2rem;
  display: inline-block;
  padding: 0 0.1rem;
  height: 0.36rem;
  line-height: 0.34rem;
  border-radius: 0.18rem;

  right: -0.7rem;
  top: -0.1rem;
  margin-right: 0.1rem;
    vertical-align: middle;

}
.icon_p1 {
  border: 1px solid #2f68fc;
  color: #2f68fc;
}
.icon_p2 {
  border: 1px solid #2f68fc;
  color: #2f68fc;
}
.storename {
  b{
    height: 0.36rem;
    display: inline-block;
    line-height: 0.36rem;
    vertical-align: middle;
  }
}
.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f6f6f6;
}
.wrapper {
  height: 1rem;
  line-height: 1rem;
  font-size: 0.32rem;
  background: #fff;

  padding: 0 0.3rem;
  .switch {
    border: 1px solid #2c7afe;
    font-size: 0.24rem;
    padding: 0 0.2rem;
    height: 0.4rem;
    line-height: 0.36rem;
    border-radius: 0.18rem;
    display: inline-block;
    position: absolute;
    right: 0.3rem;
    top: 0.32rem;
  }
}
.van-cell-group__title {
  height: 1rem;
  line-height: 1rem;
  color: #a2a3a4;
  font-size: 0.28rem;
  padding: 0 0.3rem;
}
.van-cell--clickable {
  height: 1rem;
  line-height: 1rem;
  font-size: 0.32rem;
  background: #fff;

  padding: 0 0.3rem;
}
.van-cell__right-icon {
  margin-left: 5px;
  color: #969799;
  margin: 0.27rem 0rem 0 0;
  font-size: 0.4rem;
}
.storename {
  position: relative;
}
.check_box {
  font-size: 0.26rem;
  position: absolute;
  border: 1px solid #2f68fc;
  height: 0.45rem;
  line-height: 0.4rem;
  border-radius: 0.23rem;
  padding: 0 0.18rem;
  top: 0.26rem;
  right: 0;
  color: #3067fc;
}
.btn_exit {
  margin-top: 20px;
}
.btn_exit_c {
  height: 0.9rem;
  text-align: center;
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
  line-height: 0.9rem;
  background: #fff;
  font-size: 0.32rem;
  margin-top: 0.24rem;
}
</style>