import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loggedIn: false,
		owners: [],
		activeOwner: null,
	},
	getters: {
		loggedIn: (state) => {
			return state.loggedIn;
		}
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
		}
	},
	actions: {
		setLoggedIn ({ commit }){
			axios.get('/get_owner')
				.then(function (response) {
					let recurare = response.data.success;
					commit('setLoggedIn', recurare);
				})
				.catch(function (error) {
					commit('setLoggedIn', false);
					// alert('get_owner for check logged-in status: ' + error);
				});
		},
		getOwners ({ commit }) {
			axios.get('/get_owners')
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
			axios.get('/get_owner')
				.then(function (response) {
					let recurare = response.data.records[0].name;
					commit('setActiveOwner', recurare);
				})
				.catch(function (error) {
					alert('get_owner: ' + error);
				});
		},
		setActiveOwner ({ commit }, newActiveOwner) {
			axios.get('/set', {
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

		}
	}
});