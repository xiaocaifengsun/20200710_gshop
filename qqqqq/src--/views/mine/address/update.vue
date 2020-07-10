<template>
  <div class="main x-update">
    <x-address-edit :address-info="addressInfo" @save="btnSave" @delete="btnDelete"></x-address-edit>
  </div>
</template>
<script>
import * as apiMine from "@/api/mine";
import xAddressEdit from "@/components/x-address-edit";

export default {
  data() {
    return {
      addressInfo: {
        id: 0,
        name: "",
        tel: "",
        areaId: "",
        addressDetail: "",
        isDefault: false
      }
    };
  },
  components: {
    xAddressEdit
  },
  computed: {
    saveInfo() {
      let info = this.addressInfo;
      return {
        delivery_id: info.id,
        name: info.name,
        tel: info.tel,
        area_id: info.areaId,
        addr: info.addressDetail,
        is_default: info.isDefault ? 1 : 0,
        is_update_def: info.isDefault ? 1 : 0
      };
    }
  },
  created() {
    let info = this.$route.params.info;
    let self = this;
    if (_.isEmpty(info)) {
      this.$dialog.alert({
        message: "参数异常",
        confirmButtonText: "返回列表",
        beforeClose(action, done) {
          done();
          self.$router.replace({ path: "/mine/address/index" });
        }
      });
    } else {
      this.exchangeInfo(info);
    }
  },
  methods: {
    exchangeInfo(info) {
      this.addressInfo.id = info.deliveryId;
      this.addressInfo.name = info.name;
      this.addressInfo.tel = info.tel;
      this.addressInfo.areaId = info.areaId;
      this.addressInfo.addressDetail = info.addr;
      this.addressInfo.isDefault = info.isDefault == 1;
    },
    async btnSave(info) {
      this.addressInfo = info;
      await this.$post(apiMine.updateAddress, this.saveInfo);
      this.$router.go(-1);
    },
    async btnDelete(info) {
      await this.$post(apiMine.deleteAddress, {
        delivery_id: this.saveInfo.delivery_id
      });
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.x-update{
    ::-webkit-input-placeholder{
    font-size:0.28rem;
  };
  .van-cell{
    font-size:0.28rem;
        color: #323233;
        font-weight:normal;
       
  }
  .van-field__label{
    width:2.3rem;
  }
  .van-field__control{
        color: #333;
        font-weight:normal;

  }
}


</style>