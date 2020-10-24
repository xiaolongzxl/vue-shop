import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import '@/assets/font/iconfont.css'
import '@/assets/css/global.css'
import TreeTable from 'tree-table-vue'
import moment from 'moment'

import VueQuillEditor from 'vue-quill-editor'

import Nprogress from 'nprogress'

// import { config } from 'vue/types/umd'

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('dateformat', function (dataStr) {
    var pattern = 'YYYY-MM-DD HH:mm:ss'
    dataStr *= 1000
    return moment(dataStr).format(pattern)

})

Vue.use(TreeTable)
//设置接口根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios挂载到vue上，以保证随时随地都可以用
Vue.prototype.$http = axios
// 给每次的请求添加拦截器，设置请求的属性
axios.interceptors.request.use(config => {
    Nprogress.start()
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
    Nprogress.done()
    return config
})

Vue.config.productionTip = false


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
