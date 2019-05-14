import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loggedIn: false,
		owners: [],
		activeOwner: null,
		history: [],
		activePolicy: null,
	},
	getters: {
		loggedIn: (state) => {
			return state.loggedIn;
		},
	},
	mutations: {
		setLoggedIn (state, loggedIn) {
			state.loggedIn = loggedIn;
		},
		setOwners (state, owners) {
			state.owners = owners;
		},
		setActiveOwner (state, activeOwner) {
			state.activeOwner = activeOwner;
		},
		setHistory (state, history) {
			state.history = history;
		},
		setActivePolicy (state, policy) {
			state.activePolicy = policy;
		}
	},
	actions: {
		setLoggedIn ({ commit }){
			return Vue.axios.get('/set')
				.then(function (response) {
					let recurare = response.data.success;
					commit('setLoggedIn', recurare);
				})
				// .catch(function (error) {
				.catch(function () {
					commit('setLoggedIn', false);
					//alert('get_owner for check logged-in status: ' + error);
				});
		},
		getOwners ({ commit }) {
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
		getActiveOwner ({ commit }) {
			return Vue.axios.get('/get_owner')
				.then(function (response) {
					let recurare = response.data.records[0].name;
					commit('setActiveOwner', recurare);
				})
				.catch(function (error) {
					alert('get_owner: ' + error);
				});
		},
		setActiveOwner ({ commit }, newActiveOwner) {
			Vue.axios.get('/set', {
					params: {
						owner: newActiveOwner
					}
				})
				.then(function (response) {
					let recurare = response.data.success;
					if(recurare){
						commit('setActiveOwner', newActiveOwner);
					}
				})
				.catch(function (error) {
					alert('setActiveOwner: ' + error);
				});
		},
		getHistory ({ commit }) {
			return Vue.axios.get('/get_history', {
					params: {
						active_owner: this.state.activeOwner,
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
	}
});