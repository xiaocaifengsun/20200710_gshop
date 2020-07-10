<template>
  <div id="app">
    <router-view/>
    <FooterGuide v-show="$route.meta.showFooter"/>
  </div>
</template>

<script>
import FooterGuide from '../src/components/FooterGuide/FooterGuide';
export default {
  components: {
    FooterGuide
  }
}
</script>

<style lang="stylus" scoped>
  #app
    width 100%
    height 100%
    background #f5f5f5
    position relative
</style>
