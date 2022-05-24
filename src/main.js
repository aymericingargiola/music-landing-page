import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.globalProperties.$isDev = process.env.NODE_ENV === 'development';

app.mount('#app');
