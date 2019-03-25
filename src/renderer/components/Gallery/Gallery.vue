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

    <div id="gallery"
         @dragenter.prevent
         @dragover.prevent
         @dragleave.prevent
         @drop.prevent="drop($event)"
         class="card-columns" >
      <!--阻止拖入的浏览器默认行为-->
      <!--阻止拖来拖去的浏览器默认行为-->
      <!--阻止离开时的浏览器默认行为-->
      <div id="gallery-tip" v-show="dragTipSeenFlag">
        <div id="tip">
          拖入图片或打开
          <button type="button" class="btn btn-link gallery-tip-btn" @click="addFile" >文件</button><span>/</span><button type="button" class="btn btn-link gallery-tip-btn" @click="addDirectory" >目录</button>
        </div>
      </div>
      <!--卡片组-->
      <card
          :image_array="imageArray"
          @get_image_array="getImageArray"
          :drag_tip_seen_flag.sync="dragTipSeenFlag"
          @get_drag_tip_seen_flag="getDragTipSeenFlag"
      />
    </div>
  </div>
</template>

<script>
  import 'jquery'
  import Vue from 'vue'
  import Card from "./Card"
  const {ipcRenderer} = require('electron');

  export default {
    name: "gallery",
    components: {
      Card
    },
    data() {
      return {
        dragTipSeenFlag: true,
        showCard: true,
        cardIndex: 0,
        cardImgSrc: "",
        imageArray: {},
        fileType: ['jpg', 'JPG', 'Jpg', 'png', 'PNG', 'jpeg', 'Jpeg', 'ico', 'ICO', 'gif'],
      }
    },
    methods: {
      // 从子组件获取更改后的变量
      getImageArray(imagearray) {
        this.imageArray = imagearray;
      },
      getDragTipSeenFlag(dragtipseenflag) {
        this.dragTipSeenFlag = dragtipseenflag;
      },
      // 本地函数
      addFile() {
        ipcRenderer.send('open-file-dialog');
        ipcRenderer.on('selected-file', (event, files) => {
          // console.log("openFileDialog: ", typeof path);  // path: object Buter & Buper
          if (files.length !== 0) {
            this.dragTipSeenFlag = false;
          }
          files.forEach((src) => {
            /**
             * imageArray使用对象的一点好处：
             * 这里添加src的时候会有重复，具体表现为：
             * 第一次打开对话框选择一个图片，会有一个src进来
             * 再打开对话框选择一个，会进来两个相同的，再打开会有三个
             * 尝试了N种方法，仍然找不到原因。
             *  */ 
            Vue.set(this.imageArray, src, this.cardIndex);
            this.cardIndex ++;
          });
        });
        console.log("我有几个女人？", this.imageArray);
      },
      addDirectory(){
        ipcRenderer.send('open-directory-dialog');
        ipcRenderer.on('selected-directory', (event, files) => {
          if (files.length !== 0) {
            this.dragTipSeenFlag = false;
          }
          // console.log(files);
          files.forEach((src) => {
            if (this.fileType.indexOf(src.split('.').pop()) > -1) {
              console.log(src);
              Vue.set(this.imageArray, src, this.cardIndex);
              this.cardIndex ++;
            }
          });
        })
      },
      drop(event) {
        console.log("method-drop");
        const data = event.dataTransfer.files;  // 获取文件对象
        let fileList = []
        for (let file in data) {
          if (data[file]['path']) {  // 过滤有undefined的数据，该数据来源不明
            fileList.push(data[file]['path'])
          }
        }
        console.log(typeof fileList)
        console.log(fileList)
        ipcRenderer.send('filter-file-type', fileList);
        ipcRenderer.on('filtered-file-type', (event, files) => {
          files.forEach((src) => {
            if (src) {
              if (this.fileType.indexOf(src.split('.').pop()) > -1) {
                Vue.set(this.imageArray, src, this.cardIndex);
                this.cardIndex ++;
                // 之所以把这个flag放到这里而不是循环外，
                // 是因为只有图像格式的文件才能进入这个if，
                // 只有这样才能把拖拽提示文字去掉。
                this.dragTipSeenFlag = false;
              }
            }
          })
        })
      },
      clearGallery() {
        //清空相册
        console.log("clear gallery");
        this.imageArray = {};
        this.dragTipSeenFlag = true;
        this.cardIndex = 0;
      },
    }
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
  #gallery {
    /*相册样式：主要设置图片和周围有个缝隙*/
    position: absolute;
    top: 52px;
    left: 60px;
    right: 0;
  }
</style>