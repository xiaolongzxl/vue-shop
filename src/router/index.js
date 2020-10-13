import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,form,next)=>{
  if(to.path == '/login') return next()
  var token = sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})

export default router
