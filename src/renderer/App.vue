<template>
  <div id="app">
    <router-view></router-view>
    <buter-dragger/>
  </div>
</template>

<script>
  import ButerDragger from "./components/Dragger/Index";

  export default {
    name: 'buter-app',
    components: {
      ButerDragger
      // [ButerDragger.name]: ButerDragger
    }
  }
</script>

<style>
  /* CSS */
</style>
