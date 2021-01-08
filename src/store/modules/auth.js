import router from '../../router/index'
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        loggedIn: false,
        loginError: false,
    },
    getters: {
        getLoggedIn: state => {
            console.log('MY STATE');
            console.log(state.loggedIn);
            return state.loggedIn || localStorage.getItem('loggedIn');
        },
        getLoginError: state => {
            return state.loginError;
        }
    },
    mutations: {
        SET_LOGGED_IN: (state, loggedIn) => {
            state.loggedIn = loggedIn;
            localStorage.setItem('loggedIn',loggedIn);
        },
        SET_LOGIN_ERROR: (state, loginError) => {
            state.loginError = loginError;
        }
    },
    actions: {
        setLoggedIn({ commit }, bool) {
            commit('SET_LOGGED_IN', bool);
        },
        requestLoggedIn({getters}) {
           
            return getters.getLoggedIn;
            /* return Vue.axios.get('/set')
                .then(function (response) {
                    let recurare = response.data.success;
                    commit('SET_LOGGED_IN', recurare);

                })
                .catch(function () {
                    commit('SET_LOGGED_IN', false);
                }); */
        },
        loginUser({ commit }, creds) {
            return Vue.axios.post('/login_vue', creds.data).then(res => {  
                if(res.data.success) {
                    commit('SET_LOGGED_IN', true);
                    commit('SET_LOGIN_ERROR',false);
                    router.push('/services');
                } else {
                    commit('SET_LOGIN_ERROR',true);
                }
                
            }).catch(err => {
                console.log(err);
            })

        },
        logoutUser({ dispatch }) {
            return Vue.axios.get('/logout'
            ).then(function () {
                dispatch('setLoggedIn', false);
                router.push('/login');
            }).catch(function (error) {
                alert('logout: ' + error);
            });
        }
    }
}