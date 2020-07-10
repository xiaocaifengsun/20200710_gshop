<template>
  <div class="main x-address_c">
    <van-address-list
      v-model="chosenAddressId"
      @select="selAddress"
      :list="addresslist"
      @add="onAdd"
      @edit="onEdit"
      class="customer_address"
    >
      <no-list tip="暂无收货地址" :show="addresslist.length==0" />
    </van-address-list>
  </div>
</template>
<script>
import * as apiMine from "@/api/mine";
import Vue from "vue";
import { AddressList } from "vant";
Vue.use(AddressList);
import * as types from "@/store/address/types";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      chosenAddressId: "",
      list: []
    };
  },
  computed: {
    addresslist() {
      return this.list.map(item => {
        return {
          id: item.deliveryId,
          name: item.name,
          tel: item.tel,
          address: `${item.areaFullName} ${item.addr}`
        };
      });
    }
  },
  mounted() {},
  activated() {
    this.getAddressList();
  },
  methods: {
    ...mapMutations("address", {
      setSelectedAddr: types.SET_SELECTED_ADDR
    }),
    onAdd() {
      this.$router.push({ path: "/mine/address/add" });
    },
    onEdit(item) {
      let curItem = this.list.find(f => f.deliveryId == item.id);
      this.$router.push({ name: "updateAddress", params: { info: curItem } });
    },
    async getAddressList() {
      let list = await this.$post(apiMine.addresslist, {
        type: 1
      });
      this.list = list;
    },
    selAddress(item) {
      let curItem = this.list.find(f => f.deliveryId == item.id);
      let shouldJmp = this.$route.query.back;
      if (shouldJmp) {
        this.setSelectedAddr(curItem);
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.van-button--danger {
  background: #2c7afe;
  border: 1px solid #2c7afe;
  line-height: 1rem;
  height: 1.02rem;
  font-size: 0.32rem;
}
</style>
<style lang="less" >
.customer_address {
  padding-bottom: 1rem;
  .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #1989fa !important;
    border-color: #1989fa !important;
  }
}
</style>
<style lang="less" scoped>
.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f6f6f6;
}
</style>
<style lang="less">
.x-address_c {
  .van-address-item {
    padding: 0.3rem;
  }
  .van-address-item__name {
    font-size: 0.28rem;
  }
  .van-address-item__address {
    font-size: 0.28rem;
    line-height: 0.4rem;
  }
  .van-radio__icon .van-icon {
    width: 0.3rem;
    height: 0.3rem;
  }
  .van-icon-success {
    width: 0.3rem;
    height: 0.3rem;
    vertical-align: -0.1rem;
    font-size: 0.24rem;
    line-height: 0.3rem;
    margin: -0.1rem 0.1rem 0 0;
  }
  .van-address-item__edit {
    font-size: 0.36rem;
    margin-right: 0.26rem;
  }
  .x-address_c .van-address-item__name {
    line-height: 0.36rem;
  }
}
</style>