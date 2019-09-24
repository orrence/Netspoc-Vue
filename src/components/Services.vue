<template>
	<v-container tableContainer>
		<v-expansion-panel>
			<v-expansion-panel-content>
				<template v-slot:actions>
					<v-icon>search</v-icon>
				</template>
				<template v-slot:header>
					<div>Suche</div>
				</template>
				<v-card>
					<v-tabs 
					v-model="tab_search"
					:height="20"
					slider-color="teal"
					grow
					>
						<v-tab>Ende-zu-Ende</v-tab>
						<v-tab>Allgemein</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tab_search">
						<v-tab-item>
							Wonach soll gesucht werden?
							<v-text-field label="IP 1" v-model="txtf_search_ip1" id="txtf_search_ip1"></v-text-field>
							<v-text-field label="IP 2" v-model="txtf_search_ip2" id="txtf_search_ip2"></v-text-field>
							<v-text-field label="Protokoll" v-model="txtf_search_proto" id="txtf_search_proto"></v-text-field>
							<v-layout row wrap>
								<v-checkbox 
								v-model="cb_search_supernet" value="cb_search_supernet"
								label="Übergeordnete Netze einbeziehen" 
								></v-checkbox>
								<v-checkbox 
								v-model="cb_search_subnet" value="cb_search_subnet"
								label="Enthaltene Netze einbeziehen" 
								></v-checkbox>
								<v-checkbox 
								v-model="cb_search_range" value="cb_search_range"
								label="Port-Ranges einbeziehen" 
								></v-checkbox>
							</v-layout>
						</v-tab-item>
				
						<v-tab-item>
							Suchbegriff
							<v-text-field label="Suchbegriff" id="txtf_search_string"></v-text-field>
							<v-checkbox 
							v-model="cb_search_description"
							label="Suche auch in Dienstbeschreibungen" 
							></v-checkbox>
						</v-tab-item>
					</v-tabs-items>
				
					In welchen Diensten suchen?
					<v-layout row wrap>
						<v-checkbox 
						v-model="cb_search_own"
						label="Eigene" 
						></v-checkbox>
						<v-checkbox 
						v-model="cb_search_used"
						label="Genutzte" 
						></v-checkbox>
						<v-checkbox 
						v-model="cb_search_usable"
						label="Nutzbare" 
						></v-checkbox>
						<v-checkbox 
						v-model="cb_search_limited"
						label="Nur befristete Dienste suchen" 
						></v-checkbox>
					</v-layout>
				
					Allgemeine Optionen
					<v-layout row wrap>				
						<v-checkbox 
						v-model="cb_search_case_sensitive"
						label="Groß-/Kleinschreibung beachten" 
						></v-checkbox>
						<v-checkbox 
						v-model="cb_search_exact"
						label="Suchergebnisse nur mit exakter Übereinstimmung" 
						></v-checkbox>
					</v-layout>
				
					<v-btn color="success" @click="refreshOpenedTabs">suchen</v-btn>
				</v-card>
			</v-expansion-panel-content>
		</v-expansion-panel>
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
				<div>
					<div>
						<Tabulator 
						v-if="tab_services == 0 && Object.keys(own.data).length > 0" 
						:config="own"
						></Tabulator>
					</div>
					<div>
						<Tabulator 
						v-if="tab_services == 1 && Object.keys(used.data).length	 > 0" 
						:config="used"
						></Tabulator>
					</div>
					<div>
						<Tabulator 
						v-if="tab_services == 2 && Object.keys(usable.data).	length > 0"
						:config="usable"
						></Tabulator> 
					</div>
				</div>
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
			tab_search: 0,
			tab_services: -1,
			tab_details: 0,
			txtf_search_ip1: "",
			txtf_search_ip2: "",
			txtf_search_proto: "",
			txtf_search_string: "",
			cb_search_description: true,
			cb_search_supernet: false,
			cb_search_subnet: true,
			cb_search_range: false,
			cb_search_own: true,
			cb_search_used: true,
			cb_search_usable: false,
			cb_search_limited: false,
			cb_search_case_sensitive: false,
			cb_search_exact: false,
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
					this.refreshOpenedTabs();

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
			refreshOpenedTabs () {
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
						search_ip1: vm.txtf_search_ip1,
						search_ip2: vm.txtf_search_ip2,
						search_proto: vm.txtf_search_proto,
						search_string: vm.txtf_search_string,
						search_in_desc: vm.cb_search_description ? 'on' : '',
						search_supernet: vm.cb_search_supernet ? 'on' : '',
						search_subnet: vm.cb_search_subnet ? 'on' : '',
						search_range: vm.cb_search_range ? 'on' : '',
						search_own: vm.cb_search_own ? 'on' : '',
						search_used: vm.cb_search_used ? 'on' : '',
						search_visible: vm.cb_search_usable ? 'on' : '',
						search_disable_at: vm.cb_search_limited ? 'on' : '',
						search_case_sensitive: vm.cb_search_case_sensitive ? 'on' : '',
						search_exact: vm.cb_search_exact ? 'on' : '',
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
