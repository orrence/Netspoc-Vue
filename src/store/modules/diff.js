import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        tree: [],
    },
    mutations: {
        SET_TREE: (state, treedata) => {
            state.tree = treedata;
        }
    },
    actions: {
        requestDiff({ state}, payload) {
           
          //  return getters.getLoggedIn;
             return Vue.axios.get('/get_diff', {
                params: payload
            })
                .then(function (response) {
                    state.tree = Object.values(response.data);
                })
                .catch(function () {
                    state.tree = [];
                }); 
        },
    }
}