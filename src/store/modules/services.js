import Vue from 'vue'
import store from '../'

export default {
    namespaced: true,
    state: {
        servicesData: [],
        rulesData: [],
        adminsData: [],
        searchArea: "regeln",
        serviceTabNumber: 1,
        showLoadingCircle: true,
        searchInput: {
            rules: {
                search_ip1: "",
                search_ip2: "",
                search_proto: "",
                search_supernet: false,
                search_subnet: true,
                search_range: false,
            },
            textsearch: {
                search_string: "",
                search_in_desc: true,
            },
            general: {
                search_own: true,
                search_used: true,
                search_visible: false,
                search_limited: false,
                search_case_sensitive: false,
                search_exact: false,
            },
            search_networks: [],
        },
        usersData: [],
        serviceSelection: [],
    },
    getters: {
        getsearchInputPlain: state => {
            let retpayload = {
                ...state.searchInput.rules,
                ...state.searchInput.textsearch,
                ...state.searchInput.general,
                search_networks: state.searchInput.search_networks
            }
            return retpayload;
        },
    },
    mutations: {
        RECEIVED_SERVICESDATA(state, payload) {
            state.servicesData = payload.records;
        },
        RECEIVED_RULESDATA(state, payload) {
            state.rulesData = payload;
        },
        RECEIVED_ADMINSDATA(state, payload) {

            state.adminsData = payload;
        },
        SEARCH_UPDATE(state, payload) {
            payload.search_networks = state.searchInput.search_networks
            state.searchInput = Object.assign({}, state.searchInput, payload);
        },
        UPDATE_SEARCH_AREA(state, payload) {
            state.searchArea = payload;
        },
        SET_NETWORK_SELECTION(state, payload) {
            state.searchInput = Object.assign({}, state.searchInput, payload);
        },
        RECEIVED_USERSDATA(state, payload) {
            state.usersData = payload;
        },
        SET_LOADING_CIRCLE(state, payload) {
            state.showLoadingCircle = payload;
        },
        UPDATE_SERVICE_SELECTION(state, payload) {
            state.serviceSelection = payload;
        },
        UPDATE_SERVICE_TAB_NUMBER(state, payload) {
            state.serviceTabNumber = payload;
        },
        UPDATE_SEARCH_FROM_URLHASH(state, payload) {
            let temp = state.searchInput;
            for (const [key] of Object.entries(state.searchInput.rules)) {
                temp.rules[key] = payload[key];
            }
            for (const [key] of Object.entries(state.searchInput.textsearch)) {
                temp.rules[key] = payload[key];
            }
            for (const [key] of Object.entries(state.searchInput.general)) {
                temp.rules[key] = payload[key];
            }
            temp.search_networks = payload.search_networks;
            state.searchInput = temp;
        }
    },

    actions: {
        getServicesList({ commit }, payload) {

            return Vue.axios.get('/service_list', {
                params: payload.data,
            }).then(res => {

                commit('RECEIVED_SERVICESDATA', res.data);
                if (res.data.totalCount == 0) {
                    commit('RECEIVED_RULESDATA', []);
                    commit('RECEIVED_ADMINSDATA', []);
                }

            })
        },
        getServiceRules({ commit }, payload) {
            return Vue.axios.get('/get_rules', {
                params: payload
            }).then(res => {
                let resdata = res.data.records;
                for (let j = 0; j < resdata.length; j++) {
                    resdata[j].src = resdata[j].src.join("\n");
                    resdata[j].dst = resdata[j].dst.join("\n");
                    resdata[j].prt = resdata[j].prt.join("\n");
                    switch (resdata[j].has_user) {
                        case "both":
                            resdata[j].src = "User";
                            resdata[j].dst = "User";
                            break;
                        case "src":
                            resdata[j].src = "User";
                            break;
                        case "dst":
                            resdata[j].src = "User";
                            resdata[j].dst = "User";
                            break;
                        default:
                    }
                }

                commit('RECEIVED_RULESDATA', resdata);
            })
        },
        getAdminsData({ commit }, ownerparam) {
            const payload = {
                chosen_networks: store.state.services.searchInput.search_networks.join(","),
                active_owner: store.getters.getActiveOwner,
                history: store.getters.getActivePolicy,
                owner: ownerparam,
            };
            return Vue.axios.get('/get_admins', {
                params: payload
            }).then(function (response) {
                commit('RECEIVED_ADMINSDATA', response.data.records);

            })
        },

        getServiceUsers({ commit, dispatch }, payload) {
            return Vue.axios.get('/get_users', {
                params: payload
            }).then(function (response) {
                commit('RECEIVED_USERSDATA', response.data.records);

                dispatch('getAdminsData', response.data.records[0].owner);
            })
        },
        updateServiceSelection({ commit }, payload) {
            commit('UPDATE_SERVICE_SELECTION', payload);
        },



    }
}
