<template>
  <div id="table_services_rules">
    <Tabulator
      :name="`Dienstdetails`"
      :columns="[
	{ 
		title: 'Aktion',
		field: 'action',
		formatter: 'textarea',
		width: 77
	},
	{ 
		title: 'Quelle',
		field: 'src',
		formatter: 'textarea',
		sorter: 'ip'
	},
	{ 
		title: 'Ziel',
		field: 'dst',
		formatter: 'textarea',
		sorter: 'ip'
	},
	{ 
		title: 'Protokoll',
		field: 'prt',
		formatter: 'textarea',
		width: 92
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
    ...mapState("services", ["rulesData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    selection: function () {
      console.log('SELECTION RANGE');
      this.getRules();
    },
    expandUser: function () {
      console.log('EXPAND USER RANGE');
      this.getRules();
    },
    IPAsName: function () {
      console.log('IPASNAME RANGE');
      this.getRules();
    },
    filterBySearch: function () {
      console.log('FILTER SEARCH RANGE');
      this.getRules();
    },
  },
  mounted() {
    //this.getRules();
  },
  methods: {
    ...mapActions("services", ["getServiceRules"]),
    getRules() {
      var vm = this; // get vue instance
      var si = this.search_input;

      console.log('GET SETRVICE RULES DATA');
      if (
        !vm.getActiveOwner ||
        !vm.getActivePolicy ||
        vm.selection.length !== 1
      ) {
        vm.data = [];
        return;
      }
      const payload = {
        expand_users: vm.expandUser ? 1 : 0,
        display_property: vm.IPAsName ? "name" : "ip",
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        service: vm.selection.map((row) => row.name).join(","),
        filter_rules: vm.filterBySearch ? 1 : 0,
        search_ip1:
          vm.filterBySearch && si.tab_search === 0 ? si.search_ip1 : "",
        search_ip2:
          vm.filterBySearch && si.tab_search === 0 ? si.search_ip2 : "",
        search_proto:
          vm.filterBySearch && si.tab_search === 0 ? si.search_proto : "",
        search_supernet:
          vm.filterBySearch && si.tab_search === 0 && si.search_supernet
            ? "on"
            : "",
        search_subnet:
          vm.filterBySearch && si.tab_search === 0 && si.search_subnet
            ? "on"
            : "",
        search_range:
          vm.filterBySearch && si.tab_search === 0 && si.search_range
            ? "on"
            : "",
        search_string:
          vm.filterBySearch && si.tab_search === 1 ? si.search_string : "",
        search_in_desc:
          vm.filterBySearch && si.tab_search === 1 && si.search_description
            ? "on"
            : "",
        chosen_networks:
          vm.filterBySearch && si.tab_search === 2 ? si.search_networks : "",
        search_own: vm.filterBySearch && si.search_own ? "on" : "",
        search_used: vm.filterBySearch && si.search_used ? "on" : "",
        search_visible: vm.filterBySearch && si.search_visible ? "on" : "",
        search_disable_at:
          vm.filterBySearch && si.search_disable_at ? "on" : "",
        search_case_sensitive:
          vm.filterBySearch && si.search_case_sensitive ? "on" : "",
        search_exact: vm.filterBySearch && si.search_exact ? "on" : "",
      };
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
