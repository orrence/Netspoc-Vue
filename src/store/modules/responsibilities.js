import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        ownerAdminsData: [],
    },
    mutations: {
        RECEIVED_OWNERADMINSDATA(state, payload) {
            state.ownerAdminsData = payload.records;
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
    }
}