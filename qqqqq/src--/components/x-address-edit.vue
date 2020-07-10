<template>
  <div class="x-address-edit">
    <van-field
      v-model="aInfo.name"
      label="姓名"
      placeholder="请输入姓名"
      :error="nameError"
      @focus="nameError=false"
    />
    <van-field
      v-model="aInfo.tel"
      label="电话"
      placeholder="请输入联系方式"
      :error="phoneError"
      @focus="phoneError=false"
    />
    <div class="address-div">
    <x-address v-model="aInfo.areaId"></x-address>
   
    </div>  
    <van-field
      v-model="aInfo.addressDetail"
      label="详细地址"
      type="textarea"
      placeholder="街道门牌、楼层房间号等信息"
      rows="1"
      autosize
      :maxlength="detailMaxlength"
      :error="detailError"
      @focus="detailError=false"
    />
  
    <van-switch-cell v-model="aInfo.isDefault" title="设为默认地址" />
    <div class="van-address-edit__buttons">
      <van-button type="danger" size="normal" block @click="btnSave">保存</van-button>
      <van-button type="default" size="normal" block v-if="showDelete" @click="btnDelete">删除</van-button>
    </div>
  </div>
</template>
<script>
import xAddress from "@/components/x-address";
import Vue from "vue";
import { Field, SwitchCell } from "vant";

Vue.use(Field).use(SwitchCell);

export default {
  data() {
    return {
      aInfo: this.addressInfo,
      phoneError: false,
      nameError: false,
      detailError: false
    };
  },
  props: {
    addressInfo: {
      default: {}
    },
    showDelete: {
      default: true
    },
    detailMaxlength: {
      default: 200
    }
  },
  components: {
    xAddress
  },
  watch: {
    addressInfo: {
      deep: true,
      handler(val) {
        this.aInfo = val;
      }
    }
  },
  methods: {
    btnSave() {
      if (!this.checkName() || !this.checkPhone()) return;
      if (!this.aInfo.areaId) {
        this.$toast({ message: "请选择地区", duration: 1000 });
        return;
      }
      if (!this.aInfo.addressDetail) {
        this.detailError = true;
        this.$toast({ message: "请填写详细地址", duration: 1000 });
        return;
      }
      this.$emit("save", this.aInfo);
    },
    btnDelete() {
      this.$dialog
        .confirm({
          message: "确定要删除嘛？"
        })
        .then(() => {
          this.$emit("delete", this.aInfo);
        })
        .catch(() => {
          this.$emit("cancel-delete", this.aInfo);
        });
    },
    changeDefault() {
      this.$emit("change-default", !!this.aInfo.isDefault);
    },
    checkPhone() {
      let regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      let regTel = /^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$/;
      let ok = regMobile.test(this.aInfo.tel) || regTel.test(this.aInfo.tel);
      this.phoneError = !ok;
      if (this.phoneError)
        this.$toast({ message: "请填写正确的电话/手机号", duration: 1000 });
      return ok;
    },
    checkName() {
      let name = this.aInfo.name;
      if (name == null || name == "" || _.trim(name).length == 0) {
        this.nameError = true;
        this.$toast({ message: "请输入姓名", duration: 1000 });
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="less" scoped>
.van-address-edit__buttons {
  padding: 32px 16px;
  .van-button {
    margin-bottom: 12px;
  }
}


.van-cell{
  padding: 0.3rem 0.3rem;
}
.van-button--danger{
    background: #2C7AFE;
    border: 1px solid #2C7AFE;
    line-height: 1rem;
    height: 1.02rem;
    font-size: 0.32rem;
}  
.van-button--default{
       background: #FFF;
    border: 1px solid #2C7AFE;
    color:#2C7AFE;
    line-height: 1rem;
    height: 1.02rem;
    font-size: 0.32rem;
}

</style>
<style lang="less">
.address-div{
      padding: 0.3rem 0rem 0rem 0.3rem;
  .van-cell{
    padding: 0rem 0.3rem 0.3rem 0rem;
        border-bottom: 1px solid #ebedf0;
  }
}
</style>