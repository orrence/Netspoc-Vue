import Vue from 'vue'
export const requestOwners = ({ commit }) => {
    return Vue.axios.get('/get_owners')
        .then(function (response) {
            var recurare = response.data.records;
            for (var i = 0; i < recurare.length; i++) {
                recurare[i] = recurare[i].name;
            }
            commit('setOwners', recurare);
        })
        .catch(function () {
           
        });
};

export const requestActive = ({ commit, dispatch, state }) => {
    return Vue.axios.get('/get_owner')
        .then(function (response) {
            
            let newActiveOwner = response.data.records[0].name;
            return dispatch('requestHistory', newActiveOwner)
                .then(() => {
                    commit('setActive',
                        {
                            owner: newActiveOwner,
                            policy: state.history[0]
                        });
                })
                .catch(function () {
                });
            
        })
        .catch(function () {
        });
};

export const setActive = ({ commit, dispatch, state }, newActiveOwner) => {
    Vue.axios.get('/set', {
        params: {
            owner: newActiveOwner
        }
    })
        .then(function (response) {
            if (response.data.success) {
                dispatch('requestHistory', newActiveOwner)
                    .then(() => {
                        commit('setActive',
                            {
                                owner: newActiveOwner,
                                policy: state.history[0]
                            });
                    })
                    .catch(function () {
                    });
            }
        })
        .catch(function () {
        });
};

export const setActivePolicy = ({ commit }, newActivePolicy) => {
    commit('setActivePolicy', newActivePolicy);
};

export const requestHistory = ({ commit }, owner) => {
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
        .catch(function () {
        });
};

export const initApp = ({dispatch, commit}) => {
    dispatch('requestOwners');
    return dispatch('requestActive').then(() => {
        commit('auth/SET_LOGGED_IN', true);
        return true;
    })
};
