<template>
<Tabulator
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
:groupBy="'service'"
/>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './Tabulator';
export default {
	components: {
		Tabulator,
	},
	props:['filterBySearch', 'selection'],
	data: () => ({
		data: [],
		unfinishedData: [],
		requests: 0,
		pending: false,
	}),
	computed: mapState(['active']),
	watch: {
		requests: function (value) {
			if (value === 0) {
				this.data = this.unfinishedData;
				this.unfinishedData = [];
				if (this.pending) {
					this. getUsers();
				}
			}
		},
		selection: function () { this.getUsers(); }
	},
	mounted () {
		this.getUsers();
	},
	methods: {
		getUsers () {
			var vm = this;	// get vue instance
			if (!vm.active.owner || !vm.active.policy || vm.selection.length === 0) {
				vm.pending = false;
				vm.requests = 0;
				vm.unfinishedData = [];
				vm.data = [];
			} else if (vm.requests > 0) {
				vm.pending = true;
			} else {
				vm.pending = false;
				vm.unfinishedData = [];
				vm.requests = vm.selection.length;
				for (let i = 0; i < vm.selection.length; i++) {
					vm.axios.get('/get_users', {
						params: {
							expand_users: vm.expandUser ? 1 : 0,
							display_property: vm.IPAsName ? 'name' : 'ip',
							filter_rules: vm.filterBySearch ? 1 : 0,
							active_owner: vm.active.owner,
							history: vm.active.policy.date,
							chosen_networks: '',
							service: vm.selection[i]
						}})
						.then(function (response) {
							var resdata = response.data.records;
							for (let j = 0; j < resdata.length; j++) {
								// for grouping
								resdata[j].service = vm.selection[i]
							}
							vm.unfinishedData = vm.unfinishedData.concat(resdata);
							vm.requests--;
						})
						.catch(function (error) {
							vm.requests--;
							alert('get_users: ' + error);
						}
					);
				}
			}
		}
	}
}
</script>

<style>

</style>
