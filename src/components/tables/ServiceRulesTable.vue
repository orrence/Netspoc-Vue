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
	props:[
		'selection', 'expandUser', 'IPAsName', 
		'filterBySearch', 'search_ip1', 'search_ip2', 
		'search_proto', 'search_supernet', 'search_subnet', 
		'search_range', 'search_own', 'search_used', 'search_usable', 
		'search_limited', 'search_case_sensitive', 'search_exact'
		],
	data: () => ({
		config : {
			columns: [
				{ title: 'Aktion', field: 'action' },
				{ title: 'Quelle', field: 'src', sorter: 'ip'},
				{ title: 'Ziel', field: 'dst', sorter: 'ip' },
				{ title: 'Protokoll', field: 'prt' },
			],
			data: [],
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
			vm.axios.get('/get_rules', {
				params: {
					expand_users: vm.expandUser ? 1 : 0,
					display_property: vm.IPAsName ? 'name' : 'ip',
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					chosen_networks: '',
					service: this.selection.name,
					filter_rules: vm.filterBySearch ? 1 : 0,
					search_ip1: vm.filterBySearch ? vm.search_ip1 : null,
					search_ip2: vm.filterBySearch ? vm.search_ip2 : null,
					search_proto: vm.filterBySearch ? vm.search_proto : null,
					search_supernet: vm.filterBySearch ? vm.search_supernet : null,
					search_subnet: vm.filterBySearch ? vm.search_subnet : null,
					search_range: vm.filterBySearch ? vm.search_range : null,
					search_own: vm.filterBySearch ? vm.search_own : null,
					search_used: vm.filterBySearch ? vm.search_used : null,
					search_usable: vm.filterBySearch ? vm.search_usable : null,
					search_limited: vm.filterBySearch ? vm.search_limited : null,
					search_case_sensitive: vm.filterBySearch ? vm.search_case_sensitive : null,
					search_exact: vm.filterBySearch ? vm.search_exact : null,
				}})
				.then(function (response) {
					var resdata = response.data.records;
					for (let i = 0; i < resdata.length; i++) {
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
