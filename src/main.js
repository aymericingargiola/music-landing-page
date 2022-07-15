import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/HomePage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
  ],
});

const app = createApp(Home);

app.use(router);

app.config.globalProperties.$isDev = process.env.NODE_ENV === 'development';

app.mount('#app');
