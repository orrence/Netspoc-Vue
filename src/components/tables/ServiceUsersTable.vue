<template>
<Tabulator
:name="`Dienstbenutzer`"
:columns="[
	{ 
		title: 'Name',
		field: 'name'
	},
	{ 
		title: 'IP-Adressen',
		field: 'ip',
		sorter: 'ip'
	},
	{ 
		title: 'Verantwortungsbereich',
		field: 'owner'
	},
]"
:data="data"
:selectable="false"
:groupBy="selection.length > 1 ? 'service' : ''"
/>
</template>

<script>
import { mapGetters } from 'vuex';
import Tabulator from './Tabulator';
export default {
	components: {
		Tabulator,
	},
	props:['filterBySearch', 'selection'],
	data: () => ({
		data: [],
	}),
	computed: mapGetters(['getActiveOwner', 'getActivePolicy']),
	watch: {
		selection: function () { this.getUsers(); }
	},
	mounted () {
		this.getUsers();
	},
	methods: {
		getUsers () {
			var vm = this;	// get vue instance
			if (!vm.getActiveOwner || !vm.getActivePolicy || vm.selection.length !== 1) {
				vm.data = [];
				return;
			}

			vm.axios.get('/get_users', {
				params: {
					active_owner: vm.getActiveOwner,
					history: vm.getActivePolicy,
					service: vm.selection.map(row => row.name).join(','),
					expand_users: vm.expandUser ? 1 : 0,
					display_property: vm.IPAsName ? 'name' : 'ip',
					filter_rules: vm.filterBySearch ? 1 : 0,
				}})
				.then(function (response) {
					vm.data = response.data.records;
				})
				.catch(function (error) {
					vm.data = [];
					alert('get_users: ' + error);
				}
			);
		}
	}
}
</script>

<style>

</style>
