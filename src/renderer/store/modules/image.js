import { stat } from 'fs-extra-p';
import { Store } from 'vuex';

const Vue = require('vue')

const state = {
  current_image: "",
  images: [
    // {id: 0, src: "C:\\Users\\Administrator\\桌面\\rock climbers.jpg", done: false},
  ],
  crop_info: { // 选取框的大小，单位px。不是选择后在图片中的实际大小
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
};

const getters = {
  doneImages: state => {
   return state.images.filter(image => image.done)
  },
  notDoneImages: state => {
   return state.images.filter(image => !image.done)
  },
  doneImagesCount: (state, getters) => {
   return getters.doneImages.length;
  },
  getImageById: (state) => (id) => {
   return state.images.find(image => image.id === id)
  },
  getImageBySrc: (state) => (src) => {
    return state.images.find(image => image.src === src)
  },
};

const mutations = {
  addImage (state, image) {
    state.images.push(image)
  },
  deleteImageById (state, id) {
    state.images.splice(state.images.findIndex(item => item.id === id), 1)
  },
  setImageDoneByIndex (state, {index, img}) {
    img.done = true;
    state.images.splice(index, 1, img)
  },
  clearImages (state) {
    state.images = [];
  },
  setCurrentImage (state, src) {
    state.current_image = src;
  },
  removeCurrentImage (state) {
    state.current_image = "";
  },
  setCropInfo (state, info) {
    state.crop_info = info;
  }
};

const actions = {
  addImage ({ commit }, arg) {
    commit('addImage', arg)
  },
  deleteImageById ({ commit }, arg) {
    commit('deleteImageById', arg)
  },
  setImageDoneById ({ commit, state, getters }, id) {
    let img = getters.getImageById(id);
    let index = state.images.indexOf(img);
    commit('setImageDoneByIndex', {index, img})
  },
  setImageDoneBySrc ({ commit, state, getters }, src) {
    let img = getters.getImageBySrc(src);
    let index = state.images.indexOf(img);
    commit('setImageDoneByIndex', {index, img})
  },
  clearImages ({ commit }) {
    commit('clearImages')
  },
  setCurrentImage ({ commit }, arg) {
    commit('setCurrentImage', arg)
  },
  removeCurrentImage ({ commit }) {
    commit('removeCurrentImage')
  },
  setCropInfo({ commit }, arg) {
    commit('setCropInfo', arg)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}