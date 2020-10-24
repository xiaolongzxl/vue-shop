import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/welcome')

const Roles = () => import(/* webpackChunkName: "power" */ '@/components/power/roles')
const Rights = () => import(/* webpackChunkName: "power" */ '@/components/power/rights')

const GoodsCate = () => import(/* webpackChunkName: "goods" */ '@/components/goods/goodsCate')
const Params = () => import(/* webpackChunkName: "goods" */ '@/components/goods/params')
const Lists = () => import(/* webpackChunkName: "goods" */ '@/components/goods/lists')
const Add = () => import(/* webpackChunkName: "goods" */ '@/components/goods/add')

const Users = () => import(/* webpackChunkName: "user_order_report" */ '@/components/users/user')
const Order = () => import(/* webpackChunkName: "user_order_report" */ '@/components/order/order')
const Reports = () => import(/* webpackChunkName: "user_order_report" */ '@/components/report/report')

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
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Lists
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Reports
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
