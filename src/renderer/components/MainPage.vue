<template>
  <div id="wrapper">
    <div id="menu">
      <!-- 上方按钮组 -->
      <div id="top-group" class="btn-group-vertical btn-group-toggle" data-toggle="buttons">
        <label class="btn btn-dark active" @click="toGallery" ref="gallery">
          <input type="radio" name="options" id="option1" autocomplete="off">
          <i class="fa fa-picture-o fa-lg" aria-hidden="true"></i>
        </label>
        <label class="btn btn-dark" @click="toEditor" ref="editor">
          <input type="radio" name="options" id="option2" autocomplete="off"> 
          <i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i>
        </label>
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
    <!-- <gallery/> -->
    <!-- 路由一下 -->
    <router-view></router-view>
  </div>
</template>

<script>
  import $ from 'jquery'
  import 'popper.js'
  import 'bootstrap'
  import Vue from 'vue'
  import { router, VueRouter } from 'vue-router'
  const ipcRenderer = require('electron')
  

  export default {
    name: 'main-page',
    methods: {
      handleChange(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      toGallery() {
        this.$router.push({path: '/gallery'})
      },
      toEditor() {
        this.$router.push({path: '/editor'})
      },
    }
  };
// (function () {
//     $().button('toggle')
//     $().button('dispose')
//   })
  
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
    /* -webkit-app-region: drag; */
  }
  ::-webkit-scrollbar {
    /* 隐藏滚动条，马勒个比 */
	  width: 0;
    height: 0;
  }

  #menu {
    position: fixed;
    background-color: #343a40; /*#262525*/
    width: 50px;
    float: left;
    height: 100%;
    z-index: 2;
  }
  #top-group {
    width: 100%
  }

  #btm-group {
    position: absolute;
    bottom: 0;
  }
  #btm-group > button {
    /*主菜单栏-下方：设置、关于 按钮的宽高和字体大小*/
    background-color: #343a40;
    width: 50px;
    height: 70px;
    font-size: 22px;
   }

  .btn{
    border: 0;
    line-height: 58px;
  }
  .btn:focus,.btn:active {
    /*去掉按钮的边框阴影*/
   outline: none !important;
   box-shadow: none;
  }
  label.btn.focus {
   /**去掉单选按钮的边框阴影 https://stackoverflow.com/questions/49698698/accessing-bootstrap-radio-buttons */
   background-color: #F8F9F9;
   box-shadow: none;
  }
  .btn-dark:not(:disabled):not(.disabled).active {
    color: #448AFF;
    background-color: #1d2114;
  }

</style>

