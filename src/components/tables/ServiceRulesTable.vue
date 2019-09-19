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
	props:['selection', 'expandUser', 'IPAsName', 'filterBySearch'],
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
					filter_rules: vm.filterBySearch ? 1 : 0,
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					chosen_networks: '',
					service: this.selection.name
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
