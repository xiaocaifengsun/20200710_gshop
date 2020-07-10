<template>
  <div class="container">
    <div class="search_box action" id="search">
      <div class="search">
        <van-icon name="search" @click="search_fun()" />
        <input
          placeholder="请输入商家名称进行查询"
          v-model.trim="search"
          @keyup.enter="search_fun()"
          v-focus_dir
          type="search"
          autofocus="autofocus"
          id="searchinput"
        />
        <van-icon name="cross" v-if="search_show" @click="clear_search_fun()" />
        <div class="cancel" @click="cancelClick">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Icon } from "vant";
Vue.use(Icon);
export default {
  data() {
    return {
      search: "",
      search_show: false
    };
  },
  created() {
    this.search = this.$route.query.search;
  },
  methods: {
    search_fun() {
      this.$router.push({
        query: { search: this.search },
        path: "/mine/mystatement/searchresult"
      });
    },
    cancelClick() {
      this.$router.go(-1);
    },
    clear_search_fun() {
      this.req.productname = "";
      document.getElementById("searchinput").focus();
    }
  },
  directives: {
    focus_dir: {
      inserted(el) {
        el.focus();
      }
    }
  }
};
</script>


<style lang="less" scoped>
.container {
  .search_box {
    padding: 0.3rem 0.3rem 0.3rem 0.3rem;
    background: #fff;
    position: fixed;
    left: 0rem;
    right: 0rem;
    top: 0rem;
    z-index: 1000;
    .van-icon-search {
      color: #ccc;
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
    .van-icon-cross {
      position: absolute;
      right: 0.1rem;
      top: 0.2rem;
      color: #8e8e8e;
      width: 0.35rem;
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
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
        background: RGBA(255, 255, 255, 1);
        color: #3b3b3b;
        height: 0.4rem;
        line-height: 0.4rem;
        padding-left: 0.1rem;
      }
      ::-webkit-input-placeholder {
        font-size: 0.28rem;
        color: RGBA(207, 207, 207, 1);
        height: 0.4rem;
        line-height: 0.4rem;
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
      line-height: 0.26rem;
      display: none;
    }
  }
  .action.search_box {
    padding: 0.3rem 1.15rem 0.3rem 0.3rem;
  }
}
</style>
