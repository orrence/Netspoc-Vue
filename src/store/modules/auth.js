import axios from "axios";

export default {
    namespaced: true,
    state: {
        loggedIn: false,
    },
    getters: {
        getLoggedIn: state => {
            return state.loggedIn;
        },
    },
    mutations: {
        setLoggedIn: (state, loggedIn) => {
            state.loggedIn = loggedIn;
        },
    },
    actions: {
        setLoggedIn ({ commit }, bool) {
			commit('setLoggedIn', bool);
		},
		requestLoggedIn ({ commit }){
			return axios.get('/backend/set')
				.then(function (response) {
					let recurare = response.data.success;
					commit('setLoggedIn', recurare);
				})
				.catch(function () {
					commit('setLoggedIn', false);
				});
		},
    }
}