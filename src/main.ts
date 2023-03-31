import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import enUS from 'dayjs/locale/en';
import router from './router';
import store from './store';
import i18n from './locale';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/assets/style/arco.less';
import '@/api/interceptor';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);

app.mount('#app');

// set light theme
document.body.setAttribute('arco-theme', 'light');

// set day.js locale
dayjs.extend(relativeTime);
dayjs().locale(enUS);

// set axios base URL
// axios.defaults.baseURL = '/api';
