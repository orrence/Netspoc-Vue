<template>
<v-container>
	<h3> {{selectedRows}} Netze ausgewaehlt </h3>
	<br/>
	<v-btn color="red lighten-2" @click="selectAll">
		alle Netze auswaehlen
	</v-btn>
	.
	<v-btn color="red lighten-2" @click="deselectAll">
		alle Netze abwaehlen
	</v-btn>
	<br/><br/>
	<div v-show="data.length > 0" id="network-selection-table"></div>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from 'tabulator-tables';

export default {
	data: () => ({
		table: null,
		data: [],
		selected: [],
		selectedRows: 0
	}),
	mounted () {
		this.getNetworks();

		var vm = this;
		vm.table = new Tabulator("#network-selection-table", {
			height: "311px",
			layout: "fitColumns",
			selectable: true,
			data: vm.data,
			columns: [
				{ title: 'IP-Addresse', field: 'ip', sorter: 'ip' },
				{ title: 'Name', field: 'name' },
				{ title: 'Verantwortungsbereich', field: 'owner' },
			],
			rowSelectionChanged: function(selected){
				vm.selectedRows = selected.length;
			}
		});
	},
	computed: mapState(['active']),
	watch : {
		active: {
			deep: true,
			handler () {
				this.data = {};
				this.selected = [];
				this.getNetworks();
			}
		}
	},
	methods: {
		selectAll () {
			this.table.selectRow();
		},
		deselectAll () {
			this.table.deselectRow();
		},
		getNetworks () {
			var vm = this;	// get vue instance
			if (!vm.active.owner) {
				return;
			}
			vm.axios.get('/get_networks', {
				params: {
					chosen_networks: '',
					active_owner: vm.active.owner,
					history: vm.active.policy.date
				}
			}).then(function (response) {
				vm.data = response.data.records;
			}).catch(function (error) {
				vm.data = {};
				alert('get_networks: ' + error);
			});
		}
	}
}
</script>