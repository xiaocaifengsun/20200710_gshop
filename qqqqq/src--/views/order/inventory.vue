<template>
  <div class="main">
    <ul class="items" v-if="list.length>0">
      <li class="item" v-for="item in list" :key="item.UserEnteID2" @click="switchEnt(item)">
        {{item.WarehouseName}}
        <van-icon name="success" v-if="ENTID==item.UserEnteID2" />
      </li>
    </ul>
    <no-list :show="noList" tip="暂无仓库" />
  </div>
</template>
<script>
import Vue from "vue";
import { Icon } from "vant";
Vue.use(Icon);
import { mapGetters, mapMutations } from "vuex";
import * as types from "@/store/root/types";
import * as apiOrder from "@/api/order";
import * as orderTypes from "@/store/order/types";
export default {
  data() {
    return {
      list: [],
      noList: false //防止一上来就显示暂无仓库
    };
  },
  created() {
    this.getEntList();
  },
  methods: {
    ...mapMutations("order", {
      setOrderAuxiliary: orderTypes.SET_AUXILIARY_WAREHOUSE //设置订单辅助信息
    }),
    async switchEnt(item) {
      this.setOrderAuxiliary(item);
      this.$router.go(-1);
    },
    async getEntList() {
      let list = await this.$get(
        apiOrder.getWarehouseList,
        {
          enterid: this.ENTID
        },
        res => {
          this.noList = (res || []).length == 0;
        },
        err => {
          let errTip = err.isAxiosError
            ? "网络异常，请稍后再试"
            : err.msg || err.message || err.error;
          this.$toast(errTip);
          this.noList = true;
        }
      );
      this.list = list;
    }
  }
};
</script>
<style lang="less" scoped>
.items {
  padding: 0 0 0 0.3rem;
  .item {
    border-bottom: 1px solid #e9ebef;
    line-height: 0.59rem;
    padding: 0.2rem 0 0.2rem 0;
    position: relative;
  }
  .van-icon {
    top: 0.32rem;
    right: 0.3rem;
    position: absolute;
    color: #2c7afe;
    font-size: 0.4rem;
  }
}
</style>