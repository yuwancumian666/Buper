<template>
  <div id="wrapper">
    <div id="menu">
      <!-- 上方按钮组 -->
      <div id="top-group" class="btn-group-vertical" role="group" aria-label="Button group with nested dropdown">

        <button type="button" class="btn btn-dark top-btn">
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

    <!--副菜单栏：添加、保存、清空 -->
    <div id="sub-menu">
      <div id="sub-menu-group" class="btn-group" role="group" aria-label="Basic example">

        <button type="button" class="btn btn-light sub-menu-btn" @click="addFile">
          <el-tooltip class="item" effect="dark" content="添加文件" placement="bottom">
            <i class="fa fa-file-image-o" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light sub-menu-btn" @click="addDirectory">
          <el-tooltip class="item" effect="dark" content="添加目录" placement="bottom">
            <i class="fa fa-folder-open-o" aria-hidden="true"></i>
          </el-tooltip>
        </button>

        <div class="btn-group" role="group">
          <button type="button" class="btn btn-light dropdown-toggle sub-menu-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-download" aria-hidden="true"></i>
          </button>
          <div class="dropdown-menu" aria-labelledby="btnGroupDrop1" >
            <a class="dropdown-item" href="#">覆盖保存</a>
            <a class="dropdown-item" href="#">导出...</a>
          </div>
        </div>
        <button type="button" class="btn btn-light sub-menu-btn" @click="clearGallery">
          <el-tooltip class="item" effect="dark" content="清空相册" placement="bottom">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </el-tooltip>
        </button>
      </div>
    </div>

    <div id='drop-area'
         @dragenter.prevent
         @dragover.prevent
         @dragleave.prevent
         @drop.prevent="drop($event)">
        <!--阻止拖入的浏览器默认行为-->
        <!--阻止拖来拖去的浏览器默认行为-->
        <!--阻止离开时的浏览器默认行为-->
      <div id="drop-area-tip" v-show="dragTipSeenFlag">
        <span>拖入图片或打开</span>
        <button type="button" class="btn btn-link drop-area-btn" @click="addFile" >文件</button><span>/</span><button type="button" class="btn btn-link drop-area-btn" @click="addDirectory" >目录</button>
      </div>
      <div id="gallery" class="card-columns" v-show="!dragTipSeenFlag">
          <!-- 自己设置的卡片组，
            在 ↑ #gallery(id名)没有使用.card-columns(类名)的时候图片的定位有问题：
            宽>高 => 图片不能居中
            高>宽 => 图片突破容器高度，向下伸出一大截。
            现在↑ #gallery div 设置了.card-columns后，状态和原生的差不多了，图片就多个padding，显示的小一点
           -->
          <!--<div v-bind:id="'card_'+generateId(index1)" class="card bg-light" v-for="(i, index1) in imageArray.length" :key="index1">-->
            <!--<div class="card-header bg-transparent border-success bg-dark">-->
              <!--<div class="card-header-check">-->
                <!--<el-tooltip class="item" effect="dark" content="已处理" placement="bottom">-->
                  <!--<i class="fa fa-smile-o text-success" aria-hidden="true" v-show="cardHeaderCheck"></i>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip class="item" effect="dark" content="未处理" placement="bottom">-->
                  <!--<i class="fa fa-meh-o text-warning" aria-hidden="true" v-show="!cardHeaderCheck"></i>-->
                <!--</el-tooltip>-->
              <!--</div>-->
              <!--<div class="card-header-save">-->
                <!--<el-tooltip class="item" effect="dark" content="保存" placement="bottom">-->
                  <!--<i class="el-icon-download"></i>-->
                <!--</el-tooltip>-->
              <!--</div>-->
              <!--<div class="card-header-close">-->
                <!--&times;-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="card-body">-->
              <!--<img class="card-img" v-bind:src="generateCardImgSrc(index1)" alt="Card image">-->
            <!--</div>-->
          <!--</div>-->
        <transition-group name="list-complete" tag="div">
          <div
              v-for="(value, key, srcIndex) in imageArray"
              v-bind:key="'key'+value"
              class="card bg-light list-complete-item"
              v-bind:id="'card_'+value"
               v-if="showCard" >
            <div class="card-header bg-transparent border-success">
              <div class="card-header-check">
                <el-tooltip class="item" effect="dark" content="已处理" placement="bottom">
                  <i class="fa fa-smile-o text-success" aria-hidden="true" v-show="cardHeaderCheck"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="未处理" placement="bottom">
                  <i class="fa fa-meh-o text-warning" aria-hidden="true" v-show="!cardHeaderCheck"></i>
                </el-tooltip>
              </div>
              <div class="card-header-save">
                <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
                  <i class="el-icon-download"></i>
                </el-tooltip>
              </div>
              <div class="card-header-close" @click="removeCard($event)">  <!---->
                &times;
              </div>
            </div>
            <img class="card-img" v-bind:src="key" alt="Card image">
          </div>
        </transition-group>
      </div>

    </div>
  </div>
</template>

<script>
  import jQuery from 'jquery'
  import 'bootstrap'
  import Vue from "vue";
  const { ipcRenderer } = require('electron');
  export default {
    name: 'main-page',
    data() {
      return {
        dragTipSeenFlag: true,
        cardHeaderCheck: false,
        showCard: true,
        cardIndex: 0,
        cardImgSrc: "",
        imageArray:{},
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, path);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      addURL(urls) {
        urls.forEach((url) => {
          Vue.set(this.imageArray, url, this.cardIndex);
          this.cardIndex++;
          // console.log({"typeof file": typeof url, "file": url, "cardIndex": this.cardIndex})
        });
        console.log("我有几个女人？", this.imageArray);
      },
      drop(event) {
        console.log("method-drop");
        const data = event.dataTransfer.files;  // 获取文件对象
        let fileType = ['jpg', 'JPG', 'Jpg', 'png', 'PNG', 'jpeg', 'Jpeg', 'ico', 'ICO', 'gif'];
        if (data.length < 1) {
          return;  // 检测是否有文件拖拽到页面
        }
        let fileList = [];
        for (let file in data) {
          let src = data[file]['path'];
          if (src) {
            let fileTypeFlag = fileType.indexOf(src.split('.').pop());  // 过滤文件类型
            if (fileTypeFlag > -1){
              fileList.push(data[file]['path'])
            }
          }
        }
        ipcRenderer.send('fuckDrop', fileList);
        console.log("send fuck");
        ipcRenderer.on('dropFuck', (event, files) => {
          this.addURL(files);
        });
        // for (let file in data) {
        //   var src = data[file]['path'];
        //   if (src) {
        //     let fileTypeFlag = fileType.indexOf(src.split('.').pop());  // 过滤文件类型
        //     if (fileTypeFlag > -1) {
        //       // Vue.set(this.imageArray, data[file]['path'], this.cardIndex);
        //       this.imageArray = Object.assign({}, this.imageArray, {[src]: this.cardIndex});
        //       this.cardIndex ++;
        //     }
        //   }
        // }
        console.log("王的女人:", this.imageArray)
      },
      addFile() {
        ipcRenderer.send('open-file-dialog');
        ipcRenderer.on('selected-file', (event, files) => {
          // console.log("openFileDialog: ", typeof path);  // path: object Buter & Buper
          if (files.length !== 0) {
            this.dragTipSeenFlag = false;
          }
          this.addURL(files)
          // files.forEach((file) => {
          //   Vue.set(this.imageArray, file, this.cardIndex);
          //   this.cardIndex ++;
          //   // console.log({"typeof file": typeof file, "file": file, "cardIndex": this.cardIndex})
          // });
        });
        console.log("我有几个女人？", this.imageArray);
        // console.log("我有几个元素？", this.imageArray.length);  //对象没有长度
      },

      addDirectory() {
        ipcRenderer.send('open-directory-dialog');
        ipcRenderer.on('selected-directory', (event, files) => {
          if (files.length !== 0) {
            this.dragTipSeenFlag = false;
          }
        })
      },

      // generateId(index) {
      //   return index;
      // },
      //
      // generateCardImgSrc(index) {
      //   console.log("get src: " + this.imageArray[index])
      //   return this.imageArray[index];
      // },

      // unique(array) {
      //   /*数组去重*/
      //   return array.concat().sort().filter(function(item, index, array){
      //     return !index || item !== array[index - 1]
      //   })
      // },

      removeCard(event) {
        let cardId = $(event.currentTarget).parent().parent().attr('id');
        let index = Number(cardId.split('_')[1]);
        console.log(index);
        /**
         * TODO 获取到card的id了，找到imageArray中对应的url，然后删除。
         * 需要注意的是：应该把imageArray换成json（也可能不需要，应该需要），
         * 方便更新列表，反正注意id和imageArray中的url一一对应，因为要是删除一个，
         * 后边的url会挤到前边导致错位。
         */
        Object.keys(this.imageArray).forEach((key) => {
          if (this.imageArray[key] === index) {
            Vue.delete(this.imageArray, key)
          }
          if (Object.keys(this.imageArray).length === 0) {
            this.dragTipSeenFlag = true
          }
        })
      },
      clearGallery() {
        //清空相册
        this.imageArray = {};
        this.dragTipSeenFlag = true;
      },

   },
    // mounted() {
    //   let dropArea = document.getElementById('drop-area');
    //
    //   dropArea.ondragleave = (event) => {
    //     event.preventDefault();  //阻止离开时的浏览器默认行为
    //     // console.log("mounted-ondragleave")
    //   };
    //
    //   dropArea.ondrop = (event) => {
    //     event.preventDefault();    //阻止拖放后的浏览器默认行为
    //     // console.log("mounted-ondrop");
    //
    //     const data = event.dataTransfer.files;  // 获取文件对象
    //     let fileType = ['jpg', 'JPG', 'Jpg', 'png', 'PNG', 'jpeg', 'Jpeg', 'ico', 'ICO'];
    //     if (data.length < 1) {
    //       return;  // 检测是否有文件拖拽到页面
    //     }
    //     for (let file in data) {
    //       let dir = data[file]['path'];
    //       if (dir) {
    //         let fileTypeFlag = fileType.indexOf(dir.split('.').pop());  // 过滤文件类型
    //         if (fileTypeFlag > -1) {
    //           Vue.set(this.imageArray, data[file]['path'], this.cardIndex);
    //           this.cardIndex ++;
    //           console.log(this.cardIndex + "--" + data[file]['path']);
    //         }
    //       }
    //     }
    //     console.log(this.imageArray)
    //     // console.log("this.imageArray: " + this.imageArray);
    //   };
    //
    //   dropArea.ondragenter = (event) => {
    //     event.preventDefault();  //阻止拖入时的浏览器默认行为
    //     // ipcRenderer.send('dragenter', __filename);
    //     // console.log("mounted-ondragenter")
    //   };
    //
    //   dropArea.ondragover = (event) => {
    //     event.preventDefault();    //阻止拖来拖去的浏览器默认行为
    //   };
    // },
  }

  $(function () {
    $("[data-toggle='tooltip']").tooltip({html: true});
  });


</script>


<style>
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
    background-color: #212F3D;
    width: 50px;
    float: left;
    height: 100%;
  }
  #top-group {

  }
  #top-group > button {
    /*主菜单栏-上方：相册、编辑、图表 按钮的宽高和字体大小*/
    background-color: #212F3D;
    width: 50px;
    height: 70px;
    font-size: 22px;
  }
  .dropdown-menu {
    /*min-width: 100%;*/
  }
  #btm-group {
    position: absolute;
    bottom: 0;
  }
  #btm-group > button {
    /*主菜单栏-下方：设置、关于 按钮的宽高和字体大小*/
    background-color: #212F3D;
    width: 50px;
    height: 70px;
    font-size: 22px;
   }
  #sub-menu {
    /*副菜单栏样式*/
    position: fixed;
    background-color: #EAECEE;
    float: left;
    height: 50px;
    left: 50px;
    right: 0;
    z-index: 1;
  }
  /*
  #sub-menu-group {
    position: absolute;
  }
  */
  .sub-menu-btn {
    /*副菜单栏：添加、保存、清空 按钮的宽高和字体大小*/
    padding-top: 0;
    background-color: #EAECEE;
    font-size: 20px;
    height: 50px;
    width: 70px;
  }
  .dropdown-menu {
    min-width: 6rem;
    font-size: 15px;
  }

  #drop-area {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 0;
    z-index: 0;
  }
  /*相册拖拽提示文字样式*/
  #drop-area-tip {
    font: 30px "等线";
    color: #CCC;
    text-align: center;
    line-height: 450px;
  }
  .drop-area-btn {
    padding: 0;
    font: 30px "等线";
    color: #ccc;
  }
  #gallery {
    /*相册样式：主要设置图片和周围有个缝隙*/
    position: absolute;
    top: 9px;
    left: 9px;
    right: 9px;
    bottom: 0;
  }

  /*#gallery>div {*/
    /*position: relative;*/
    /*float: top;*/
    /*margin: 4px;*/
  /*}*/
   .card {
     border: 0;
     box-shadow: 0 1px 2px rgba(0,0,0,0.2);
     /*transition: box-shadow 0.4s ease-in-out;*/
     /*hover阴影和vue的冲突*/
     transition: all 1s;
   }
  .card-columns {
    @include media-breakpoint-only(lg)
      column-count: 4;
    @include media-breakpoint-only(xl)
      column-count: 5;
  }
   .card:hover {
     box-shadow: 0 3px 16px rgba(0,0,0,0.55);
   }
   /*卡片动画效果*/
  .list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
  }
  .list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-complete-leave-active {
    position: absolute;
  }

  .card-header {
     border: 0;
     padding: 0;
   }
  /*.bg-transparent {
    /决bootstrap颜色被覆盖
     background-color: #5a6268 !important;
  }*/
   .card-header-check{
     position: relative;
     float: left;
     text-align: center;
     font-size: 21px;
     font-weight: bold;
     width: 30px;
   }
   .card-header-save {
     position: relative;
     float: left;
     text-align: center;
     font-size: 21px;
     width: 30px;
   }
   .card-header-save:hover {
     background-color: #A569BD;
     color: #FFFFFF;
     border-radius: 6px 0;
   }
   .card-header-close {
     position: relative;
     float: right;
     text-align: center;
     font-size: 21px;
     font-weight: bold;
     width: 30px;
   }
   .card-header-close:hover {
     background-color: #C2185B;
     color: #FFFFFF;
     border-radius: 0 6px;
   }
  /*
   .card-body {
     width: 13rem;
     height: 13rem;
     display: table-cell;
     vertical-align: middle;
     text-align: center;
     padding: 10px;
   }
   .card-body>img {
     /*position: relative;
     /*padding: auto;
     vertical-align: middle;
   }
    .tooltip-inner {
      font-size: 13px;
    }
    */

</style>

