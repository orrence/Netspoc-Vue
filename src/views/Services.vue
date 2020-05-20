<template>
<v-container fluid>
	<v-row dense>
		<v-col>
			<v-expansion-panels tile hover>
				<v-expansion-panel>
					<v-expansion-panel-header>
						Suchoptionen
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<ServiceSearchPanel
						@searchInputUpdate="recieveSearchInput"
						/>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-col>
	</v-row>
	
	<v-row dense>
		<v-col cols="6">
			<v-card tile>
				<v-tabs
				v-model="tab_services"
				slider-color="orange"
				>
					<v-tab>Eigene</v-tab>
					<v-tab>Genutzte</v-tab>
					<v-tab>Nutzbare</v-tab>
					<v-tab><v-icon>search</v-icon></v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab_services">
					<v-tab-item :key="0">
						<ServiceTable :relation="'owner'" @selectionUpdate="captureSelectionUpdate"/>
					</v-tab-item>
					<v-tab-item :key="1">
						<ServiceTable :relation="'user'" @selectionUpdate="captureSelectionUpdate"/>
					</v-tab-item>
					<v-tab-item :key="2">
						<ServiceTable :relation="'visible'" @selectionUpdate="captureSelectionUpdate"/>
					</v-tab-item>
					<v-tab-item :key="3">
						<ServiceTable :search_input="search_input" @selectionUpdate="captureSelectionUpdate"/>
					</v-tab-item>
				</v-tabs-items>
			</v-card>
		</v-col>

		<v-col cols="6">
			<v-card tile>
				<v-tabs
				v-model="tab_details"
				slider-color="orange"
				>
					<v-tab>Details zum Dienst</v-tab>
					<v-tab>Benutzer (User) des Dienstes</v-tab>
				</v-tabs>

				<v-row dense :align="'center'">
					<v-col>
						<v-checkbox
						v-model="expandUser"
						:disabled="tab_details !== 0"
						label="User expandieren"
						/>
					</v-col>
					<v-col>
						<v-checkbox
						v-model="IPAsName"
						:disabled="tab_details !== 0"
						label="Namen statt IPs"
						/>
					</v-col>
					<v-col>
						<v-checkbox
						v-model="showDetails"
						:disabled="tab_details !== 0"
						label="mehr Details"
						/>
					</v-col>
					<v-col>
						<v-checkbox 
						v-model="filterBySearch" 
						:disabled="tab_services !== 3"
						label="Filtern nach Suche"
						/>
					</v-col>
				</v-row>

				<v-row dense v-if="showDetails && selection">
					<v-col>
						<v-row dense>
							<v-col>
								<div>Beschreibung:</div>
							</v-col>
							<v-col>
								<div>TODO</div>
								<!-- <div>{{ selection.description }}</div> -->
							</v-col>
						</v-row>
						<v-row dense>
							<v-col>
								<div>Verantwortung:</div>
							</v-col>
							<v-col>
								<v-expansion-panels flat tile multiple hover accordion>
									<v-expansion-panel 
									v-for="owner in selection.owner"
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

				<v-tabs-items v-model="tab_details">
					<v-tab-item :key="0">
						<service-rules-table 
						:selection="selection"
						:expandUser="expandUser"
						:IPAsName="IPAsName"
						:filterBySearch="filterBySearch && tab_services===3"
						:search_input="search_input"
						/>
					</v-tab-item>
					<v-tab-item :key="1">
						<service-users-table
						:filterBySearch="filterBySearch"
						:selection="selection"
						/>
					</v-tab-item>
				</v-tabs-items>
			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import ServiceTable from '../components/tables/ServiceTable';
import ServiceSearchPanel from '../components/ServiceSearchPanel';
import ServiceRulesTable from '../components/tables/ServiceRulesTable';
import ServiceUsersTable from '../components/tables/ServiceUsersTable';

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
		selection: [],
		expandUser: false,
		IPAsName: false,
		filterBySearch: true,
		showDetails: false,
		search_input: {},
		admins: {},
	}),
	computed: mapState(['active']),
	mounted () {
		// this.$nextTick(function() {
		// 	window.addEventListener('resize', this.resize);
		// 	//Init
		// 	this.resize();
		// });
		if (this.$route.params.search.length === 1) {
			this.tab_services = 0;
		} else {
			this.tab_services = 3;
		}
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);
	},
	watch : {
		tab_services: {
			handler () {
				this.selection = [];
			}
		},
		// selection: {
		// 	handler (newSelection) {
		// 		this.admins = {};
		// 		if (newSelection !== null) {
		// 			for (let i = 0; i < this.selection.owner.length; i++) {
		// 				this.getAdmins(this.selection.owner[i].name);
		// 			}
		// 		}
		// 	}
		// },
		search_input: {
			deep: true,
			handler () {
				this.selection = [];
				this. admins = null;
				this.tab_services = 3;
			}
		}
	},
	methods: {
		resize() {
			let elements = this.getElementsByClassName("testitest");
			for (let i = 0; i < elements; i++){
				elements[i].setAttribute("style", "min-height:400px; height:" + (window.innerHeight - elements[i].getBoundingClientRect().top) + "px;");
			}
		},
		getElementsByClassName(className) {
			if (document.getElementsByClassName) { 
				return document.getElementsByClassName(className);
			} else {
				return document.querySelectorAll('.' + className);
			} 
		},
		recieveSearchInput (newInput) {
			this.search_input = newInput;
		},
		captureSelectionUpdate(data) {
			this.selection = data;
		},
		getAdmins (owner) {
			var vm = this;
			if (!vm.active.owner || !vm.active.policy) {
				vm.admins = {};
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
				vm.admins = {};
				alert(`get_admins(${owner}): ` + error);
			});
		}
	}
}
</script>

<style>
.testitest {
	min-height: 600px;
	/*height: 100%;*/
}
</style>
