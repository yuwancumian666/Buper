<template>
  <!-- 自己设置的卡片组，
            在 ↑ #gallery(id名)没有使用.card-columns(类名)的时候图片的定位有问题：
            宽>高 => 图片不能居中
            高>宽 => 图片突破容器高度，向下伸出一大截。
            现在↑ #gallery div 设置了.card-columns后，状态和原生的差不多了，图片就多个padding，显示的小一点
           -->
  <!--<div v-bind:id="'card_'+generateId(index1)" class="card bg-light" v-for="(i, index1) in image_array.length" :key="index1">-->
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
    <div v-for="(value, key) in image_array"
         v-bind:key="'key'+value"
         class="card bg-light list-complete-item"
         v-bind:id="'card_'+value"
    >
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
        <div class="card-header-close" @click="removeCard($event)">&times;</div>
      </div>
      <img class="card-img" v-bind:src="key" alt="Card image">
    </div>
  </transition-group>
</template>

<script>
  import $ from 'jquery'
  import Vue from 'vue'
  export default {
    name: "card",
    data() {
      return {
        cardHeaderCheck: false,
      }
    },
    props: ['image_array', 'drag_tip_seen_flag'],
    methods: {
      removeCard(event) {
        console.log('removeCard');
        let cardId = $(event.currentTarget).parent().parent().attr('id');
        let index = Number(cardId.split('_')[1]);
        console.log(index);
        /**
         * TODO 获取到card的id了，找到image_array中对应的url，然后删除。
         * 需要注意的是：应该把image_array换成json（也可能不需要，应该需要），
         * 方便更新列表，反正注意id和image_array中的url一一对应，因为要是删除一个，
         * 后边的url会挤到前边导致错位。
         */
        Object.keys(this.image_array).forEach((key) => {
          if (this.image_array[key] === index) {
            Vue.delete(this.image_array, key);
            this.$emit('get_image_array', this.image_array)
          }
          if (Object.keys(this.image_array).length === 0) {
            this.$emit('get_drag_tip_seen_flag', true)
          }
        })
      },
    }
  }
</script>

<style scoped>
  @import "~bootstrap/dist/css/bootstrap.min.css";

  .card {
    border: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    /*transition: box-shadow 0.4s ease-in-out;*/
    /*解决bootstrap.card-columns>.card加CSS阴影后
    card[1,2]和card[1,3]上方阴影被截取到前一列最下方*/
    margin-top: 8px;
    /*hover阴影和vue的冲突*/
    transition: all 1s;
  }
  /*.card-columns {*/
  /*@include media-breakpoint-only(lg)*/
  /*column-count: 4;*/
  /*@include media-breakpoint-only(xl)*/
  /*column-count: 5;*/
  /*}*/
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
</style>