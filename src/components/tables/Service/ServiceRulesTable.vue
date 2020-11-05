<template>
  <div id="table_services_rules">
    <Tabulator
      :name="`Dienstdetails`"
      :columns="[
        {
          title: 'Aktion',
          field: 'action',
          formatter: 'textarea',
          width: 77,
        },
        {
          title: 'Quelle',
          field: 'src',
          formatter: 'textarea',
          sorter: 'ip',
        },
        {
          title: 'Ziel',
          field: 'dst',
          formatter: 'textarea',
          sorter: 'ip',
        },
        {
          title: 'Protokoll',
          field: 'prt',
          formatter: 'textarea',
          width: 92,
        },
      ]"
      reactiveData="true"
      :data="rulesData"
      :selectable="false"
      :groupBy="selection.length > 1 ? 'service' : ''"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Tabulator from "../Tabulator";
import Vue from 'vue';

export default {
  components: {
    Tabulator,
  },
  props: [
    "selection",
    "expandUser",
    "IPAsName",
    "filterBySearch",
    "search_input",
  ],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState("services", ["rulesData", "serviceTabNumber", "searchInput"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    selection: function () {
      console.log("SELECTION RANGE");
      this.getRules();
    },
    expandUser: function () {
      console.log("EXPAND USER RANGE");
      this.getRules();
    },
    IPAsName: function () {
      console.log("IPASNAME RANGE");
      this.getRules();
    },
    filterBySearch: function () {
      console.log("FILTER SEARCH RANGE");
      console.log(this.filterBySearch);
      this.getRules();
    },
  },
  mounted() {
    //this.getRules();
  },
  methods: {
    ...mapActions("services", ["getServiceRules"]),

    createPayloadElement(payloadObj) {
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
    },
    getRules() {
      var vm = this; // get vue instance

      console.log("GET SETRVICE RULES DATA");
      if (
        !vm.getActiveOwner ||
        !vm.getActivePolicy ||
        vm.selection.length !== 1
      ) {
        vm.data = [];
        return;
      }

      console.log("22");
      let rulepayload = {};
      let textsearch_payload = {};
      let generalpayload = {};

      if (vm.filterBySearch && vm.serviceTabNumber === 3) {
        console.log('TAB NUMBER IS DA');
        rulepayload = this.createPayloadElement(vm.searchInput.rules);
        textsearch_payload = this.createPayloadElement(
          vm.searchInput.textsearch
        );
        generalpayload = this.createPayloadElement(vm.searchInput.general);
      }

      const payload = {
        expand_users: vm.expandUser ? 1 : 0,
        display_property: vm.IPAsName ? "name" : "ip",
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        service: vm.selection.map((row) => row.name).join(","),
        filter_rules: vm.filterBySearch ? 1 : 0,
        ...rulepayload,
        ...textsearch_payload,
        ...generalpayload,
        chosen_networks: vm.searchInput.search_networks.join(","),
      };
      console.log(payload);
      this.getServiceRules(payload);
      /* vm.axios.get('/get_rules', {
				params: {
					
				}})
				.then(function (response) {
					var resdata = response.data.records;
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
					vm.data = resdata;
				})
				.catch(function (error) {
					vm.data = [];
					alert('get_rules: ' + error);
				}
			); */
    },
  },
};
</script>

<style>
</style>
