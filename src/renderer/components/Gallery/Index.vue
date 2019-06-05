<template>
  <div>
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
            <!-- <img src="../../assets/folder.svg" /> -->
            <i class="fa fa-folder-o" aria-hidden="true"></i>
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
        <button type="button" class="btn btn-light sub-menu-btn" @click="unsplash">
          <el-tooltip class="item" effect="dark" content="Unsplash" placement="bottom">
            <i class="fa fa-slack" aria-hidden="true"></i>
            <!-- <img src="~@/assets/unsplash.svg"/> -->
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light sub-menu-btn" v-show="!isRunning" @click="start">
          <el-tooltip class="item" effect="dark" content="开始" placement="bottom">
            <i class="fa fa-play" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light sub-menu-btn" v-show="isRunning" @click="stop">
          <el-tooltip class="item" effect="dark" content="停止" placement="bottom">
            <i class="fa fa-spinner fa-spin fa-fw"></i>
          </el-tooltip>
        </button>
      </div>
    </div>

    <div id="gallery"
         @dragenter.prevent
         @dragover.prevent
         @dragleave.prevent
         @drop.prevent="drop($event)"
         class="card-columns" >
      <!--阻止拖入的浏览器默认行为-->
      <!--阻止拖来拖去的浏览器默认行为-->
      <!--阻止离开时的浏览器默认行为-->
      <div id="gallery-tip" v-show="isImageNull">
        <div id="tip">
          拖入图片或打开
          <button type="button" class="btn btn-link gallery-tip-btn" @click="addFile" >文件</button><span>/</span><button type="button" class="btn btn-link gallery-tip-btn" @click="addDirectory" >目录</button>
        </div>
      </div>
      <!--卡片组-->
      <card/>
    </div>
  </div>
</template>

<script>
  import 'jquery'
  import Vue from 'vue'
  import Unsplash, {toJson} from 'unsplash-js'
  import {mapState, mapActions, mapGetters} from 'vuex';
  const {ipcRenderer} = require('electron')
  import Card from "./Card"

  export default {
    name: "gallery",
    components: {
      Card
    },
    data() {
      return {
        cardId: 0,
        cacheList: [],
        fileType: ['jpg', 'JPG', 'Jpg', 'png', 'PNG', 'jpeg', 'Jpeg', 'ico', 'ICO', 'gif'],
        isRunning: false,
      }
    },
    computed:{
      // tipFlag () {  // 返回的值不符合预期，总是他妈的瞎返回flag，傻逼程序
      //   return this.$store.state.image.tipFlag;
      // }
      ...mapState('image', {
        images: state => state.images,
        crop_info: state => state.crop_info
      }),
      isImageNull() {
        return this.images.length === 0
      }
    },
    methods: {
      addFile() {
        ipcRenderer.send('open-file-dialog');
        ipcRenderer.once('selected-file', (event, files) => {
          files.forEach((file) => {
            if (this.cacheList.indexOf(file) === -1) {
              this.$store.dispatch('image/addImage', {
                id: this.cardId,
                src: file,
                done: true
              })
              this.cacheList.push(file)
              this.cardId ++;
            }
          });
        });
      },

      addDirectory(){
        ipcRenderer.send('open-directory-dialog');
        ipcRenderer.on('selected-directory', (event, files) => {
          files.forEach((src) => {
            if (this.fileType.indexOf(src.split('.').pop()) > -1 && this.cacheList.indexOf(src) === -1) {
              this.$store.dispatch('image/addImage', {
                id: this.cardId,
                src: src,
                done: false
              })
              this.cacheList.push(src)
              this.cardId ++;
            }
          });
        })
      },

      drop(event) {
        const data = event.dataTransfer.files;  // 获取文件对象
        let fileList = [];
        for (let file in data) {
          if (data[file]['path']) {  // 过滤有undefined的数据，该数据来源不明
            fileList.push(data[file]['path'])
          }
        }
        ipcRenderer.send('filter-file-type', fileList);
        ipcRenderer.once('filtered-file-type', (event, files) => {
          files.forEach((src) => {
            if (src) {
              if (this.fileType.indexOf(src.split('.').pop()) > -1 && this.cacheList.indexOf(src) === -1) {
                this.$store.dispatch('image/addImage', {
                  id: this.cardId,
                  src: src,
                  done: false
                })
                this.cacheList.push(src)
                this.cardId ++;
              }
            }
          })
        })
      },
      clearGallery() {
        //清空相册
        this.$store.dispatch('image/clearImages');
        // this.setDragTipSeenFlag(true);
        this.cardIndex = 0;
      },
      unsplash() {
        const unsplash = new Unsplash({
          applicationId: "de1dfd08d18e61f4074716e7204cddbfd5f52b5eb468222c66e2ef45f344d3ed",
          secret: "e63d6039588ec784908ec260432d7ddbcca49273f05c050a5e799c2d7c6853b5"
        })
        unsplash.photos.getRandomPhoto()
          .then(toJson)
          .then(json => {
            // console.log(json)
            // console.log(json.urls.raw)
            let srcList = []
            this.$store.dispatch('image/addImage', {
              id: this.cardId,
              src: json.urls.raw,
              done: true
            })
            this.cardId ++;
          })
      },
      start() {
        this.isRunning = true;
        if(this.images.length !== 0) {
          let file_list = []
          this.images.forEach((image) => {
            file_list.push(image.src)
          })
          console.log(this.crop_info)
          ipcRenderer.sendSync("crop", file_list, this.crop_info);
          ipcRenderer.once("cropped", (event, cropped_images) => {
            cropped_images.forEach((image) => {
              console.log(image)
            })
          })
        } else {
          alert("Add an image before clicking the button.")
        }
        // this.isRunning = false;
      },
      stop() {
        this.isRunning = false;
      },
    },
  }
</script>

<style scoped>
  @import "~bootstrap/dist/css/bootstrap.min.css";
  @import "~font-awesome/css/font-awesome.min.css";

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

  /*相册拖拽提示文字样式*/
  #gallery-tip {
    position: fixed;
    font: 25px "等线";
    color: #CCC;
    left: 26%;
    top: 25%;
    height: 280px;
    width: 450px;
    border: 3px dashed #A3E4D7;
    border-radius: 15px;
    transition: background-color .5s;
  }
  #gallery-tip:hover{
    background-color: #EAEDED;
  }
  #tip {
    margin-top: 27%;
    text-align: center;
  }
  .gallery-tip-btn {
    padding: 0;
    font: 25px "等线";
    color: #ccc;
  }
  .gallery-tip-btn:hover {
    color: cornflowerblue
  }
  #gallery {
    /*相册样式：主要设置图片和周围有个缝隙*/
    position: absolute;
    float: left;
    top: 52px;
    left: 65px;
    padding-right: 20px;
    /* box-sizing: border-box; */
  }
</style>