<template>
  <div class="container">
    <div class="search_box">
      <div class="search">
        <van-icon name="search" @click="search_fun()" />
        <input
          type="text"
          placeholder="输入供应商名称、负责人进行查询"
          v-model="requestdata.customerName"
          @keyup="search_fun()"
        />
      </div>
    </div>
    <div class="search_box" style="top:1.1rem;padding:0px 0.3rem;border-top:0.2rem solid #f6f6f6;">
      <van-dropdown-menu>
        <van-dropdown-item v-bind:title="opAreaTitle" ref="ref_area">
          <x-area-picker
            v-model="requestdata.areaid"
            toolbar-position="bottom"
            @change="choosecity"
            @cancel="cancelcity"
          ></x-area-picker>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>

    <div class="list_box">
      <no-list :show="loading_data && lists.length<= 0" tip="暂无供应商" />
      <ul class="clear list" v-if="loading_data && lists.length> 0">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          error-text="加载失败，点击重新加载"
          :error.sync="loaderror"
          @load="onLoad"
        >
          <li v-for="item in lists" v-bind:key="item.id" @click="viewDetail(item)">
            <div class="company_info clear">
              <div class="company_name">
                <span>{{item.CustomerName}}</span>
              </div>
              <div class="company_state" v-if="!item.IsUse">停用</div>
            </div>
            <div class="customer_info">
              <span class="customer_name">{{item.LinkMan}}&nbsp;</span>
              <span class="customer_phone" @click.stop="callphone(item.Phone)">
                <van-icon name="phone-o" />
                {{item.Phone}}
              </span>
            </div>
          </li>
        </van-list>
      </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Icon, DropdownMenu, List, DropdownItem, Popup } from "vant";
Vue.use(Icon)
  .use(DropdownMenu)
  .use(List)
  .use(DropdownItem)
  .use(Popup);
import * as apiOrder from "@/api/order";

import xAreaPicker from "@/components/x-area-picker";
import { mapGetters, mapMutations } from "vuex";
import * as orderTypes from "@/store/order/types";

export default {
  data() {
    return {
      requestdata: {
        customerName: "",
        areaid: "",
        IsUse: 1,
        pageIndex: 0,
        pageSize: 10
      },
      opAreaTitle: "所在地区",
      loading: false,
      finished: true,
      loaderror: false,
      lists: [],
      loading_data: false,
      data_count: 0,
      showcity: false
    };
  },
  components: {
    xAreaPicker
  },
  watch: {
    "requestdata.areaid"(val) {
      this.search_fun();
    },
    "requestdata.customerName"(val) {
      this.search_fun();
    }
  },
  mounted() {
    this.begin();
  },
  methods: {
    ...mapMutations("order", {
      setOrderAuxiliary: orderTypes.SET_AUXILIARY_SUPPLIER // //设置订单辅助信息
    }),

    callphone(phone) {
      if (phone) {
        if (/(com.dbn.OAConnect|OAConnectStore)/.test(navigator.userAgent)) {
          //判断是否在智农通打开
          znt.openDial({
            phoneNo: phone // 电话号码
          });
        } else {
          window.location.href = "tel:" + phone;
        }
      }
    },
    async getEntIdFn() {
      var self = this;
      return new Promise((resolve, reject) => {
        getEntId().then(data => {
          if (data.code == 0 && data.data.Type == 0) {
            let eid = data.data.ID;
            self.requestdata.enterpriseId = eid;
            sessionStorage.setItem("eid", eid);
            resolve(eid);
          } else {
            reject();
          }
        });
      });
    },
    async begin() {
      this.finished = false;
      this.onLoad();
    },
    add_href_fun(url) {
      this.$router.push({ path: url });
    },
    cancelcity() {
      this.$refs.ref_area.toggle();
      this.opAreaTitle = "所在地区";
      this.requestdata.areaid = null;
    },
    choosecity(provinceId, cityId, countryId, fullAddress) {
      this.$refs.ref_area.toggle();
      this.opAreaTitle = fullAddress;
      this.requestdata.areaid = countryId;
    },
    search_fun() {
      this.requestdata.pageIndex = 1;
      this.lists.splice(0);
      this.finished = false;
      this.getList();
    },
    onLoad() {
      this.requestdata.pageIndex += 1;
      this.getList();
    },
    async getList() {
      this.data_count++;
      let count_nei = this.data_count;
      let self = this;
      self.loading = true;
      this.requestdata.enterpriseId = this.ENTID;
      let res = await this.$get(
        apiOrder.enterpriseList,
        this.requestdata,
        res => {},
        err => {
          self.loaderror = true;
          self.loading = false;
        }
      );

      if (count_nei < this.data_count) {
      } else {
        this.loading_data = true;
        if (res.list) {
          if (res.list.length > 0) {
            self.lists = self.lists.concat(res.list);
          } else {
            this.finished = true;
          }
          if (res.total <= self.lists.length) {
            this.finished = true;
          }
        }
        self.loading = false;
      }
    },
    viewDetail(item) {
      this.setOrderAuxiliary(item);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  -webkit-overflow-scrolling: touch;
  .search_box {
    position: fixed;
    left: 0;
    right: 0;
    background: #fff;
    padding: 0.2rem 0.3rem 0.2rem 0.3rem;
    z-index: 10;
    top: 0;
  }
  .search {
    position: relative;
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    padding: 0.15rem 0 0.16rem 0.7rem;
    input {
      width: 100%;
    }
    .van-icon-search {
      color: #cccccc;
      position: absolute;
      left: 0;
      top: 0.08rem;
      width: 0.26rem;
      height: 0.65rem;
      width: 0.65rem;
      text-align: center;
      line-height: 0.65rem;
      font-size: 0.49rem;
    }
    input::-webkit-input-placeholder {
      font-size: 0.26rem;
      color: #d0d0d0;
    }
  }

  .list_box {
    // position: fixed;
    // left: 0;
    // top: 2.2rem;
    // right: 0;
    // overflow: auto;
    // bottom: 0rem;
    // background: #fff;
    background: #fff;
    margin: 2.1rem 0 0 0;
    li {
      // height: 2rem;
      padding: 0.1rem 0 0.2rem 0;
      border-bottom: 1px solid #e9ebef;
      // & > div {
      //   // margin-top: 12px;
      //   // height: 18px;
      // }
    }
    .company_info {
      .company_name {
        float: left;
        width: 85%;
        font-size: 0.32rem;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .customer_info {
      margin-top: 0.03rem;
      font-size: 0.28rem;
      .customer_phone {
        margin-left: 15px;
        float: right;
        color: #2c7afe;
      }
      .van-icon-phone-o {
        font-size: 0.3rem;
        vertical-align: -0.06rem;
        color: #2c7afe;
      }
    }
    .customer_address {
      color: #a8a9aa;
      .addr_icon {
        // vertical-align: top;
        // height: 18px;
        // display: inline-block;
        // width: 20px;
        // line-height: 18px;

        margin-right: 0.05rem;
        vertical-align: middle;
        width: 0.32rem;
        height: 0.33rem;
        font-size: 0.32rem;
      }
      .addr {
        // font-size: 12px;
        // line-height: 18px;
        font-size: 0.24rem;
        line-height: 0.24rem;
      }
    }
  }

  .list {
    padding: 0.1rem 0.3rem 0.2rem 0.3rem;
  }
  .company_info {
    height: 0.7rem;
    line-height: 0.7rem;
  }

  .customer_address {
    color: #bbb;

    margin-top: 5px;
  }
  .company_state {
    width: 0.88rem;
    height: 0.54rem;
    line-height: 0.54rem;
    display: block;
    background: #f2f8ff;
    color: #b2b7bd;
    text-align: center;
    float: right;
    font-size: 0.24rem;
    margin-top: 0.05rem;
  }
  .state_used {
    color: #3f9efc;
    background: #f2f8ff;
  }
  .van-dropdown-menu {
    height: 0.9rem;
    border-bottom: 1px solid #e9ebef;
  }
  .van-hairline--top-bottom::after {
    border-width: 0px 0;
  }
}
/*.add {
  position: fixed;
  right: 0.6rem;
  bottom: 1.5rem;
  z-index: 4;
  img {
    width: 1.4rem;
    height: 1.4rem;
  }
}*/
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowart;
}
.van-list {
  padding-left: 0rem;
}
</style>
<style lang="less">
.picker-btn-wrap {
  width: 100%;
  display: block;
}
.van-dropdown-item__icon {
  font-size: 0.4rem;
}

.van-dropdown-menu__title::after {
  top: 0.3rem;
}


.van-loading__text {
  font-size: 0.28rem;
}
.search_box {
  .van-dropdown-menu__title {
    line-height: 0.6rem;
    font-size: 0.28rem;
  }
}


.search_box .van-dropdown-menu__title:after{
      top: 0.29rem;
}


.search_box .van-dropdown-menu__title--down.van-dropdown-menu__title:after{
      top:0.21rem;
}
</style>


