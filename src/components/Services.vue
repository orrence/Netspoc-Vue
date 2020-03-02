<template>
<v-container>
	<v-row>
		<v-col>
			<v-card>
				<ServiceSearchPanel 
				v-show="tab_services === 3" 
				@searchInputUpdate="recieveSearchInput"
				/>
			</v-card>
		</v-col>
	</v-row>
	
	<v-row>
		<v-col>
				<v-tabs
				v-model="tab_services"
				grow
				slider-color="orange"
				>
					<v-tab>Eigene</v-tab>
					<v-tab>Genutzte</v-tab>
					<v-tab>Nutzbare</v-tab>
					<v-tab><v-icon>search</v-icon></v-tab>
				</v-tabs>
				<!-- tabulator in tab is not loaded sometimes -->
				<v-tabs-items v-model="tab_services">
					<v-tab-item :key="0">
						<ServiceTable :relation="'owner'" @clicked="onRowClick"/>
					</v-tab-item>
					<v-tab-item :key="1">
						<ServiceTable :relation="'user'" @clicked="onRowClick"/>
					</v-tab-item>
					<v-tab-item :key="2">
						<ServiceTable :relation="'visible'" @clicked="onRowClick"/>
					</v-tab-item>
					<v-tab-item :key="3">
						<ServiceTable :search_input="search_input" @clicked="onRowClick"/>
					</v-tab-item>
				</v-tabs-items>
		</v-col>

		<v-col>
			<v-tabs
			v-model="tab_details"
			slider-color="orange"
			grow
			>
				<v-tab>Details zum Dienst</v-tab>
				<v-tab>Benutzer (User) des Dienstes</v-tab>
			</v-tabs>

				<div v-if="tab_details === 0">
					<v-row>
						<v-col>
							<v-checkbox class="mx-1" height="0px" 
							label="User expandieren" v-model="expandUser"
							/>
						</v-col>
						<v-col>
							<v-checkbox class="mx-1" height="0px" 
							label="Namen statt IPs" v-model="IPAsName"
							/>
						</v-col>
						<br/>
						<v-col>
							<v-checkbox class="mx-1" height="0px" 
							label="mehr Details" v-model="showDetails"
							/>
						</v-col>
						<v-col>
							<v-checkbox 
							v-if="tab_services===3 && tab_search===0"
							class="mx-1" height="0px" 
							label="Filtern nach Suche" v-model="filterBySearch" 
							/>
						</v-col>
					</v-row>
					<v-row v-if="showDetails">
						<v-col>
							<v-row>
								<v-col>
									<div>Beschreibung:</div>
								</v-col>
								<v-col>
									<div>{{ selected.description }}</div>
								</v-col>
							</v-row>
							<v-row>
								<v-col>
									<div>Verantwortung:</div>
								</v-col>
								<v-col>
									<v-expansion-panels accordion multiple>
										<v-expansion-panel 
										v-for="owner in selected.owner"
										:key="owner.name"
										align="right"
										>
										<v-expansion-panel-header>{{owner.name}}</v-expansion-panel-header>
										<v-expansion-panel-content>
											<v-list>
												<v-list-item
												v-for="admin in admins[owner.name]"
												:key="admin"
												align="right"
												>
													<v-list-item-title>{{admin}}</v-list-item-title>
												</v-list-item>
											</v-list>
										</v-expansion-panel-content>
										</v-expansion-panel>
									</v-expansion-panels>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</div>

				<service-rules-table 
				v-if="tab_details === 0 && tab_services !== 3"
				:selection="selected"
				:expandUser="expandUser"
				:IPAsName="IPAsName"
				></service-rules-table>
				<!-- property :filterBySearch evaluates to false, if the user 
					is not searching on tab_search === 1, because filtering the details 
					by a service name or owner is pointless -->
				<service-rules-table 
				v-else-if="tab_details === 0"
				:selection="selected"
				:expandUser="expandUser"
				:IPAsName="IPAsName"
				:filterBySearch="tab_search === 0 && filterBySearch"
				:search_input="search_input"
				></service-rules-table>
				<service-users-table 
				v-else-if="tab_details === 1"
				:selection="selected"
				></service-users-table>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import ServiceTable from './tables/ServiceTable';
import ServiceSearchPanel from './ServiceSearchPanel';
import ServiceRulesTable from './tables/ServiceRulesTable';
import ServiceUsersTable from './tables/ServiceUsersTable';

export default {
	components: {
		ServiceTable,
		ServiceSearchPanel,
		ServiceRulesTable,
		ServiceUsersTable,
	},
	data: () => ({
		pnl_search: 0,
		tab_services: -1,
		tab_details: 0,
		selected: null,
		expandUser: false,
		IPAsName: false,
		filterBySearch: true,
		showDetails: false,
		search_input: {},
		admins: {},
	}),
	mounted () {
		if (this.$route.params.search.length === 1) {
			this.tab_services = 0;
		} else {
			this.tab_services = 3;
		}
	},
	computed: mapState(['active']),
	watch : {
		tab_services: {
			handler () {
				this.selected = null;
			}
		},
		selected: {
			handler (newSelected) {
				this.admins = {};
				if (newSelected !== null) {
					for (let i = 0; i < this.selected.owner.length; i++) {
						this.getAdmins(this.selected.owner[i].name);
					}
				}
			}
		}
	},
	methods: {
		recieveSearchInput (new_input) {
			alert(new_input);
			this.search_input = new_input;
		},
		onRowClick (rowData) {
			this.selected = rowData;
		},
		getAdmins (owner) {
			var vm = this;
			if (!vm.active.owner) {
				return;
			}
			vm.axios.get('/get_admins', {
				params: {
					chosen_networks: '',
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					owner: owner
				}
			}).then(function (response) {
				vm.admins[owner] = response.data.records;
				for (let i = 0; i < vm.admins[owner].length; i++) {
					vm.admins[owner][i] = vm.admins[owner][i].email;
				}
			}).catch(function (error) {
				alert(`get_admins(${owner}): ` + error);
			});
		}
	}
}
</script>

<style>
.compactForm {
	transform: scale(0.5);
	transform-origin: left;
}

.item {
	min-height: 50px;
	min-width: 80px;
	margin: 8px;
}

/*.v-tabs-bar.v-tabs-bar--is-mobile .v-tab {*/
	/*margin-left: 0px !important;*/
/*}*/

.v-slide-group__prev {
	display: none !important;
}

.tablediv {
	/*wenn die Höhe zu groß für den umgebenden Container ist,
		wird die Tabelle nicht gerendert! - Warum? Default - lösung?*/
	/*besser schrifthöhe nehmen als pixel*/
	/*height: calc(100% - 6ex);*/
}
</style>
