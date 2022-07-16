import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
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
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
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

const app = createApp(Home);

app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.config.globalProperties.$isDev = process.env.NODE_ENV === 'development';

app.mount('#app');
