<template>
	<v-container tableContainer>
		<v-layout fill-height justify-space-between>

			<div item elevation-4 v-if="Object.keys(services).length > 0">
				<Tabulator :title="'Eigene'" :config="getConfig()">
				<!-- hier kann zeug rein -->
				</Tabulator> 
			</div>

			<div item elevation-4 v-if="selected">
				<DetailsTable 
					:title="'Details zum Dienst'" 
					v-bind:selection="selected"
				></DetailsTable>
			</div>

		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './tables/Tabulator';
import DetailsTable from './tables/DetailsTable';

	export default {
		components: {
			Tabulator,
			DetailsTable
		},
		data: () => ({
			services: {},
			selected: null,
			config : {
				columns: [
					{ title: 'Name', field: 'name' },
				],
				data: [],
				layoutColumnsOnNewData:true,
			}
		}),
		mounted () {
			this.getServices();
		},
		computed: mapState(['active']),
		watch : {
			active: {
				deep: true,
				handler () {
					this.services = {};
					this.selected = null;
					this.getServices();
				}
			}
		},
		methods: {
			getConfig: function () {
				var c = this.config;
				c.rowClick = function(e, row) {
					this.selected = row.getData();
				}.bind(this);
				return c;
			},
			getServices () {
				var vm = this;	// get vue instance
				if (!vm.active.owner) {
					return;
				}
				vm.axios.get('/service_list', {
					params: {
						chosen_networks: '',
						active_owner: vm.active.owner,
						history: vm.active.policy.date,
						relation: 'owner'
					}
				}).then(function (response) {
					vm.services = response.data.records;
					vm.config.data = response.data.records;
				}).catch(function (error) {
					vm.services = {};
					vm.config.data = {};
					alert('service_list: ' + error);
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
