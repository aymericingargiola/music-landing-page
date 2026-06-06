import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createHead } from '@unhead/vue/client'
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUserSecret,
  faDownload,
  faFastBackward,
  faFastForward,
  faStopCircle,
  faPauseCircle,
  faPlayCircle,
  faListAlt,
  faVolumeUp,
  faVolumeDown,
  faVolumeOff,
  faVolumeMute,
  faRandom,
  faChevronRight,
  faChevronLeft,
  faGlobeEurope,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Home from '@/pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/track/:slug',
      name: 'Track',
      component: Home,
    },
  ],
});

library.add(
  faUserSecret,
  faDownload,
  faFastBackward,
  faFastForward,
  faStopCircle,
  faPauseCircle,
  faPlayCircle,
  faListAlt,
  faVolumeUp,
  faVolumeDown,
  faVolumeOff,
  faVolumeMute,
  faRandom,
  faChevronRight,
  faChevronLeft,
  faGlobeEurope,
);

router.beforeEach((to, from, next) => {
  if (to.name === 'Track' && from.name === 'Track') {
    next();
  } else if (to.name === 'Track') {
    next();
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.name === 'Track') {
    window.scrollTo(0, 0);
  }
});

router.onError((error) => {
  console.error('Navigation error:', error);
});

const head = createHead();

const app = createApp(Home);

app.use(router);
app.use(head);

app.component('FontAwesomeIcon', FontAwesomeIcon);

app.config.globalProperties.$isDev = process.env.NODE_ENV === 'development';

app.mount('#app');
