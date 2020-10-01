import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#2196f3',
        secondary: '#009688',
        accent: '#673ab7',
        error: '#f44336',
        warning: '#ff9800',
        info: '#607d8b',
        success: '#4caf50'
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  },
});
