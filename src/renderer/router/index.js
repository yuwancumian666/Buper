import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage').default,
      redirect: '/gallery',
      children: [
        {
          path: 'gallery',
          name: 'gallery',
          component: require('@/components/Gallery/Index').default,
        },
        {
          path: 'editor',
          name: 'editor',
          component: require('@/components/Editor/Index').default,
        },
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
