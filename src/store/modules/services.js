import Vue from 'vue'
import { updateField } from 'vuex-map-fields'

export default {
    namespaced: true,
    state: {
        servicesData: [],
        rulesData: [],
        adminsData: [],
        searchArea: "regeln",
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
                search_description: true,
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
        updateField,
        RECEIVED_SERVICESDATA(state, payload) {
            state.servicesData = payload.records;
        },
        RECEIVED_RULESDATA(state, payload) {
            state.rulesData = payload;
        },
        RECEIVED_ADMINSDATA(state, payload) {
            console.log('AJAX ADMINS DATA');
            console.log(payload);
            state.adminsData = payload.data.records;
        },
        SEARCH_UPDATE(state, payload) {
            payload.search_networks = state.searchInput.search_networks
            state.searchInput = Object.assign({}, state.searchInput, payload);
        },
        UPDATE_SEARCH_AREA(state, payload) {
            console.log(payload);
            state.searchArea = payload;
        },
        SET_NETWORK_SELECTION(state, payload) {
            state.searchInput = Object.assign({}, state.searchInput, payload);
        },
        RECEIVED_USERSDATA(state, payload) {
            state.usersData = payload.records;
        },
        UPDATE_SERVICE_SELECTION(state, payload) {
            state.serviceSelection = payload;
        },
        UPDATE_SEARCH_FROM_URLHASH(state,payload) {
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
                params: payload.data
            }).then(res => {
                commit('RECEIVED_SERVICESDATA', res.data);
            })
        },
        getServiceRules({ commit }, payload) {
            return Vue.axios.get('/get_rules', {
                params: payload
            }).then(res => {
                let resdata = res.data.records;
                for (let j = 0; j < resdata.length; j++) {
                    resdata[j].src = resdata[j].src.join("\n");
                    switch (resdata[j].has_user) {
                        case "both":
                            resdata[j].src = "User";
                            resdata[j].dst = "User";
                            break;
                        case "src":
                            resdata[j].src = "User";
                            break;
                        default:
                    }
                }

                commit('RECEIVED_RULESDATA', resdata);
            })
        },
        getAdminsData({ commit }, payload) {
            return Vue.axios.get('/get_admins', {
                params: payload
            }).then(function (response) {
                commit('RECEIVED_ADMINSDATA', response);
                /* var admins = response.data.records;
                 for (let i = 0; i < admins.length; i++) {
                   vm.buffer.push({
                     owner: owner,
                     email: admins[i].email,
                   });
                 }
                 vm.requests--; */
            })
        },

        getServiceUsers({ commit }, payload) {
            return Vue.axios.get('/get_users', {
                params: payload
            }).then(function (response) {
                commit('RECEIVED_USERSDATA', response);

            })
        },
        updateServiceSelection({ commit }, payload) {
            commit('UPDATE_SERVICE_SELECTION', payload);
        }
    }
}
