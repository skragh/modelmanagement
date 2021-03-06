import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component:()=>import('../components/Login.vue')
    },
{
    path: '/showjobs',
        name: 'ShowJobs',
        component: () => import('../components/ShowJobs.vue')
},
    {
        path: '/AddManager',
        name: 'Add Manager',
        component: () => import('../components/AddManager.vue')
    },
    {
        path: '/AddModel',
        name: 'Add Model',
        component: () => import('../components/AddModel.vue')
    },
    {
        path: '/AddJob',
        name: 'Add Job',
        component: () => import('../components/AddJob.vue')
    },
    
    {
        path: '/EditJob',
        name: 'Edit',
        component: () => import('../components/EditJob.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
