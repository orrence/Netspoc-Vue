<template>
	<v-container tableContainer>
		<v-card>
			Search
		</v-card>
		<v-layout fill-height justify-space-between>

			<v-container item	>

				<v-tabs
				v-model="tab_services"
				grow
				slider-color="orange"
				>
					<v-tab>Eigene</v-tab>
					<v-tab>Genutzte</v-tab>
					<v-tab>Nutzbare</v-tab>
				</v-tabs>
				<!-- tabulator in tab is not loaded sometimes -->
				<div><!-- <v-tabs-items v-model="tab"> -->
					<div><!-- <v-tab-item> -->
						<Tabulator 
						v-if="tab_services == 0 && Object.keys(own.data).length > 0" 
						:config="own"
						></Tabulator>
					</div><!-- </v-tab-item> -->
					<div><!-- <v-tab-item> -->
						<Tabulator 
						v-if="tab_services == 1 && Object.keys(used.data).length	 > 0" 
						:config="used"
						></Tabulator>
					</div><!-- </v-tab-item> -->
					<div><!-- <v-tab-item> -->
						<Tabulator 
						v-if="tab_services == 2 && Object.keys(usable.data).	length > 0"
						:config="usable"
						></Tabulator> 
					</div><!-- </v-tab-item> -->
				</div><!-- </v-tabs-items> -->
			</v-container>

			<v-container item >
				<v-tabs
					v-model="tab_details"
					slider-color="orange"
					grow
				>
					<v-tab>Details zum Dienst</v-tab>
					<v-tab>Benutzer (User) des Dienstes</v-tab>
				</v-tabs>

				<div v-if="tab_details === 0">
					<v-layout wrap>
						<v-checkbox class="mx-1" height="0px" 
						label="User expandieren" v-model="expandUser"
						></v-checkbox>
						<v-checkbox class="mx-1" height="0px" 
						label="Namen statt IPs" v-model="IPAsName"
						></v-checkbox>
						<br/>
						<v-checkbox class="mx-1" height="0px" 
						label="mehr Details" v-model="showDetails"
						></v-checkbox>
						<v-checkbox class="mx-1" height="0px" 
						label="Filtern nach Suche" v-model="filterBySearch" disabled
						></v-checkbox>
					</v-layout>
					<v-container v-if="selected && showDetails" fluid grid-list-xl>
						<v-layout row justify-space-between>
							<div>name:</div>
							<div>{{ selected.name }}</div>
						</v-layout>
						<v-layout row justify-space-between>
							<div>description:</div>
							<div>{{ selected.description }}</div>
						</v-layout>
						<v-layout row justify-space-between>
							<div>owner:</div>
							<v-flex>
								<v-layout column wrap>
									<div align="right" 
									v-for="item in selected.owner"
									:key="item.name"
									>
									{{item.name}}
									</div>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-container>
				</div>

				<service-rules-table 
				v-if="selected && tab_details === 0"
				:selection="selected"
				:expandUser="expandUser"
				:IPAsName="IPAsName"
				:filterBySearch="filterBySearch"
				></service-rules-table>
				<service-users-table 
				v-else-if="selected && tab_details === 1"
				:selection="selected"
				></service-users-table>
			</v-container>

		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './tables/Tabulator';
import ServiceRulesTable from './tables/ServiceRulesTable';
import ServiceUsersTable from './tables/ServiceUsersTable';

	export default {
		components: {
			Tabulator,
			ServiceRulesTable,
			ServiceUsersTable
		},
		data: () => ({
			tab_services: -1,
			tab_details: 0,
			services: {},
			own: {
				columns: [
					{ title: 'Name', field: 'name' },
				],
				data: [],
				layoutColumnsOnNewData:true,
			},
			used: {
				columns: [
					{ title: 'Name', field: 'name' },
				],
				data: [],
				layoutColumnsOnNewData:true,
			},
			usable: {
				columns: [
					{ title: 'Name', field: 'name' },
				],
				data: [],
				layoutColumnsOnNewData:true,
			},
			tabOpenedBefore: [],
			selected: null,
			expandUser: false,
			IPAsName: false,
			filterBySearch: true,
			showDetails: false,
		}),
		mounted () {
			this.tab_services = 0;
		},
		computed: mapState(['active']),
		watch : {
			active: {
				deep: true,
				handler (/*newActive, oldActive*/) {
					if(this.tabOpenedBefore[0]) {
						this.getServices(this.own, 'owner');
					}
					if(this.tabOpenedBefore[1]) {
						this.getServices(this.used, 'user');
					}
					if(this.tabOpenedBefore[2]) {
						this.getServices(this.usable, 'visible');
					}

					this.selected = null;
					/*
					if (this.selected) {
						if (oldActive.owner !== newActive.owner) {
							switch (this.tab_services) {
								case 0:
									if(!this.own.data.some(service => service.name === this.selected.name)) {
										this.selected = null;
									}
									break;
								case 1:
									if(!this.used.data.some(service => service.name === this.selected.name)) {
										this.selected = null;
									}
									break;
								case 2:
									if(!this.usable.data.some(service => service.	name === this.selected.name)) {
										this.selected = null;
									}
									break;
								default:
									this.selected = null;
									alert("woopsie while updating tabs");
							}
						} else { this.selected = null; }
					}
					*/
				}
			},
			tab_services: {
				handler (newTab) {
					this.selected = null;

					if(!this.tabOpenedBefore[newTab]) {
						switch (newTab) {
							case 0:
								this.getServices(this.own, 'owner');
								break;
							case 1:
								this.getServices(this.used, 'user');
								break;
							case 2:
								this.getServices(this.usable, 'visible');
								break;
							default:
								alert("woopsie while changing tabs");
						}
						this.tabOpenedBefore[newTab] = true;
					}
				}
			}
		},
		methods: {
			addClickEvent (serviceObject) {
				serviceObject.rowClick = function (e, row) {
					this.selected = row.getData();
				}.bind(this);
			},
			getServices (serviceObject, relation) {
				var vm = this;	// get vue instance
				if (!vm.active.owner) {
					return;
				}
				vm.axios.get('/service_list', {
					params: {
						chosen_networks: '',
						active_owner: vm.active.owner,
						history: vm.active.policy.date,
						relation: relation,
					}
				}).then(function (response) {
					serviceObject.data = response.data.records;
					vm.addClickEvent(serviceObject);
				}).catch(function (error) {
					serviceObject.data = [];
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
