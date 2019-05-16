<template>
	<v-container tableContainer>
		<v-layout fill-height justify-space-between>

			<div item elevation-4 v-if="Object.keys(networks).length > 0">
				<Tabulator :title="'Netzauswahl'" :config="getConfig()">
				<!-- hier kann zeug rein -->
				</Tabulator> 
			</div>

			<div item elevation-4 v-if="selected">
				<ResourceTable :title="'Enthaltene Ressourcen'" v-bind:selection="selected"></ResourceTable>
			</div>

		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './tables/Tabulator';
import ResourceTable from './tables/ResourceTable';

export default {
	components: {
		Tabulator,
		ResourceTable
	},
	data: () => ({
		networks: {},
		selected: null,
		config : {
			columns: [
				{ title: 'IP-Addresse', field: 'ip', sorter: 'ip' },
				{ title: 'Name', field: 'name' },
				{ title: 'Verantwortungsbereich', field: 'owner' },
			],
			data: [],
			layoutColumnsOnNewData:true,
		}
	}),
	mounted () {
		this.getNetworks();
	},
	computed: mapState(['active']),
	watch : {
		active: {
			deep: true,
			handler () {
				this.getNetworks();
				this.selected = null;
			}
		}
	},
	methods: {
		getConfig: function () {
			var c = this.config;
			c.rowClick = function(e, row) {
				this.selected = row.getData().name;
			}.bind(this);
			return c;
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
				vm.networks = response.data.records;
				vm.config.data = response.data.records;
			}).catch(function (error) {
				vm.networks = {};
				vm.config.data = {};
				alert('get_networks: ' + error);
			});
		}
   }
 }
</script>

<style>
	.tableContainer {
    height: 100%;
  }

	.item {
    /*min-height: 50px;*/
    /*min-width: 80px;*/
    margin: 8px;
  }
</style>
