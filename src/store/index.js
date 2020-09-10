import Vue from 'vue';
import Vuex from 'vuex';
import services from './modules/services'
import auth from './modules/auth'
import * as getters from './getters'
import * as mutations from './mutations'
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
	actions: {
		
		requestOwners ({ commit }) {
			return Vue.axios.get('/get_owners')
				.then(function (response) {
					var recurare = response.data.records;
					for (var i = 0; i < recurare.length; i++) {
						recurare[i] = recurare[i].name;
					}
					commit('setOwners', recurare);
				})
				.catch(function (error) {
					alert('get_owners: ' + error);
				});
		},
		requestActive ({ commit, dispatch, state}) {
			return Vue.axios.get('/get_owner')
				.then(function (response) {
					let newActiveOwner = response.data.records[0].name;
					dispatch('requestHistory', newActiveOwner)
					.then( () => {
						commit('setActive', 
						{
							owner: newActiveOwner, 
							policy: state.history[0]
						});
					})
						.catch(function (error) {
							alert('get_history in setActive: ' + error);
						});
				})
				.catch(function (error) {
					alert('get_owner: ' + error);
				});
		},
		setActive ({ commit, dispatch, state}, newActiveOwner) {
			Vue.axios.get('/set', {
					params: {
						owner: newActiveOwner
					}
				})
				.then(function (response) {
					if(response.data.success){
						dispatch('requestHistory', newActiveOwner)
						.then( () => {
							commit('setActive', 
							{
								owner: newActiveOwner, 
								policy: state.history[0]
							});
						})
							.catch(function (error) {
								alert('get_history in setActive: ' + error);
							});
					}
				})
				.catch(function (error) {
					alert('setActiveOwner: ' + error);
				});
		},
		setActivePolicy ({ commit }, newActivePolicy) {
			commit('setActivePolicy', newActivePolicy);
		},
		requestHistory ({ commit }, owner) {
			return Vue.axios.get('/get_history', {
					params: {
						active_owner: owner || this.state.active.owner,
						history: 'none'
					}
				})
				.then(function (response) {
					let recurare = response.data.records;
					commit('setHistory', recurare);
				})
				.catch(function (error) {
					alert('get_history: ' + error);
				});
		},
	},
	modules: {
		services,
		auth
    },
});