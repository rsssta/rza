import { Components } from 'ant-design-vue/es/date-picker/generatePicker'
import { createRouter, createWebHistory, RouterLink } from 'vue-router'
const routes = [
  {path:'/' ,
    name:'login',
    component:()=>import('../views/Login.vue')
  },
  {
    path:'/layout' ,
    name:'layout',
    component:()=>import('../views/Layout.vue'),
    children:[{
      path:'/productInfo',
      name:'productInfo',
      component:()=>import('../views/products/productsinfo.vue')
    },
    {
      path:'/textExtract',
      name:'textExtract',
      component:()=>import('../views/ocr/ocr.vue')
    }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由守卫
// Router.beforeEach((to) => {
//   const endtime = LocalStorage.getItem('auth_expires_at');
//   if (tools.checkexpires(endtime ? endtime : '')) {
//     console.log(' >================(index.js:42)', 11);
//     return { name: 'login' };
//   }
  
//   const isAuthentication = LocalStorage.getItem('auth_token');
//   if (isAuthentication == null && to.name !== 'login' && to.name !== 'callback') {
//     return { name: 'login' };
//   }
// });

export default router
