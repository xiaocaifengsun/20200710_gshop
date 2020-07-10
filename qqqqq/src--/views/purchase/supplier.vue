<template>
  <div class="main">
    <ul class="items">
      <li class="item" v-for="item in list" :key="item.EnterpriseID" @click="selSupplier(item)">
        {{item.EnterpriseName}}
        <van-icon name="success" v-if="supplierId==item.EnterpriseID" />
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from "vue";
import { Icon } from "vant";
Vue.use(Icon);
import * as storeTypes from "@/store/store/types";
import * as apis from "@/api/purchase";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("store", {
      list: storeTypes.SUPPLIER_LIST,
      supplierId: storeTypes.SUPPLIER_ID
    })
  },
  created() {
    this.getSupplierList();
  },
  methods: {
    ...mapMutations("store", {
      setSelectedSupplier: storeTypes.SET_SUPPLIER_INFO,
      setSupplierList: storeTypes.SET_SUPPLIER_LIST
    }),
    selSupplier(item) {
      this.setSelectedSupplier(item);
      let shouldJmp = this.$route.query.back;
      if (shouldJmp) {
        this.$router.go(-1);
      }
    },
    async getSupplierList() {
      let list = await this.$get(
        apis.supplierList,
        {
          enterpriseid: this.ENTID,
          itype:0,
        },
        res => {},
        err => {
          this.$toast(err.msg || err.message || err.error);
          this.$router.go(-1);
        }
      );
      this.setSupplierList(list);
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