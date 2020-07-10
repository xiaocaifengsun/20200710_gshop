<template>
  <img :src="src" @error="errorFn($event)" />
</template>
<script>
export default {
  props: {
    src: {
      default: ""
    },
    err: {
      default: require("@/static/imgs/def-img.png")
    }
  },
  data() {
    return {};
  },
  methods: {
    errorFn(event) {
      let img = event.srcElement;
      img.src = this.err;
      img.onerror = null; //防止闪图
    }
  }
};
</script>