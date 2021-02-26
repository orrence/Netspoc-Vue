import Vue from 'vue';
import Vuex from 'vuex';
import services from './modules/services'
import auth from './modules/auth'
import diff from './modules/diff'
import networks from './modules/networks'
import responsibilities from './modules/responsibilities'
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
		},
		loginpath: '/login'
	},
	getters,
	mutations,
	actions,
	modules: {
		services,
		auth,
		networks,
		responsibilities,
		diff
    },
});