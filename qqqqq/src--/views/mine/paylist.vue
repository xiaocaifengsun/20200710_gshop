<template>
  <div class="list_con min_pay_list">
    <div class="list_box">
      <van-pull-refresh v-model="isLoading"
                        @refresh="onRefresh">
        <van-list v-model="loading"
                  :finished="finished"
                  :finished-text="numericalorder?'':'没有更多了'"
                  :error.sync="loaderror"
                  error-text="加载失败，点击重新加载"
                  @load="onLoad">
          <div class="items_con"
               v-for="(itemP,index) in lists"
               :key="index">
            <p class="items_t">{{itemP.showDate}}</p>
            <ul>
              <div class="list_main">
                <div class="items"
                     v-for="(item,index2) in itemP.list"
                     :key="index2">
                  <div class="item item_1">
                    <div class="title">{{item.PayTypeName}} </div>
                    <div class="print">
                      <span class="icon">￥</span>
                      {{item.Amount|money}}
                    </div>
                  </div>
                  <div class="item item_2 clear">
                    <div class="date">{{item.PayTime}}</div>
                    <div class="state state_3"
                         v-if="item.PayStatus=='0'">支付失败</div>
                    <div class="state state_2"
                         v-if="item.PayStatus=='1'">支付成功</div>
                    <div class="state state_1"
                         v-if="item.PayStatus=='2'">处理中</div>
                  </div>
                  <div class="item item_3">

                    流水号：{{item.NumericalOrder}}
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div style="height:1rem;"></div>
    <div class="footer">共 <span class="bottom_num">{{extDa.MaxCount}}</span> 笔 实付金额 <span class="bottom_num">{{extDa.AmountAll|money}}</span> 元</div>
  </div>
</template>
<script>
import Vue from 'vue'
import { List, Tab, Tabs, PullRefresh, Cell } from 'vant'
Vue.use(List)
  .use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(PullRefresh)
import * as apiMine from '@/api/mine'
export default {
  name: 'paylist',
  data() {
    return {
      lists: [],
      extDa: {
        AmountAll: 0,
        MaxCount: 0
      },
      isLoading: false,
      finished: false,
      loaderror: false,
      loading: true,
      requestdata: {
        reqtype: 0,
        actortype: 0
      }, //请求参数
      state: '',
      // dataTitleArrays:[],
      pageSize: 10,
      numericalorder: ''
    }
  },
  watch: {
    // "requestdata.iswrite": _.debounce(function(val) {
    //   this.resetData();
    //   this.onLoad();
    // }, 50)
  },
  created() {
    this.numericalorder = this.$route.params.numericalorder
    this.requestdata.drawee = this.ENTID
    if (this.numericalorder) {
      //详情
      this.requestdata.numericalorder = this.numericalorder
    } else {
      //列表
      this.requestdata.pageindex = 1
      this.requestdata.pagesize = this.pageSize
    }
    this.onLoad()
  },
  methods: {
    onRefresh() {
      this.isLoading = false
      this.resetData()
      this.onLoad()
    },
    resetData() {
      this.lists = []
      this.requestdata.pageindex = 1
      this.extDa.MaxCount = 0
      this.extDa.AmountAll = 0
    },
    onLoad() {
      this.$post(
        apiMine.paysList,
        this.requestdata,
        da => {
          let oldList = da.list || []
          var allList = this.lists
          for (var item of oldList) {
            let showDate = item.PayTime.substr(0, 10)
            var curItem = allList.find(f => f.showDate == showDate)
            if (!_.isEmpty(curItem)) {
              curItem.list.push(item)
            } else {
              allList.push({ showDate: showDate, list: [item] })
            }
          }
          this.extDa.AmountAll = da.ext.AllAmount || 0
          this.extDa.MaxCount = da.total
          this.finished = oldList.length < this.pageSize
          !this.finished && this.requestdata.pageindex++
        },
        err => {
          this.loaderror = true
        },
        fi => {
          this.loading = false
        }
      )
    }
  }
}
</script>
<style>
.min_pay_list .van-list {
  min-height: calc(100vh - 1rem);
}
</style>
<style lang="less" scoped>
.items_con {
  .items_t {
    background: #f6f6f6;
    color: #b1b1b1;
    height: 0.7rem;
    line-height: 0.7rem;
    padding: 0 0.3rem;
  }
}
.list_main {
  padding: 0 0.3rem;
  background: #fff;
  .items {
    border-bottom: 1px solid rgba(143, 153, 177, 0.2);
    .item_1 {
      position: relative;
      padding: 0.25rem 0.6rem 0.1rem 0;
    }
    .title {
      color: rgba(32, 35, 40, 1);
      font-size: 0.3rem;
      font-weight: 600;
    }
    .state {
      // font-size: 0.28rem;
      // position: absolute;
      // right: 0;
      // top: 0.25rem;

      width: 35%;
      float: left;
      font-weight: 500;
      text-align: right;
      font-size: 0.26rem;
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
      padding: 0.05rem 0 0.09rem 0;
    }
    .item_3 {
      padding: 0.05rem 0 0.25rem 0;
      color: rgba(32, 35, 40, 0.6);
    }
    .date {
      color: rgba(32, 35, 40, 0.6);
      font-size: 0.28rem;
      width: 65%;
      float: left;
    }
    .print {
      font-weight: 600;
      font-size: 0.26rem;
      position: absolute;
      right: 0;
      top: 0.25rem;
      // width: 35%;
      // float: left;
      // font-weight: 500;
      // text-align: right;
      // font-size: 0.26rem;
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
.list_con {
  font-size: 0.28rem;
  color: #000000;
  .list_box {
    min-height: 90vh;
  }
  .vipstate {
    width: 1rem;
    line-height: 0.45rem;
    color: #7b5248;
    height: 0.45rem;

    display: inline-block;
    text-align: center;
  }
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1rem;
  background: #fff;
  padding: 0.3rem 0.3rem 0;
  border-top: 1px solid #e9ebef;
  font-size: 0.3rem;
  color: #000;
  .bottom_num {
    font-weight: 600;
    font-size: 0.25rem;
  }
}
.van-list {
  padding-left: 0rem;
}
</style>
<style lang="less">
.min_pay_list {
  .van-pull-refresh {
    background: #f6f6f6;
  }
  .van-list {
    background: #f6f6f6;
  }
}
</style>