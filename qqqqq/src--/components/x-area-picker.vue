<template>
  <van-picker
    ref="city_picker"
    :columns="lists"
    @change="onValuesChange"
    value-key="name"
    showToolbar
    :toolbar-position="toolbarPosition"
    @cancel="onCancel"
    @confirm="onConfirm"
  ></van-picker>
</template>
<script>
import areas from "@/static/js/city.json";
import Vue from "vue";
import { Picker } from "vant";
Vue.use(Picker);

export default {
  data() {
    return {
      provinceId: null,
      cityId: null,
      countryId: null,
      provinceList: [],
      cityList: [],
      countryList: [],
      areas: areas,
      inited: false
    };
  },
  props: {
    value: {
      default: null
    },
    toolbarPosition: {
      default: "top"
    }
  },
  computed: {
    lists() {
      return [
        {
          values: this.provinceList
        },
        {
          values: this.cityList
        },
        {
          values: this.countryList
        }
      ];
    }
  },
  watch: {
    value(val) {
      this.initData(1);
    },
    provinceId(val) {
      this.cityList = this.areas[val];
      if (this.inited) {
        this.cityId = this.cityList[0].id;
      }
    },
    cityId(val) {
      this.countryList = this.areas[val];
      if (this.inited) {
        this.countryId = this.countryList[0].id;
      }
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(valChange) {
      this.inited = false;
      this.provinceList = this.areas["0"];
      let countryid = this.value;
      let cityid = this.findParentId(countryid);
      let provinceid = this.findParentId(cityid);
      if (provinceid) {
        this.provinceId = provinceid;
        this.cityId = cityid;
        this.countryId = countryid;
        this.$nextTick(() => {
          this.initSelInd();
        });
        let fullAddress = this.getFullAddress();
        this.$emit("init-address", fullAddress);
      } else {
        let oldPId = this.provinceId;
        this.provinceId = this.provinceList[0].id;
        if (valChange) {
          if (oldPId == this.provinceId) {
            let oldCId = this.cityId;
            this.cityId = this.cityList[0].id;
            if (oldCId == this.cityId) {
              this.countryId = this.countryList[0].id;
            }
          }
          this.$nextTick(() => {
            this.initSelInd();
          });
        }
        this.inited = true;
      }
    },
    findParentId(childId) {
      if (!childId) return null;
      for (var key in this.areas) {
        let vals = this.areas[key] || [];
        if (vals.findIndex(f => f.id == childId) > -1) {
          return Number(key);
        }
      }
      return null;
    },
    initSelInd() {
      let pInd = this.provinceList.findIndex(f => f.id == this.provinceId);
      this.$refs.city_picker.setColumnIndex(0, pInd);
      let cInd = this.cityList.findIndex(f => f.id == this.cityId);
      this.$refs.city_picker.setColumnIndex(1, cInd);
      let ctInd = this.countryList.findIndex(f => f.id == this.countryId);
      this.$refs.city_picker.setColumnIndex(2, ctInd);
    },
    onValuesChange(picker, values) {
      this.inited = true;
      this.provinceId = (values[0] || {}).id;
      this.cityId = (values[1] || {}).id;
      this.countryId = (values[2] || {}).id;
    },
    onConfirm() {
      this.$emit(
        "change",
        this.provinceId,
        this.cityId,
        this.countryId,
        this.getFullAddress()
      );
      this.$emit("input", this.countryId);
    },
    onCancel() {
      this.$emit("cancel");
    },
    getFullAddress() {
      let countryid = this.countryId;
      let cityid = this.findParentId(countryid);
      let provinceid = this.findParentId(cityid);
      if (provinceid) {
        let resP = this.areas["0"].find(f => f.id == provinceid);
        let resC = this.areas[resP.id].find(f => f.id == cityid);
        let resCT = this.areas[resC.id].find(f => f.id == countryid);
        let fullAddress = `${resP.name} / ${resC.name} / ${resCT.name}`;
        return fullAddress;
      }
      return "";
    }
  }
};
</script>