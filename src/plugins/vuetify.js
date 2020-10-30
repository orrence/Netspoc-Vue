import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify, {
  theme: {
    primary: colors.indigo.base,
    secondary: colors.indigo.base
  }
});

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#69808e',
        secondary: '#F9AA33',
        accent: '#bec5c9',
        error: '#b71c1c',
        lightgray: '#f6f6f6'
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  },
});
