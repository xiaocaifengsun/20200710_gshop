<template>
  <div class="container">
    <div class="search_box">
      <div class="search">
        <van-icon name="search" @click="search_fun()" />
        <input
          type="text"
          placeholder="输入商品名称进行查询"
          v-model="search_text"
          @keyup.enter="search_fun()"
        />
        <div class="scanning t_r" @click="scanqrcode_fun()">
          <img src="@/static/imgs/order/scanning.jpg" alt class="scanning" />
        </div>
      </div>
    </div>
    <div
      class="search_box"
      style="top: 1.1rem;padding: 0px 0.3rem;border-top: 0.2rem solid #f6f6f6;"
    >
      <van-dropdown-menu>
        <!--<van-dropdown-item />-->
        <div class="sortpicker" @click="sortpicker_fun">
          分类
          <span class="icon"></span>
        </div>

        <!--<van-dropdown-item v-model="requestdata.isuse" :options="opStates" />-->
      </van-dropdown-menu>
    </div>

    <!--
     <no-list :show="loading_data && lists.length<= 0" tip="暂无供应商" />
    <ul class="clear" :show="loading_data && lists.length > 0">-->

    <div class="goods" style>
      <no-list :show="loading_data && lists.length<= 0" tip="暂无商品" />
      <ul class="clear" v-if="loading_data && lists.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <li v-for="item in lists" @click="href_fun(item)" :key="item.ProductID">
            <div class="goods_img">
              <div class="img_box">
                <img :src="item.ImageUrl" alt v-if="item.ImageUrl" />
                <img src="@/static/imgs/order/nullgoodsimg.jpg" alt v-else />
              </div>
            </div>
            <div class="goods_intromm">
              <p class="t1 ellipsis">{{item.ProductName}}</p>
              <p class="p1 ellipsis">规格：{{item.Specification}}</p>
              <p class="p1 ellipsis">计量单位：{{item.UnitName}}</p>
              <p class="p1 ellipsis">条码：{{item.cBarCode}}</p>
            </div>
          </li>
        </van-list>
      </ul>
    </div>
    <!--<resultnull v-if="loading_data && lists.length<= 0" /> -->
    <div class="add" @click="add_href_fun('managegoods')" v-if="(permission&2)==2">
      <!--<img src="./images/addimg.png" />-->
    </div>
    <goodspickeruser
      v-if="sortpicker.show[sortpicker.index]"
      :sortpicker="sortpicker"
      :submitdata="sortdata"
      :permissionCode="0"
    />
  </div>
</template>
<script>
import * as apiMine from "@/api/order";
import Vue from "vue";
import { Icon, DropdownMenu, DropdownItem, List } from "vant";
Vue.use(Icon)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(List);

import * as apiOrder from "@/api/order";
import goodspickeruser from "./components/goodspickeruser.vue";
import { mapGetters, mapMutations } from "vuex";

import * as orderTypes from "@/store/order/types";
export default {
  beforeRouteLeave(to, from, next) {
    if (this.sortpicker.show[0]) {
      this.$set(this.sortpicker.show, this.sortpicker.index, false);
      next(false);
    } else {
      next();
    }
  },
  components: {
    goodspickeruser
  },
  data() {
    return {
      loading: false,
      finished: false,
      lists: [],
      search_text: "",
      requestdata: {
        enterpriseid: this.ENTID,
        pageindex: 0,
        pagesize: 10,
        productname: "",
        isuse: 1, //使用状态
        classificationid: "" //代号分类
      },
      loading_data: false,
      permission: sessionStorage.getItem("permission"),
      data_count: 0,
      sortpicker: {
        // 用户分类 分类   插件
        index: 0,
        show: [false, false],
        all_datas: [],
        data: []
      },
      sortdata: {
        cFullClassName: "",
        ClassificationID: ""
      },
      scanqrcode_state: false
    };
  },
  mounted() {
    this.onLoad();
  },
  watch: {
    search_text(val) {
      if (!this.scanqrcode_state) {
        this.search_fun();
      }
    },
    "sortdata.ClassificationID"(val) {
      this.search_fun();
    }
  },
  computed: {
    ...mapGetters("order", {
      auxiliaryGoods: orderTypes.AUXILIARY_GOODS //关联商品信息
    })
  },
  methods: {
    ...mapMutations("order", {
      setOrderGoods: orderTypes.SET_AUXILIARY_GOODS //设置订单辅助商品信息
    }),
    sortpicker_fun() {
      this.$set(this.sortpicker.show, 0, true);
    },
    add_href_fun(url) {
      this.$router.push(url);
    },
    onLoad() {
      this.requestdata.pageindex += 1;
      this.get_data_fun();
    },
    search_fun() {
      this.loading_data = false;
      this.requestdata.productname = this.search_text; //产品名称
      this.requestdata.classificationid = this.sortdata.ClassificationID; // 分类查找
      this.requestdata.pageindex = 1; //请求页数
      this.lists.splice(0);
      this.loading = true;
      this.finished = false;
      this.get_data_fun();
    },
    async get_data_fun() {
      this.data_count++;
      let count_nei = this.data_count;
      this.requestdata.enterpriseid = this.ENTID;
      let res = await this.$get(
        apiOrder.detailbyenter,
        this.requestdata,
        res => {},
        err => {
          this.$toast({ message: "获取商品列表失败", duration: 2000 });
        }
      );

      if (count_nei < this.data_count) {
      } else {
        this.loading_data = true;
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            this.lists.push(res[i]);
          }
        }
        this.loading = false; //是否触发事件
        if (res.length < this.requestdata.pagesize) {
          this.loading = false; //是否触发事件
          this.finished = true;
        }
      }
    },
    href_fun(item) {
      let pid = this.$route.params.productid;
      let curGood = {
        Key: pid,
        Val: item
      };
      this.setOrderGoods(curGood);
      this.$router.go(-1);
    },
    // 扫一扫插件
    scanqrcode_fun() {
      this.scanqrcode_state = true; //扫码开始了
      let _this = this;
      if (/(com.dbn.OAConnect|OAConnectStore)/.test(navigator.userAgent)) {
        znt.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由智农通处理，不触发回调; 1, 则直接返回扫描结果。
          urlParam: "", //needResult=1时拼接到url后的字符串，可不传，v3.2.0新增字段
          success: function(res) {
            let result = res.resultStr; // 返回扫码结果
            _this.search_text = result;
            _this.barcode_search_fun(result);
          }
        });
      }
    },
    barcode_search_fun(cbarcode) {
      let _this = this;
      _this.loadingstate = true;
      barcode({
        enterpriseid: this.ENTID,
        cbarcode: cbarcode
      }).then(function(res) {
        _this.scanqrcode_state = false; //扫码结束了
        if (res.code == 1) {
          detailbyenterdetail({
            enterpriseid: this.ENTID,
            productid: res.data[0].cParameter
          }).then(res => {
            _this.loadingstate = true;
            if (res.code == "0") {
              _this.lists.splice(0);
              _this.requestdata.pageindex = 1; //请求页数
              _this.loading = false; //是否触发事件
              _this.finished = true;
              _this.lists.push(res.data);
            } else {
              _this.$toast({
                duration: 2000,
                message: "没有找到对应的商品"
              });
            }
          });
        } else {
          _this.loadingstate = false;
          _this.$toast({
            duration: 2000,
            message: "没有找到对应的商品"
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
[class*="van-hairline"]::after {
  border: none;
}
.container {
  .search_box {
    position: fixed;
    left: 0;
    right: 0;
    padding: 0.2rem 0.3rem 0.2rem 0.3rem;
    top: 0;
    background: #fff;
    z-index: 10;
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
      top: 0.03rem;
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
    .scanning {
      height: 0.65rem;
      width: 0.65rem;
      position: absolute;
      right: 0.1rem;
      top: 0.03rem;
      text-align: center;
      img {
        height: 0.32rem;
        width: 0.32rem;
        margin: 0.13rem 0.08rem 0 0;
      }
    }
  }
  .goods {
    background: #fff;
    margin: 2.1rem 0 0 0;
    li {
      position: relative;
      border-bottom: 1px solid #e9ebef;
      padding: 0.3rem 0.26rem 0.3rem 2.26rem;
      .goods_img {
        width: 2rem;
        height: 2rem;
        position: absolute;
        left: 0rem;
        // top:0.3rem;
        top: 50%;
        margin: -1rem 0 0 0;
        .img_box {
          width: 2rem;
          height: 2rem;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods_intromm {
        width: 100%;
        .t1 {
          font-size: 0.32rem;
          color: #202328;
          font-weight: 700;
          margin-bottom: 0.04rem;
          line-height: 0.52rem;
        }
        .p1 {
          font-size: 0.28rem;
          color: #646668;
          line-height: 0.48rem;
        }
      }
    }
  }
  .add {
    position: fixed;
    right: 0.6rem;
    bottom: 1.5rem;
    z-index: 4;
  }
  .add img {
    width: 1.4rem;
    height: 1.4rem;
  }
}

.van-dropdown-menu {
  height: 0.9rem;
  border-bottom: 1px solid #e9ebef;
}

.sortpicker {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 0.86rem;
  text-align: center;
  line-height: 0.9rem;
  background: #fff;
  font-size: 0.28rem;
  .icon {
    position: absolute;
    font-size: 15px;
    border: 3px solid;
    border-color: transparent transparent currentColor currentColor;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    opacity: 0.6;
    content: "";
    top: 0.35rem;
    margin-left: 0.13rem;
  }
  .van-dropdown-item__icon {
    font-size: 0.46rem;
  }
  .item50 {
    width: 50%;
    float: left;
  }
}
</style>

<style>
.van-dropdown-item__icon {
  font-size: 0.46rem;
}
.van-list {
  padding-left: 0.26rem;
}
.van-dropdown-menu__title::after {
  top: 5px;
}

.van-dropdown-menu__title--down::after {
  margin-top: 4px;
}
.van-loading__text {
  font-size: 0.28rem;
}
.van-dropdown-menu__title {
  font-size: 0.3rem;
}
</style>

