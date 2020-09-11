import axios from "axios";

export default {
    namespaced: true,
    state: {
        servicesData: [],
        rulesData: [],
        adminsData: [],
    },
    mutations: {
        RECEIVED_SERVICESDATA(state, payload) {
            state.servicesData = payload.records;
        },
        RECEIVED_RULESDATA(state, payload) {
            state.rulesData = payload;
        },
        RECEIVED_ADMINSDATA(state,payload) {
            state.adminsData = payload.records;
        }
    },

    actions: {
        getServicesList({ commit }, payload) {
            axios.get('/backend/service_list', {
                params: payload.data
            }).then(res => {
                commit('RECEIVED_SERVICESDATA', res.data);
            })
        },
        getServiceRules({ commit }, payload) {
            axios.get('/backend/get_rules', {
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
        getAdmins({commit}, payload) {
            axios.get('/get_admins', {
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
        }
    }
}
