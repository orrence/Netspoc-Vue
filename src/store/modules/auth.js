import axios from "axios";
import router from '../../router/index'
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
        SET_LOGGED_IN: (state, loggedIn) => {
            state.loggedIn = loggedIn;
        },
    },
    actions: {
        setLoggedIn({ commit }, bool) {
            commit('SET_LOGGED_IN', bool);
        },
        requestLoggedIn({ commit }) {
            return axios.get('/backend/set')
                .then(function (response) {
                    let recurare = response.data.success;
                    commit('SET_LOGGED_IN', recurare);

                })
                .catch(function () {
                    commit('SET_LOGGED_IN', false);
                });
        },
        loginUser({ dispatch }, creds) {
            axios.post('/backend/login', creds.data).then(res => {
                console.log(res);
                dispatch('setLoggedIn', true);
                router.push('/networks');
            }).catch(err => {
                console.log(err);
            })

        },
        logoutUser({ dispatch }) {
            axios.get('/backend/logout'
            ).then(function () {
                dispatch('setLoggedIn', false);
                router.push('/login');
            }).catch(function (error) {
                alert('logout: ' + error);
            });
        }
    }
}