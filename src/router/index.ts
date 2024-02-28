import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    redirect: "/login"
    // component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },{
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/LoginView.vue')
  },{
    path: '/main',
    name: 'main',
    component: () => import(/* webpackChunkName: "about" */ '../views/main/IndexView.vue'),
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/index/IndexView.vue')
      },{
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/user/UserView.vue')
      },{
        path: '/book',
        name: 'book',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/book/BookView.vue'),
        children: [
          {
            path: '/borrow',
            name: 'borrow',
            component: () => import(/* webpackChunkName: "about" */ '../views/main/book/BorrowView.vue')
          }
        ]
      },{
        path: '/bookStore',
        name: 'bookStore',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/book/BookStoreView.vue')
      },{
        path: '/log',
        name: 'log',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/log/LogView.vue')
      },{
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/role/RoleView.vue')
      }
      ,{
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "about" */ '../views/main/menu/MenuView.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * 路由时全局判断登陆状态
 */
router.beforeEach((to,from,next) => {
  console.log("全局登录判断",to,from,next)
  if(to.name != 'login'){
    const token = localStorage.getItem('token');
    if(!token){
      next("/login");
    }else{
      next();
    }
  }else{
    next();
  }
})

export default router
