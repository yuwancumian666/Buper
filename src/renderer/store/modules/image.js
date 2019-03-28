
const Vue = require('vue')

const state = {
  tipFlag: true,
  images: [
    // {id: 0, src: "C:\\Users\\Administrator\\桌面\\rock climbers.jpg", done: false},
  ],
};

const getters = {
  doneImages: state => {
   return state.images.filter(image => image.done)
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
    // console.log("image: " + image.id+", "+image.src)
    state.images.push(image)
  },
  deleteImageById (state, id) {
    state.images.splice(state.images.findIndex(item => item.id === id), 1)
  },
  setTipFlag (state, flag) {
    state.tipFlag = flag
  },
  setImageDoneById (state, id) {
    let img = getters.getImageById(id);
    let index = state.images.indexOf(img);
    img.done = true;
    Vue.set(state.images, index, img);
  },
  clearImages (state) {
    state.images = [];
  }
};

const actions = {
  addImage ({ commit }, arg) {
    // console.log("arg: " + arg)
    commit('addImage', arg)
  },
  setTipFlag ({ commit }, arg) {
    commit('setTipFlag', arg)
  },
  deleteImageById ({ commit }, arg) {
    commit('deleteImageById', arg)
  },
  clearImages({ commit }) {
    console.log("clear action")
    commit('clearImages')
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}