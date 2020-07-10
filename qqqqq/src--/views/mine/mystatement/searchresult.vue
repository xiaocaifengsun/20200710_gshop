<template>
  <div class="container mystatementsearchresult">
    <div class="search_box">
      <div class="search">
        <van-icon name="search" @click="search_fun()" />
        <input
          placeholder="请输入商家名称进行查询"
          v-model="init_params.customername"
          @keyup.enter="search_fun()"
          type="search"
          @focus="focus_fun()"
          id="input"
        />
      </div>
    </div>
    <van-pull-refresh v-model="pullLoading" @refresh="pullRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
        :finished-text="showNoMore && lists.length>0 ?'没有更多了':''"
        :style="{background: showNoMore && lists.length>0 ? '#f6f5f8' : '#FFF'}"
      >
        <nulldate :show="showNoMore && lists.length==0" tip="暂无相关的对账单" />

        <div class="list_main">
          <div class="items" v-for="(item,index) of lists" @click="go_href(item)" :key="index">
            <div class="item item_1">
              <div class="title">{{item.CustomerName}}</div>
              <div
                class="state state_1"
                v-if="item.State == '201806031736522002'"
              >{{item.StateName}}</div>
              <div
                class="state state_2"
                v-if="item.State == '201806031736522003'"
              >{{item.StateName}}</div>
              <div class="state state_3" v-if="item.State == '201806031736522004'">
                <van-icon name="warning-o" />
                {{item.StateName}}
              </div>
            </div>
            <div class="item item_2 clear">
              <div
                class="date"
              >{{item.BussinessStartDate.substr(0,10)}} 至 {{item.BussinessEndDate.substr(0,10)}}</div>
              <div class="print">
                <span class="icon">￥</span>
                {{item.Amount}}
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, List, Card, Icon, PullRefresh } from "vant";
Vue.use(Field)
  .use(List)
  .use(Card)
  .use(Icon)
  .use(PullRefresh);
import * as apiMine from "@/api/mine";
import * as commonOrder from "@/api/common";
import * as apiOrder from "@/api/order";
import nulldate from "./components/nulldate";
export default {
  beforeRouteLeave(to, from, next) {
    let input = document.getElementById("input");
    if (to.path == "/mine/mystatement/search") {
      if (input == document.activeElement) {
        next();
      } else {
        this.$router.push({
          path: "/mine/mystatement/index"
        });
      }
    } else {
      next();
    }
  },
  data() {
    return {
      init_params: {
        enterpriseid: "",
        customername: "",
        pageindex: "1",
        pagesize: 5,
        state: ""
      },
      pullLoading: false, // 数据更新完毕 false   数据正在更新 true
      loading: false, // 数据更新完毕 false   数据正在更新 true
      finished: false, //没数据啦true）  还有数据false
      // req: {
      //   customerid: "",
      //   enterpriseid: "", //供应商ID
      //   productname: this.productname
      // },
      lists: [],
      showNoMore: false
    };
  },
  components: {
    nulldate
  },
  created() {
    this.init_params.enterpriseid = this.ENTID;
    this.init_params.customername = this.$route.query.search;
  },
  methods: {
    async go_href(item) {
      this._showLoading();
      let mystatementState = await this.$get(apiOrder.enterprise, {
        menuID: "2003311403020000101",
        enterpriseID: this.ENTID,
        groupID: "0"
      });
      let params = {
        numericalorder: item.NumericalOrder,
        enterpriseid: item.EnterpriseID,
        enterprisename: item.CheckTypeName,
        customerid: item.CustomerID,
        customername: item.CustomerName,
        begindate: item.BussinessStartDate,
        enddate: item.BussinessEndDate,
        menuid: "2003311403020000101"
      };
      this.$get(apiMine.jumpurlGet, params, res => {
        this._hideLoading();
        // 单位是0(分情况) 个人是1(显示)
        if (this.IS_PERSON) {
          window.location.href = res + "&showFooter=True";
        } else {
          //单位
          if ((mystatementState & "16") == "16") {
            //显示
            window.location.href = res + "&showFooter=True";
          } else {
            //不显示
            window.location.href = res + "&showFooter=False";
          }
        }
      });
    },
    search_fun() {},
    focus_fun() {
      this.$router.push({
        query: { search: this.init_params.customername },
        path: "/mine/mystatement/search"
      });
    },
    resetLoad() {
      this.finished = false;
      this.lists.length = 0;
      this.init_params.pageindex = 1;
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      this._showLoading();
      this.showNoMore = false;
      this.$get(apiMine.getStateMent, this.init_params, res => {
        this._hideLoading();
        this.showNoMore = true;
        this.init_params.pageindex++;
        this.loading = false;
        if (res.length < this.init_params.pagesize) {
          this.finished = true;
        }
        this.lists = this.lists.concat(res);
      });
    },
    pullRefresh() {
      //刷新
      this.pullLoading = false;
      this.resetLoad();
    }
  }
};
</script>


<style lang="less" scoped>
.list_main {
  padding: 0 0.3rem;
  background: #fff;
  .items {
    border-bottom: 1px solid rgba(143, 153, 177, 0.2);
    .item_1 {
      position: relative;
      padding: 0.25rem 0 0.1rem 0;
    }
    .title {
      color: rgba(32, 35, 40, 1);
      font-size: 0.32rem;
      font-weight: 400;
    }
    .state {
      font-size: 0.28rem;
      position: absolute;
      right: 0;
      top: 0.25rem;
    }
    .state_1 {
      color: rgba(32, 35, 40, 0.6);
    }
    .state_2 {
      color: rgba(2, 210, 71, 1);
    }
    .state_3 {
      color: rgba(254, 12, 12, 1);
      .van-icon-warning-o {
        display: inline-block;
        margin: 0 0.05rem 0 0rem;
        vertical-align: -0.06rem;
        font-size: 0.32rem;
      }
    }
    .item_2 {
      padding: 0.05rem 0 0.25rem 0;
    }
    .date {
      color: rgba(32, 35, 40, 0.6);
      font-size: 0.28rem;
      width: 65%;
      float: left;
    }
    .print {
      width: 35%;
      float: left;
      font-weight: 500;
      text-align: right;
      font-size: 0.26rem;
      .icon {
        font-size: 0.24rem;
        -webkit-transform: scale(0.8);
        display: inline-block;
      }
    }
  }
  .items:last-child {
    border-bottom: none;
  }
}

.search_box {
  padding: 0.3rem 0.3rem 0rem 0.3rem;
  background: #fff;
  position: fixed;
  left: 0rem;
  right: 0rem;
  top: 0rem;
  z-index: 1000;
  .van-icon-search {
    color: RGBA(201, 201, 201, 1);
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
  .search {
    position: relative;
    border: 1px solid RGBA(233, 233, 233, 1);
    border-radius: 6px;
    padding: 0.15rem 0 0.16rem 0.6rem;
    height: 0.74rem;
    background: RGBA(255, 255, 255, 1);
    color: #999999;
    font-size: 0.28rem;
    input {
      width: 100%;
      font-size: 0.28rem;
      /* margin-top: 0.02rem; */
      // background: rgba(233, 233, 233, 1);
      color: #3b3b3b;
      height: 0.4rem;
      line-height: 0.4rem;
      padding-left: 0.1rem;
    }
    ::-webkit-input-placeholder {
      font-size: 0.28rem;
      color: RGBA(207, 207, 207, 1);
    }
    .text {
      font-size: 0.28rem;
      color: RGBA(207, 207, 207, 1);
    }
  }
  .cancel {
    position: absolute;
    right: -0.85rem;
    top: 0;
    width: 0.85rem;
    height: 0.74rem;
    line-height: 0.74rem;
    text-align: right;
    font-size: 0.28rem;
    color: #3b3b3b;
    color: #2c7afe;
  }
  input[type="search"]::-webkit-search-cancel-button {
    // -webkit-appearance: none;/*此处只是去掉默认的小×*/
    line-height: 0.26rem;
  }
}
</style>
<style lang="less">
.mystatementsearchresult {
  .van-pull-refresh {
    background: #f6f6f6;
    margin-top: 1.4rem;
    // margin-bottom: 50px;
    padding-left: 0;
  }

  .van-list {
    padding-top: 0.2rem;
    min-height: calc(100vh - 1.4rem);
    background: RGBA(246, 245, 248, 1);
  }
  .van-tabs__wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
  }
  .van-tabs__nav--card .van-tab {
    border-right: none;
  }
  .tab-wrapper .van-tabs__nav--card {
    margin: 0;
  }
  .van-tabs__nav--card {
    border: none;
    height: 0.9rem;
  }
  .van-tabs--card > .van-tabs__wrap {
    height: 0.9rem;
  }
  .van-tabs__nav--card .van-tab {
    line-height: 0.9rem;
  }
  .tab-wrapper {
    padding-top: 0;
  }
  .van-tab span {
    height: 0.9rem;
    display: inline-block;
    color: #949596;
    font-size: 0.28rem;
  }
  .van-tabs__nav--card .van-tab.van-tab--active {
    background: none;
    color: #2f68fc;
  }
  .van-tabs__nav--card .van-tab.van-tab--active span {
    border-bottom: 2px solid #2f68fc;
  }
  .van-list {
    padding-left: 0rem;
  }
}
</style>
