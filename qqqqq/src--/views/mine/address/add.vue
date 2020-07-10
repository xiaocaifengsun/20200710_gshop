<template>
  <div class="main x-update">
    <x-address-edit :address-info="addressInfo" @save="btnSave" :show-delete="false"></x-address-edit>
  </div>
</template>
<script>
import xAddressEdit from "@/components/x-address-edit";
import * as apiMine from "@/api/mine";
export default {
  data() {
    return {
      addressInfo: {
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
        // delivery_id: 0,
        addr: info.addressDetail,
        area_id: info.areaId,
        is_default: info.isDefault ? 1 : 0,
        name: info.name,
        tel: info.tel,
        type: 1
      };
    }
  },
  methods: {
    async btnSave(info) {
      this.addressInfo = info;
      await this.$post(apiMine.addAddress, this.saveInfo);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
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