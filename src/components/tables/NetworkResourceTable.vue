<template>
<Tabulator
:name="`Netzressourcen`"
:columns="[
	{
		title: 'IP-Addresse',
		field: 'child_ip', sorter:'ip'
	},
	{
		title: 'Name',
		field: 'child_name'
	},
	{
		title: 'Verantwortungsbereich',
		field: 'child_owner'
	}
]"
:data="data"
:selectable="false"
:groupBy="'name'"
/>
</template>

<script>
import { mapGetters } from 'vuex';
import Tabulator from './Tabulator';
export default {
	components: {
		Tabulator,
	},
	props:['selection'],
	data: () => ({
		data: [],
	}),
	computed: mapGetters(['getActiveOwner', 'getActivePolicy']),
	watch: {
		selection: function () {
			this.data = [];
			this.getNetworkResources();
		}
	},
	mounted () {
		this.getNetworkResources();
	},
	methods: {
		getNetworkResources () {
			var vm = this;	// get vue instance

			if (!vm.getActiveOwner || !vm.getActivePolicy || !vm.selection) {
				vm.data = [];
				return;
			}

			vm.axios.get('/get_network_resources', {
				params: {
					active_owner: vm.getActiveOwner,
					history: vm.getActivePolicy,
					selected_networks: vm.selection.join(',')
				}
			}).then(function (response) {
				var resdata = response.data.records;
				for (let i = 0; i < resdata.length; i++) {
					if (resdata[i].child_owner) {
						resdata[i].child_owner = resdata[i].child_owner.owner;
					}
				}
				vm.data = resdata;
			}).catch(function (error) {
				vm.data = [];
				alert('get_network_resources: ' + error);
			});
		}
	}
}
</script>

<style>

</style>
