<template>
<Tabulator :config="config"></Tabulator>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './Tabulator';
export default {
	components: {
		Tabulator,
	},
	props:['selection', 'expandUser', 'IPAsName', 'filterBySearch', 'search_input'],
	data: () => ({
		config: {
			columns: [
				{ title: 'Aktion', 		field: 'action', 	formatter: "textarea", width: 77 },
				{ title: 'Quelle', 		field: 'src', 		formatter: "textarea", sorter: 'ip'},
				{ title: 'Ziel', 			field: 'dst', 		formatter: "textarea", sorter: 'ip' },
				{ title: 'Protokoll', field: 'prt', 		formatter: "textarea", width: 92 },
			],
			data: [],
			layout: "fitColumns",
			layoutColumnsOnNewData:true,
		},
	}),
	computed: mapState(['active']),
	watch: {
		selection: function () { this.getRules(); },
		expandUser: function () { this.getRules(); },
		IPAsName: function () { this.getRules(); },
		filterBySearch: function () { this.getRules(); }
	},
	mounted () {
		this.getRules();
	},
	methods: {
		getRules () {
			var vm = this;	// get vue instance
			var si = this.search_input;

			vm.axios.get('/get_rules', {
				params: {
					expand_users: vm.expandUser ? 1 : 0,
					display_property: vm.IPAsName ? 'name' : 'ip',
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					chosen_networks: '',
					service: vm.selection.name,
					filter_rules: vm.filterBySearch ? 1 : 0,
					search_ip1: vm.filterBySearch ? si.search_ip1 : null,
					search_ip2: vm.filterBySearch ? si.search_ip2 : null,
					search_proto: vm.filterBySearch ? si.search_proto : null,
					search_supernet: vm.filterBySearch ? si.search_supernet : null,
					search_subnet: vm.filterBySearch ? si.search_subnet : null,
					search_range: vm.filterBySearch ? si.search_range : null,
					search_own: vm.filterBySearch ? si.search_own : null,
					search_used: vm.filterBySearch ? si.search_used : null,
					search_visible: vm.filterBySearch ? si.search_visible : null,
					search_disable_at: vm.filterBySearch ? si.search_limited : null,
					search_case_sensitive: vm.filterBySearch ? si.search_case_sensitive : null,
					search_exact: vm.filterBySearch ? si.search_exact : null,
				}})
				.then(function (response) {
					var resdata = response.data.records;
					for (let i = 0; i < resdata.length; i++) {
						resdata[i].src = resdata[i].src.join("\n");
						switch (resdata[i].has_user) {
							case "both":
								resdata[i].src = "User";
								resdata[i].dst = "User";
								break;
							case "src":
								resdata[i].src = "User";
								break;
							default:
						}
					}
					vm.config.data = resdata;
				})
				.catch(function (error) {
					alert('get_hosts: ' + error);
				});
		}
	}
}
</script>

<style>

</style>
