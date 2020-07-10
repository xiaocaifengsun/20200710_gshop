<template>
  <van-popup
    :value="true"
    v-show="showPicker"
    :overlay="showPicker"
    @click-overlay="showPicker=false"
    position="bottom"
  >
    <x-area-picker
      v-model="countryId"
      @change="changeFn"
      @cancel="showPicker = false"
      @init-address="initAddress"
    ></x-area-picker>
  </van-popup>
</template>
<script>
import xAreaPicker from "@/components/x-area-picker";
import Vue from "vue";
import { Popup } from "vant";
Vue.use(Popup);

export default {
  data() {
    return {
      showPicker: this.show,
      countryId: this.value
    };
  },
  props: {
    value: {
      default: null
    },
    show: {
      default: false
    }
  },
  watch: {
    value(val) {
      this.countryId = val;
    },
    show(val) {
      this.showPicker = val;
    },
    showPicker(val) {
      if (!val) {
        this.$emit("update:show", val);
      }
    }
  },
  components: { xAreaPicker },
  methods: {
    changeFn(provinceId, cityId, countryId, fullAddress) {
      this.showPicker = false;
      this.$emit("change", provinceId, cityId, countryId, fullAddress);
      this.$emit("input", countryId);
    },
    initAddress(fullAddress) {
      this.$emit("init-address", fullAddress);
    }
  }
};
</script>