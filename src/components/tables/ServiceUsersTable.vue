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
	props:['selection'],
	data: () => ({
		config : {
			columns: [
				{ title: 'Name', field: 'name' },
				{ title: 'IP-Adressen', field: 'ip', sorter: 'ip' },
				{ title: 'Verantwortungsbereich', field: 'owner' },
			],
			data: [],
			layout: "fitColumns",
			layoutColumnsOnNewData:true,
		},
	}),
	computed: mapState(['active']),
	watch: {
		selection: function () { this.getUsers(); }
	},
	mounted () {
		this.getUsers();
	},
	methods: {
		getUsers () {
			var vm = this;	// get vue instance
			vm.axios.get('/get_users', {
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
					vm.config.data = response.data.records;
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
