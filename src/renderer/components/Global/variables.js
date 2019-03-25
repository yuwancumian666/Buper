'use strict';

import Vue from 'vue'


// let dragTipSeenFlag = true;   // 控制拖拽区域的提示是否显示
// let cardHeaderCheck = false;  // 显示该卡片中的图片是否已处理
// let showCard = true;          // 控制卡片是否显示，debug的时候加入的，现在没有用到这个变量
// let cardIndex = 0;            // 卡片的编号
// let cardImgSrc = "";          // 图片的url，debug的时候加入的，现在没有用到这个变量
// let imageArray = {};          // 显示在界面上的图片的url和一个唯一id，该id在相册清空后会重置

export default{
  dragTipSeenFlag: true,
  cardHeaderCheck: false,
  showCard: true,
  cardIndex: 0,
  cardImgSrc: "",
  imageArray: {},
}