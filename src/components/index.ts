import { App } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from 'echarts/components';
import Chart from './chart/index.vue';
import Breadcrumb from './breadcrumb/index.vue';
import Mtitle from './base-com/mtitle/index.vue';
import Mradio from './base-com/mradio/index.vue';
import DatePicker from './little-com/date-picker/index.vue';
import Mupload from './little-com/mupload/index.vue';
import RewardCard from './little-com/reward-card/index.vue';
import MatchStage from './little-com/match-stage/index.vue';

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

export default {
  install(Vue: App) {
    Vue.component('Chart', Chart);
    Vue.component('Breadcrumb', Breadcrumb);
    Vue.component('Mtitle', Mtitle);
    Vue.component('Mradio', Mradio);
    Vue.component('DatePicker', DatePicker);
    Vue.component('Mupload', Mupload);
    Vue.component('RewardCard', RewardCard);
    Vue.component('MatchStage', MatchStage);
  },
};
