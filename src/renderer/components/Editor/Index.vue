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
        <button type="button" class="btn btn-light menu-btn" @click="redo" disabled>
          <el-tooltip class="item" effect="dark" content="重做" placement="bottom">
            <i class="fa fa-share" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light menu-btn" @click="undo" disabled>
          <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
            <i class="fa fa-history" aria-hidden="true"></i>
          </el-tooltip>
        </button>
        <button type="button" class="btn btn-light menu-btn" @click="removeCurrentImage">
          <el-tooltip class="item" effect="dark" content="取消" placement="bottom">
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
    <div id="box"
      @mousedown.prevent="mouseDown($event)"
      @mouseup.prevent="mouseUp($event)"
    >
      <img id="img" v-bind:src="current_image"/>
    </div>
  </div>
    
</template>

<script>
  const {ipcRenderer} =  require('electron');
  import $ from 'jquery'
  import { mapState } from 'vuex';

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
        /** 选取框相关
         *  startX, startY 为鼠标点击时初始坐标
         * diffX, diffY 为鼠标初始坐标与 box 左上角坐标之差，用于拖动
         * dragging 是否拖动，初始为 false
         */ 
        dragging: false
      }
    },
    computed: {
      ...mapState('image', {
        current_image: state => state.current_image
      })
    },
    methods: {
      redo() {
        console.log('原始'+this.width+','+this.height)
      },
      undo() {
      },
      submit() {
        let box = document.getElementsByClassName("box")[0];
        let img = document.getElementById('img');
        let scaling_ratio = ((img.naturalWidth/img.width) + (img.naturalHeight/img.height))/2;
        try {
          this.$store.dispatch('image/setCropInfo', {
            x: Math.round(Number(box.style.left.replace('px', '')) * scaling_ratio),
            y: Math.round(Number(box.style.top.replace('px', '')) * scaling_ratio),
            width: Math.round(Number(box.style.width.replace('px', '')) * scaling_ratio),
            height: Math.round(Number(box.style.height.replace('px', '')) * scaling_ratio)
          })
        } catch(err) {
          alert("你还没有标注出选框")
        }
        
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
        this.$store.dispatch('image/removeCurrentImage')
      },
      // 选择框相关
      mouseDown(e) {
        // console.log("mouse down")
        let box = e.currentTarget;
        let startX = e.pageX;
        let startY = e.pageY;
        let x1 = e.clientX - box.offsetLeft;
        let y1 = e.clientY - box.offsetTop;
        let diffX, diffY;
        if (e.target.className.match(/box/)) {
          this.dragging = true
          if (document.getElementById("moving_box") !== null) {
            document.getElementById("moving_box").removeAttribute("id")
          }
          e.target.id = "moving_box";
          diffX = startX - e.target.offsetLeft;
          diffY = startY - e.target.offsetTop;
        } else {
          // 删除之前的框框
          let oldStableBox = document.getElementById("stable_box")
          let oldStMovingBox = document.getElementById("moving_box")
          if (oldStableBox !== null) {
            box.removeChild(oldStableBox);
          } else if (oldStMovingBox !== null) {
            box.removeChild(oldStMovingBox);
          }

          let active_box = document.createElement("div");
          active_box.id = "active_box";
          active_box.className = "box";
          box.appendChild(active_box)
        };
        box.onmousemove = (e) => {
          let x2 = e.clientX - box.offsetLeft;
          let y2 = e.clientY - box.offsetTop;
          if (document.getElementById("active_box") !== null) {
            active_box.style.left = (x2 > x1 ? x1 : x2) + 'px';
            active_box.style.top = (y2 > y1 ? y1 : y2) + 'px';
            active_box.style.width = Math.abs(x2-x1) + 'px';
            active_box.style.height = Math.abs(y2-y1) + 'px';
            active_box.style.position = "absolute";
            active_box.style.backgroundColor = "#CCFFFF";
            active_box.style.border = "1px solid #0099FF";
            active_box.style.filter = "alpha(opacity=50);";
            active_box.style.opacity = "0.5";
            active_box.style.cursor = "move";
          }
          if (document.getElementById("moving_box") !== null && this.dragging) {
            var mb = document.getElementById("moving_box");
            mb.style.top = ((e.pageY - diffY) > 0 ? (e.pageY - diffY) : 0) + 'px';
            mb.style.left = ((e.pageX - diffX) > 0 ? (e.pageX - diffX) : 0) + 'px';
          };
        }
        return false; //解除在划动过程中鼠标样式改变的BUG
      },
      mouseUp(e) {
        // console.log("mouse up")
        this.dragging = false;
        if (document.getElementById("active_box") !== null) {
          var ab = document.getElementById("active_box");
          ab.id = "stable_box"
          if (ab.offsetWidth < 3 || ab.offsetHeight < 3) {
            box.removeChild(ab);
          }
        }
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
    /* border-bottom: 20px */
  }
  #box {
    position: absolute;
    top: 60px;
    left: 60px;
    /* right: 0; */
    margin: 0 auto;
    bottom: 10px; /*没这个会出现垂直滚动条*/
    display: inline-block;
    text-align: center;
  }
  #img {
    height: 100%;
    display: inline-block;
    text-align: center;
  }
  /* #stable_box {
    background-color: #f00;
    width: 0px;
    height: 0px;
    position: absolute;
    opacity: 0.5;
    cursor: move;
  } */

</style>