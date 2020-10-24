import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        networksData: [],
        networkResourcesData: []
    },
    mutations: {
        RECEIVED_NETWORKSDATA(state, payload) {
            state.networksData = payload.records;
        },
        RECEIVED_NETWORKS_RESOURCES_DATA(state, payload) {
            state.networkResourcesData = payload;
        },
    },
    actions: {
        getNetworks({ commit }, payload) {
            return Vue.axios.get('/get_networks', {
                params: payload
            }).then(res => {
                commit('RECEIVED_NETWORKSDATA', res.data);
            })
        },
        getNetworkResources({ commit }, payload) {
            return Vue.axios.get('/get_network_resources', {
                params: payload
            }).then(res => {
                var resdata = res.data.records;
				for (let i = 0; i < resdata.length; i++) {
					if (resdata[i].child_owner) {
						resdata[i].child_owner = resdata[i].child_owner.owner;
					}
				}
                commit('RECEIVED_NETWORKS_RESOURCES_DATA', resdata);
            })
        },
    }
}