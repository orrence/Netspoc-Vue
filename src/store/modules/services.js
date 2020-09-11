import axios from "axios";

export default {
    namespaced: true,
    state: {
        servicesData: []
    },
    mutations: {
        RECEIVED_SERVICESDATA(state, payload) {
            state.servicesData = payload.records;
        }
    },

    actions: {
        getServicesList({ commit }, payload) {
            axios.get('/backend/service_list', {
                params: payload.data
            }).then(res => {
                commit('RECEIVED_SERVICESDATA', res.data);
            })
        }
    }
}
