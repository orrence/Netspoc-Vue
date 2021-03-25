import router from '../../router/index'
import Vue from 'vue'
import store from '../'

export default {
    namespaced: true,
    state: {
        loggedIn: false,
        loginError: false,
    },
    getters: {
        getLoggedIn: state => {

            return state.loggedIn;
        },
        getLoginError: state => {
            return state.loginError;
        }
    },
    mutations: {
        SET_LOGGED_IN: (state, loggedIn) => {
            state.loggedIn = loggedIn;
        },
        SET_LOGIN_ERROR: (state, loginError) => {
            state.loginError = loginError;
        }
    },
    actions: {
        setLoggedIn({ commit }, bool) {
            commit('SET_LOGGED_IN', bool);
        },
        requestLoggedIn({ commit}) {
           
          //  return getters.getLoggedIn;
             return Vue.axios.get('/set')
                .then(function (response) {
                    let recurare = response.data.success;
                  
                    commit('SET_LOGGED_IN', recurare);
                    return true;
                })
                .catch(function () {
                    commit('SET_LOGGED_IN', false);
                    return false;
                }); 
        },
        loginUser({ commit }, creds) {
            let loginpath = store.state.loginpath;
            let backendlogin = '/login_vue';
            if(loginpath == '/ldap_login') {
                backendlogin = '/ldap_login_vue';
            }
            return Vue.axios.post(backendlogin, creds.data).then(res => {  
                if(res.data.success) {
                    commit('SET_LOGGED_IN', true);
                    commit('SET_LOGIN_ERROR',false);
                   // localStorage.set('loggendin',true);
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
                dispatch('services/');
             //   localStorage.set('loggendin',false);
                router.push('/login');
            }).catch(function () {
            });
        }
    }
}