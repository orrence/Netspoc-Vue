import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loggedIn: false,
		owners: [],
		history: [],
		active: {
			owner: null,
			policy: null
		}
	},
	getters: {
		getLoggedIn: (state) => {
			return state.loggedIn;
		},
		getOwners: (state) => {
			return state.owners;
		},
		getHistory: (state) => {
			return state.history;
		},
		getActiveOwner: (state) => {
			if(!state.active.owner) return null;
			return state.active.owner;
		},
		getActivePolicy: (state) => {
			if(!state.active.policy) return "";
			return state.active.policy.current ? state.active.policy.policy : state.active.policy.date;
		},
	},
	mutations: {
		setLoggedIn (state, loggedIn) {
			state.loggedIn = loggedIn;
		},
		setOwners (state, owners) {
			state.owners = owners;
		},
		setActive (state, active) {
			state.active = active;
		},
		setHistory (state, history) {
			state.history = history;
		},
		setActivePolicy (state, activePolicy) {
			state.active.policy = activePolicy;
		},
	},
	actions: {
		setLoggedIn ({ commit }, bool) {
			commit('setLoggedIn', bool);
		},
		requestLoggedIn ({ commit }){
			return Vue.axios.get('/set')
				.then(function (response) {
					let recurare = response.data.success;
					commit('setLoggedIn', recurare);
				})
				.catch(function () {
					commit('setLoggedIn', false);
				});
		},
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
	}
});