import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import Users from '@/components/users/user'
import Roles from '@/components/power/roles'
import Rights from '@/components/power/rights'
import GoodsCate from '@/components/goods/goodsCate'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/home',
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: GoodsCate
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, form, next) => {
  if (to.path == '/login') return next()
  var token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
