<template>
  <div>
    <!--副菜单栏：添加、保存、清空 -->
    <div id="sub-menu">
      <div id="cfg-menu" class="block">
        <span>纵横比：</span>
        <el-cascader
          :options="options"
          size="small"
          v-model="selectedAspectRatio"
          @change="selectAspectRatio">
        </el-cascader>
      </div>
      
      <div id="edit-menu" class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-light menu-btn" @click="drawImageToCanvas">
          <el-tooltip class="item" effect="dark" content="测试" placement="bottom">
            <i class="fa fa-bolt" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light menu-btn" @click="redo">
          <el-tooltip class="item" effect="dark" content="重做" placement="bottom">
            <i class="fa fa-share" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light menu-btn" @click="undo">
          <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
            <i class="fa fa-history" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light menu-btn" @click="undo">
          <el-tooltip class="item" effect="dark" content="取消" placement="bottom" @click="removeCurrentImage">
            <i class="fa fa-times" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light menu-btn" @click="submit">
          <el-tooltip class="item" effect="dark" content="提交" placement="bottom">
            <i class="fa fa-check" aria-hidden="true"></i>
          </el-tooltip>
        </button>
      </div>
    </div>

    <!-- 画布 -->
    <div id="canvas-father">
      <canvas id="Canvas"></canvas>
    </div>
  </div>
    
</template>

<script>
  const {ipcRenderer} =  require('electron');
  import $ from 'jquery'

  export default {
    name: "editor",
    data() {
      return {
        width: 0,
        height: 0,
        options: [
          { value: "original", label: this.getAspectRatioFromImg(),},
          {value: "customize", label: "自定义",},
          {value: "square", label: "正方形",}],
        selectedAspectRatio: ['original'],
      }
    },
    methods: {
      redo() {
        console.log('原始'+this.width+','+this.height)
      },
      undo() {
      },
      submit() {
      },
      selectAspectRatio(value) {
        console.log(value)
      },
      getAspectRatioFromImg() {
        var wid = 1;
        this.width = 3;
        this.height = 2;
          return '原始 - '+this.width+':'+this.height
      },
      removeCurrentImage() {
      },
      drawImageToCanvas() {
        // let file = new File([""], "")
        let path = "C:\\Users\\Administrator\\桌面\\明帝一号.png";
        ipcRenderer.send('read-image', path);
        ipcRenderer.on('base64-image', (event, image) => {
          let img = new Image();
          let imagePrefix = "data:image/jpeg;base64,";
          img.src = imagePrefix + image;
          img.onload = function() {
            let canvas = $('#Canvas')[0];
            let cxt = canvas.getContext('2d');
            cxt.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            console.log(img.width, img.height)
          }
        })
      }
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
    /* float: right; */
    height: 50px;
    left: 50px;
    right: 0;
    z-index: 1;
  }
  #cfg-menu {
    font-size: 14px;
    position: absolute;
    margin-top: 9px;
    margin-left: 10px;
  }
  #edit-menu {
    position: absolute;
    top: 0;
    right: 0;
  }
  .menu-btn {
    /*副菜单栏：添加、保存、清空 按钮的宽高和字体大小*/
    padding-top: 0;
    background-color: #EAECEE;
    font-size: 20px;
    height: 50px;
    width: 70px;
    border-bottom: 20px
  }
  #canvas-father {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 0;
    bottom: 5px; /*没这个会出现垂直滚动条*/
  }
  #Canvas {
    width: 100%;
    height: 100%;
    border: 1px solid black;
    /* background-color:blanchedalmond; */
  }

</style>