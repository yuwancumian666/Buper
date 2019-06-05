<template>
  <div>
    <!--副菜单栏：添加、保存、清空 -->
    <div id="sub-menu">
      <div id="themes">
        <span class="theme-selector">选择主题：</span>
        <el-select 
          class="theme-selector"
          size="medium"
          placeholder="选择主题"
          v-model="default_theme" 
          @change="draw_chart">

          <el-option-group
            v-for="group in themes"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </div>
    </div>
    
    <div id="chart">
    </div>
  </div>
</template>

<script>
  const echarts = require('echarts')
  import './themes/chalk'
  import './themes/essos'
  import './themes/halloween'
  import './themes/macarons'
  import './themes/purple-passion'
  import './themes/roma'
  import './themes/vintage'
  import './themes/walden'
  import './themes/westeros'
  import './themes/wonderland'
  import option from './data/option'
import { setTimeout } from 'timers';
  export default {
    name: "chart",
    data() {
      return {
        echarts_themes: [
          'macarons',
          'roma',
          'walden',
          'westeros',
          'wonderland',

          'essos',
          'vintage',

          'chalk',
          'halloween',
          'purple-passion',
        ],
        themes: [
          {
            label: '亮色调',
            options: [
              { value: "macarons",
                label: "macarons" },
              { value: "roma",
                label: "roma" },
              { value: "walden",
                label: "walden" },
              { value: "westeros",
                label: "westeros" },
              { value: "wonderland",
                label: "wonderland" },
            ]
          }, 
          {
            label: '暗色调',
            options: [
              { value: "chalk",
                label: "chalk" },
              { value: "halloween",
                label: "halloween" },
              { value: "purple-passion",
                label: "purple-passion" },
            ]
          }, 
          {
            label: '黄色调',
            options: [
              { value: "essos",
                label: "essos" },
              { value: "vintage",
                label: "vintage" },
            ]
          }
        ],
        default_theme: 'westeros',
        default_chart: []
      }
    },
    methods: {
      draw_chart(theme) {
        /**
         * 只能指定一个主题，要想更改主题必须把之前的chart销毁，但是之前的chart一放到外边就出错
         */
        let show_chart = echarts.init(document.getElementById('chart'), theme, {devicePixelRatio:2});
        show_chart.setOption(option)
      },
    },
    mounted:function() {
      this.draw_chart(this.default_theme)
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
  #themes {
    font-size: 15px;
    position: relative;
    top: 7px;
    left: 10px;
  }
  .theme-selector {
    font:bold 15px 微软雅黑;
  }
  #chart {
    position: absolute;
    float: left;
    top: 60px;
    left: 60px;
    right: 10px;
    bottom: 10px;
  }
  
</style>