import Vue from 'vue'
import router from './router'
import store from './store'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = true

new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app')
