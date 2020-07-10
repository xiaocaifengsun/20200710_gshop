<template>
  <div id="app">
    <div class="main_wrapper">
      <template v-if="ENTID">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!--全局遮罩层-->
        <x-loading v-if="showLoadingOverlay" />
      </template>
      <error-page v-if="!ENTID && showErrorPage"></error-page>
    </div>
    <tab-bar v-bind:active="$route.name" v-if="$route.meta.level==1 && ENTID"></tab-bar>
  </div>
</template>
<script>
import tabBar from "@/components/x-tabbar";
import errorPage from "@/views/other/404";
import appMixins from "./app-mixin";
import Vue from "vue";
import * as types from "@/store/root/types";
import { mapGetters, mapActions } from "vuex";
import xLoading from "@/components/x-loading.vue";
export default {
  name: "app",
  data() {
    return {
      showErrorPage: false
    };
  },
  computed: {
    ...mapGetters({
      showLoadingOverlay: types.SHOWLOADING
    })
  },
  components: {
    errorPage,
    tabBar,
    xLoading
  },
  mixins: [appMixins],
  mounted() {
    this.focus_fun();
  },
  methods: {
    focus_fun() {
      var winHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      window.onresize = function() {
        var thisHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let footer = document.getElementById("footer");
        if (footer != null) {
          if (winHeight - thisHeight > 120) {
            footer.style.display = "none";
          } else {
            footer.style.display = "flex";
          }
        }
        let settlement = document.getElementById("settlement");
        if (settlement != null) {
          if (winHeight - thisHeight > 120) {
            settlement.style.display = "none";
          } else {
            settlement.style.display = "block";
          }
        }
        let footer_btn = document.getElementById("footer_btn");
        if (footer_btn != null) {
          if (winHeight - thisHeight > 120) {
            footer_btn.style.display = "none";
          } else {
            footer_btn.style.display = "block";
          }
        }

        // document.getElementsByTagName("body")[0].style.height = window.screen.height+"px";
      };
    }
  }
};
</script>
<style lang="less" scoped>
.van-overlay-diy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 998;
}
</style>
