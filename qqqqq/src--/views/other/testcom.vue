<template>
  <div>
    <div class="item">
      <span>示例1：</span>
      <div class="wrapper" @click="clickFn">点我修改：{{fullAddress}}</div>
      <x-area
        v-model="countryId"
        :show.sync="showPicker"
        @change="changeAreaFn"
        @init-address="initAddress"
      ></x-area>
    </div>
    <div class="item">
      <span>示例2：</span>
      <van-dropdown-menu>
        <van-dropdown-item ref="ref_city" :title="title">
          <x-area-picker
            v-model="countryId"
            toolbar-position="bottom"
            @change="changeFn"
            @cancel="cancelFn"
            @init-address="initAddress"
          ></x-area-picker>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <div class="item">
      <span>示例3：</span>
      <x-address v-model="countryId"></x-address>
    </div>
  </div>
</template>
<script>
import xAreaPicker from "@/components/x-area-picker";
import xArea from "@/components/x-area";
import xAddress from "@/components/x-address";
import { DropdownMenu, DropdownItem } from "vant";
import Vue from "vue";
Vue.use(DropdownMenu).use(DropdownItem);
export default {
  data() {
    return {
      countryId: "7",
      fullAddress: "",

      showPicker: false
    };
  },
  computed: {
    title() {
      return this.countryId ? this.fullAddress : "请选择";
    }
  },
  components: { xAreaPicker, xArea, xAddress },
  methods: {
    clickFn() {
      this.showPicker = !this.showPicker;
    },
    changeFn(provinceId, cityId, countryId, fullAddress) {
      this.countryId = countryId;
      this.fullAddress = fullAddress;
      this.$refs.ref_city.toggle();
    },
    cancelFn() {
      this.countryId = "";
      this.fullAddress = "";
      this.$refs.ref_city.toggle();
    },
    initAddress(fullAddress) {
      this.fullAddress = fullAddress;
    },
    changeAreaFn(provinceId, cityId, countryId, fullAddress) {
      this.countryId = countryId;
      this.fullAddress = fullAddress;
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 50px;
  border: 1px solid #ccc;
}
.item {
  margin: 20px 0;
  border: 1px solid rgb(231, 188, 46);
}
</style>