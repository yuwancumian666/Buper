<template>
  <div id="wrapper">
    <div id="menu">
      <!-- 上方按钮组 -->
      <div id="top-group" class="btn-group-vertical" role="group" aria-label="Button group with nested dropdown">
        <button type="button" class="btn btn-dark top-btn" disabled>
          <i class="fa fa-picture-o" aria-hidden="true"></i>
        </button>
        <button type="button" class="btn btn-dark top-btn">
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
        <button type="button" class="btn btn-dark top-btn">
          <i class="fa fa-area-chart" aria-hidden="true"></i>
        </button>
      </div>
      <!-- 下方按钮组：设置&关于 -->
      <div id="btm-group" class="btn-group-vertical" role="group">
        <button type="button" class="btn btn-dark btm-btn">
          <i class="fa fa-sliders" aria-hidden="true"></i>
        </button>
        <button class="btn btn-dark btm-btn">
          <i class="fa fa-question-circle-o" aria-hidden="true"></i><br>
        </button>
      </div>
    </div>
    <!--相册 含菜单-->
    <gallery/>
  </div>
</template>

<script>
  import $ from 'jquery'
  import 'popper.js'
  import 'bootstrap'
  import Vue from 'vue';

  import Gallery from "./Gallery/Gallery.vue"
  const { ipcRenderer } = require('electron');

  export default {
    name: 'main-page',
    components: {
      Gallery
    },
    data() {
      return {
        // dragTipSeenFlag: this.dragTipSeenFlag,
        // cardHeaderCheck: this.cardHeaderCheck,
        // cardIndex: this.cardIndex,
        // imageArray: this.imageArray
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, path);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      imageArrayIsNull() {
        return Object.keys(this.imageArray).length === 0
      },

      // unique(array) {
      //   /*数组去重*/
      //   return array.concat().sort().filter(function(item, index, array){
      //     return !index || item !== array[index - 1]
      //   })
      // },
   },
  }

  $(function () {
    $("[data-toggle='tooltip']").tooltip({html: true});
  });
</script>

<style>
  @import "~bootstrap/dist/css/bootstrap.min.css";
  @import "~font-awesome/css/font-awesome.min.css";

  html, body{
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 等线,serif;
    background-color: #F8F9F9;
    -webkit-app-region: no-drag;
  }

  .btn{
    border: 0;
    line-height: 58px;
  }

  #menu {
    position: fixed;
    background-color: #262525;
    width: 50px;
    float: left;
    height: 100%;
  }
  #top-group {

  }
  #top-group > button {
    /*主菜单栏-上方：相册、编辑、图表 按钮的宽高和字体大小*/
    background-color: #262525;
    width: 50px;
    height: 70px;
    font-size: 22px;
  }
  #btm-group {
    position: absolute;
    bottom: 0;
  }
  #btm-group > button {
    /*主菜单栏-下方：设置、关于 按钮的宽高和字体大小*/
    background-color: #262525;
    width: 50px;
    height: 70px;
    font-size: 22px;
   }

</style>

