import Vue from 'vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import './plugins/axios'
import './plugins/vueObserveVisibility'
import VueResizeObserver from 'vue-resize-observer';
Vue.use(VueResizeObserver);
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'tabulator-tables/dist/css/tabulator.min.css'
import Tabulator from 'tabulator-tables';
import App from './App.vue'

Vue.prototype.$LDAPLOGIN = '/ldap_login';
Vue.prototype.$STANDARDLOGIN = '/login';

Tabulator.prototype.extendModule("sort", "sorters", {
    ip:function(a, b){
        var ip2numeric = function(dot) {
            var rex = /[a-zA-Z]/;
            var d;
            if ( rex.test(dot) === true ) {
                return 0xFFFFFFFF;
            }
            dot = dot.split(/[-/]/)[0]
            d = dot.split('.');
            return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
        };
        a = ip2numeric(a);
        b = ip2numeric(b);
        return a - b;
    },
});

Vue.config.productionTip = true

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
