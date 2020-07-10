<template>
  <div class="container">
    <div class="search_box action" id="search">
      <div class="search">
        <van-icon name="search" @click="search_fun()" />
        <input
          placeholder="输入商品名称进行查询"
          v-model.trim="req.productname"
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
import { Field, List, Card, Icon, PullRefresh } from "vant";
Vue.use(Field)
  .use(List)
  .use(Card)
  .use(Icon)
  .use(PullRefresh);
import * as storeTypes from "@/store/store/types";
import * as cartTypes from "@/store/cart/types";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      req: {
        customerid: "",
        enterpriseid: "", //供应商ID
        productname: null
      },
      search_show: false
    };
  },
  computed: {
    ...mapGetters("store", {
      productname: storeTypes.PRODUCTNAME
    })
  },
  watch: {
    "req.productname": {
      deep: true,
      handler(val) {
        // if (val) {
        this.setproductname(val);
        // }
        if (val.length > 0 || val != "") {
          this.search_show = true;
        } else {
          this.search_show = false;
        }
      }
    }
  },
  methods: {
    ...mapMutations("store", {
      setproductname: storeTypes.SETPRODUCTNAME
    }),
    search_fun() {
      // this.setproductname(this.req.productname);
      this.$router.push({
        path: "/purchase/searchresult"
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
  mounted() {
    this.req.productname = this.productname;
    window.onscroll = () => {
      let search = document.getElementById("search");
      if (search) {
        search.style.position = "fixed";
        search.style.top = "0";
      }
    };
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
@import url("./style.less");
</style>
