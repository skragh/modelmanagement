import Vue from 'vue'
import VueRouter from 'vue'
import App from './App.vue'
import Login from './components/Login.vue'

Vue.config.productionTip = false

const routes = [
    {path: '/login',component:Login}]

const router=new VueRouter({
    routes
})

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
