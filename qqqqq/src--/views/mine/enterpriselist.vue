<template>
  <div class="main">
    <ul class="items">
      <li class="item" v-for="item in list" :key="item.UserEnteID2" @click="switchEnt(item)">
        <span class="icon_p icon_p1" v-if="item.isPerson">个人</span>
        <span class="icon_text">{{item.Name}}</span>
        <van-icon name="success" v-if="ENTID==item.UserEnteID2" />
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from "vue";
import { Icon } from "vant";
Vue.use(Icon);
import { mapGetters, mapMutations } from "vuex";
import * as types from "@/store/root/types";
import * as apiMine from "@/api/mine";

export default {
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters({
      userInfo: types.USERINFO
    })
  },
  created() {
    this.getEntList();
  },
  methods: {
    ...mapMutations({
      setEntId: types.SET_ENTID
    }),
    async switchEnt(item) {
      if (item.UserEnteID2 != this.ENTID) {
        this._showLoading();
        let isok = await this.$post(apiMine.switchEnterprise, {
          enterpriseid: item.UserEnteID2,
          date: this._getDateTime("yyyy-M")
        });
        this.setEntId(item.UserEnteID2);
        this._hideLoading();
      }
      let shouldJmp = this.$route.query.back;
      if (shouldJmp) {
        this.$router.go(-1);
      }
    },
    async getEntList() {
      let list = await this.$get(apiMine.enterpriseList, { source: 16 });
      if (!_.isEmpty(this.userInfo)) {
        //添加个人身份
        list.unshift({
          UserEnteID2: this.userInfo.idStr,
          Name: `${this.userInfo.realName}`,
          isPerson:true,
        });
      }
      this.list = list;
    }
  }
};
</script>
<style lang="less" scoped>
.icon_p{
  font-weight:300;
  font-size:0.2rem;
  display:inline-block;
  padding:0 0.1rem;
  height:0.36rem;
  line-height:0.34rem;
  border-radius:0.18rem;
    vertical-align: middle;
 
  right:-0.7rem;
  top:-0.1rem;
  margin-right:0.1rem;
}
.icon_p1{
  border:1px solid #2f68fc;
  color:#2f68fc;
}
.icon_p2{
  border:1px solid #2f68fc;
  color:#2f68fc;

}
.icon_text{
 height:0.36rem;
  line-height:0.34rem;
    vertical-align: middle;
display:inline-block;
}
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