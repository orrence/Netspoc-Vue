import Vue from 'vue';
import Vuex from 'vuex';
import services from './modules/services'
import auth from './modules/auth'
import networks from './modules/networks'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		owners: [],
		history: [],
		active: {
			owner: null,
			policy: null
		}
	},
	getters,
	mutations,
	actions,
	modules: {
		services,
		auth,
		networks
    },
});