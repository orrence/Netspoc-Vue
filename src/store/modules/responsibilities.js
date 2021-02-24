import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        ownerAdminsData: [],
        ownerWatchersData: [],
        ownerSupervisorsData: [],
    },
    mutations: {
        RECEIVED_OWNERADMINSDATA(state, payload) {
            state.ownerAdminsData = payload.records;
        },
        RECEIVED_OWNERWATCHERSDATA(state, payload) {
            state.ownerWatchersData = payload.records;
        },
        RECEIVED_OWNERSUPERVISORSDATA(state, payload) {
            state.ownerSupervisorsData = payload.records;
        },
    },
    actions: {
        getOwnerAdmins({ commit }, payload) {
            return Vue.axios.get('/get_admins', {
                params: payload
            }).then(res => {
                commit('RECEIVED_OWNERADMINSDATA', res.data);
                return res.data;
            })
        },
        getOwnerWatchers({ commit }, payload) {
            return Vue.axios.get('/get_watchers', {
                params: payload
            }).then(res => {
                commit('RECEIVED_OWNERWATCHERSDATA', res.data);
                return res.data;
            })
        },
        getOwnerSupervisors({ commit }, payload) {
            return Vue.axios.get('/get_supervisors', {
                params: payload
            }).then(res => {
                commit('RECEIVED_OWNERSUPERVISORSDATA', res.data);
                return res.data;
            })
        },
    }
}