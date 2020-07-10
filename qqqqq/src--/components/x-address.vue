<template>
  <div class="x-address">
    <van-field
      label="地区"
      placeholder="选择省 / 市 / 区"
      readonly
      @click="show=true"
      :value="fullAddress"
    ></van-field>
    <x-area
      v-model="areaId"
      v-show="true"
      :show.sync="show"
      @change="change"
      @init-address="getAddress"
    ></x-area>
  </div>
</template>
<script>
import Vue from "vue";
import { Field } from "vant";
Vue.use(Field);
import xArea from "./x-area";

export default {
  data() {
    return {
      show: false,
      areaId: this.value,
      fullAddress: null
    };
  },
  components: {
    xArea
  },
  props: {
    value: {
      default: null
    }
  },
  watch: {
    value(val) {
      this.areaId = val;
    },
    areaId(val) {
      this.$emit("input", val);
      if (!val) this.fullAddress = null;
    }
  },
  methods: {
    change(provinceId, cityId, countryId, fullAddress) {
      this.areaId = countryId;
      this.fullAddress = fullAddress;
      this.$emit("change", provinceId, cityId, countryId, fullAddress);
    },
    getAddress(fullAddress) {
      this.fullAddress = fullAddress;
    }
  }
};
</script>
