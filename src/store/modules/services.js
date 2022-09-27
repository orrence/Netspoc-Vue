import Vue from 'vue'
import store from '../'

const getDefaultState = () => {
    return {
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
            search_disable_at: false,
            search_case_sensitive: false,
            search_exact: false,
        },
        search_networks: [],

    }
}

export default {
    namespaced: true,
    state: {
        servicesData: [],
        servicesOverviewData: [],
        rulesData: [],
        rulesAdminsData: [],
        usersAdminsData: [],
        serviceTabNumber: 1,
        showLoadingCircle: true,
        filterBySearch: false,
        expandUser: false,
        IPAsName: false,
        relations: ["owner", "user", "visible"],
        searchInput: {},
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
        RECEIVED_SERVICESOVERVIEW_DATA(state, payload) {
            state.servicesOverviewData = payload.records;
        },
        RECEIVED_SERVICESDATA(state, payload) {
            state.servicesData = payload.records;
        },
        RECEIVED_RULESDATA(state, payload) {
            state.rulesData = payload;
        },
        RECEIVED_RULES_ADMINSDATA(state, payload) {
            state.rulesAdminsData = payload;
        },
        RECEIVED_USERS_ADMINSDATA(state, payload) {
            state.usersAdminsData = payload;
        },
        SEARCH_UPDATE(state, payload) {
            payload.search_networks = state.searchInput.search_networks;
            state.searchInput = Object.assign({}, state.searchInput, payload);
        },
        SEARCH_UPDATE_RULES(state, payload) {
            state.searchInput.rules = Object.assign({}, state.searchInput.rules, payload);
        },
        SEARCH_UPDATE_GENERAL(state, payload) {
            state.searchInput.general = Object.assign({}, state.searchInput.general, payload);
        },
        SEARCH_UPDATE_TEXTSEARCH(state, payload) {
            state.searchInput.textsearch = Object.assign({}, state.searchInput.textsearch, payload);
        },
        SET_NETWORK_SELECTION(state, payload) {
            state.searchInput = Object.assign({}, state.searchInput, payload);
        },
        RESET_SEARCH_STATE(state) {
            Object.assign(state.searchInput, getDefaultState())
            console.log('SEARCH STATE RESET', state.searchInput);
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
                temp.textsearch[key] = payload[key];
            }
            for (const [key] of Object.entries(state.searchInput.general)) {
                temp.general[key] = payload[key];
            }
            temp.search_networks = payload.search_networks;
            Object.assign(state.searchInput, temp);
        },
        SET_IPASNAME(state, payload) {
            state.IPAsName = payload;
        },
        SET_EXPAND_USER(state, payload) {
            state.expandUser = payload;
        },
        FILTER_BY_SEARCH(state, payload) {
            state.filterBySearch = payload;
        },

    },

    actions: {
        getServicesList({ commit, state }) {

            let chosen_networks = state.searchInput.search_networks.join(",");
            let active_owner = store.getters.getActiveOwner;
            let history = store.getters.getActivePolicy;

            let basepayload;

            if (typeof state.relations[state.serviceTabNumber] !== "undefined") {
                basepayload = {
                    chosen_networks: chosen_networks,
                    active_owner: active_owner,
                    history: history,
                    relation: state.relations[state.serviceTabNumber],
                };
            } else {
                let rulepayload = {};
                let textsearch_payload = {};
                let generalpayload = {};

                rulepayload = createPayloadElement(state.searchInput.rules);
                textsearch_payload = createPayloadElement(state.searchInput.textsearch);
                generalpayload = createPayloadElement(state.searchInput.general);

                basepayload = {
                    chosen_networks: chosen_networks,
                    active_owner: active_owner,
                    history: history,
                    relation: "",
                    ...rulepayload,
                    ...textsearch_payload,
                    ...generalpayload,
                };
            }

            return Vue.axios.get('/service_list', {
                params: basepayload,
            }).then(res => {

                commit('RECEIVED_SERVICESDATA', res.data);

                if (res.data.totalCount == 0) {
                    commit('services/UPDATE_SERVICE_SELECTION', [], { root: true });
                    commit('services/RECEIVED_RULES_ADMINSDATA', [], { root: true });


                    commit('services/RECEIVED_RULESDATA', [], { root: true });
                    commit('services/RECEIVED_USERS_ADMINSDATA', [], { root: true });
                }

            })
        },
        getServicesOverview({ commit, state }) {

            let chosen_networks = state.searchInput.search_networks.join(",");
            let active_owner = store.getters.getActiveOwner;
            let history = store.getters.getActivePolicy;

            let basepayload;

            if (typeof state.relations[state.serviceTabNumber] !== "undefined") {
                basepayload = {
                    chosen_networks: chosen_networks,
                    active_owner: active_owner,
                    history: history,
                    relation: state.relations[state.serviceTabNumber],
                };
            } else {
                let rulepayload = {};
                let textsearch_payload = {};
                let generalpayload = {};

                rulepayload = createPayloadElement(state.searchInput.rules);
                textsearch_payload = createPayloadElement(state.searchInput.textsearch);
                generalpayload = createPayloadElement(state.searchInput.general);

                basepayload = {
                    chosen_networks: chosen_networks,
                    active_owner: active_owner,
                    history: history,
                    relation: "",
                    ...rulepayload,
                    ...textsearch_payload,
                    ...generalpayload,
                };
            }

            return Vue.axios.get('/get_services_and_rules', {
                params: basepayload,
            }).then(res => {

                commit('RECEIVED_SERVICESOVERVIEW_DATA', res.data);

                if (res.data.totalCount == 0) {
                    console.log("EMPTY SERVICE LIST IN OVERVIEW!")
                }

            })
        },
        setUsersAdminData({ commit }, payload) {
            commit('RECEIVED_USERS_ADMINSDATA', payload);
        },
        setRulesAdminsData({ commit }, payload) {
            commit('RECEIVED_RULES_ADMINSDATA', payload);
        },
        getServiceRules({ commit, state, dispatch }) {

            let rulepayload = {};
            let textsearch_payload = {};
            let generalpayload = {};

            if (state.filterBySearch && state.serviceTabNumber === 3) {
                rulepayload = createPayloadElement(state.searchInput.rules);
                textsearch_payload = createPayloadElement(
                    state.searchInput.textsearch
                );
                generalpayload = createPayloadElement(state.searchInput.general);
            }

            const payload = {
                expand_users: state.expandUser ? 1 : 0,
                display_property: state.IPAsName ? "name" : "ip",
                active_owner: store.getters.getActiveOwner,
                history: store.getters.getActivePolicy,
                service: state.serviceSelection.map((row) => row.name).join(","),
                filter_rules: store.state.filterBySearch ? 1 : 0,
                ...rulepayload,
                ...textsearch_payload,
                ...generalpayload,
                chosen_networks: state.searchInput.search_networks.join(","),
            };

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
                            resdata[j].dst = "User";
                            break;
                        default:
                    }
                }
                var owner = state.serviceSelection[0].owner.map((owner) => owner.name);

                dispatch('getAdminsData', owner[0]).then((response) => {
                    commit('RECEIVED_RULES_ADMINSDATA', response.data.records);
                });
                // Lade ADMIN mit aktullen owner
                commit('RECEIVED_RULESDATA', resdata);
            })
        },
        getAdminsData(_, ownerparam) {

            const payload = {
                chosen_networks: store.state.services.searchInput.search_networks.join(","),
                active_owner: store.getters.getActiveOwner,
                history: store.getters.getActivePolicy,
                owner: ownerparam,
            };
            return Vue.axios.get('/get_admins', {
                params: payload
            }).then((response) => {
                return response;
            }
            )
        },

        getServiceUsers({ commit, dispatch }, payload) {
            return Vue.axios.get('/get_users', {
                params: payload
            }).then(function (response) {
                commit('RECEIVED_USERSDATA', response.data.records);

                dispatch('getAdminsData', response.data.records[0].owner).then((response) => {
                    commit('RECEIVED_USERS_ADMINSDATA', response.data.records);
                });
            })
        },
        updateServiceSelection({ commit }, payload) {
            commit('UPDATE_SERVICE_SELECTION', payload);
        },
        loadPlainSearch({ state }) {
            let retpayload = {
                ...state.searchInput.rules,
                ...state.searchInput.textsearch,
                ...state.searchInput.general,
                search_networks: state.searchInput.search_networks
            }
            return retpayload;

        },



    }
}
function createPayloadElement(payloadObj) {
    let payload = {};

    for (const [key, value] of Object.entries(payloadObj)) {
        if (typeof value == "boolean") {
            let boolval = "";
            if (value == true) {
                boolval = "on";
            }
            Vue.set(payload, key, boolval);
        } else {
            Vue.set(payload, key, value);
        }
    }
    return payload;
}