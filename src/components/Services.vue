<template>
<v-container tableContainer>
	<v-expansion-panels 
	v-if="tab_services === 3"
	v-model="pnl_search"
	>	
		<v-expansion-panel>
			<v-expansion-panel-header 
			>
				Suche
				<!-- <template v-slot:actions>
					<v-icon color="teal">search</v-icon>
				</template> -->
			</v-expansion-panel-header>
			<v-expansion-panel-content>
				<v-tabs 
				v-model="tab_search"
				:height="20"
				slider-color="orange"
				grow
				>
					<v-tab>Regeln</v-tab>
					<v-tab>Beschreibung</v-tab>
					<v-tab>Netzauswahl</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab_search">
					<v-tab-item>
						<v-subheader>Wonach soll gesucht werden?</v-subheader>
						<v-text-field label="IP 1" v-model="txtf_search_ip1" id="txtf_search_ip1" color="orange"></v-text-field>
						<v-text-field label="IP 2" v-model="txtf_search_ip2" id="txtf_search_ip2" color="orange"></v-text-field>
						<v-text-field label="Protokoll" v-model="txtf_search_proto" id="txtf_search_proto" color="orange"></v-text-field>
						<v-layout row wrap>
							<v-checkbox 
							v-model="cb_search_supernet"
							label="Übergeordnete Netze einbeziehen" 
							></v-checkbox>
							<v-checkbox 
							v-model="cb_search_subnet"
							label="Enthaltene Netze einbeziehen" 
							></v-checkbox>
							<v-checkbox 
							v-model="cb_search_range"
							label="Port-Ranges einbeziehen" 
							></v-checkbox>
						</v-layout>
					</v-tab-item>
			
					<v-tab-item>
						<v-subheader>Suchbegriff</v-subheader>
						<v-text-field label="Suchbegriff" v-model="txtf_search_string" id="txtf_search_string"></v-text-field>
						<v-checkbox 
						v-model="cb_search_description"
						label="Suche auch in Dienstbeschreibungen" 
						></v-checkbox>
					</v-tab-item>

					<v-tab-item>
						<v-subheader>Eigene Netze zur Auswahl</v-subheader>
						<network-selection-table></network-selection-table>
					</v-tab-item>
				</v-tabs-items>
			
				<v-subheader>In welchen Diensten suchen?</v-subheader>
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
					v-model="cb_search_visible"
					label="Nutzbare" 
					></v-checkbox>
					<v-checkbox 
					v-model="cb_search_limited"
					label="Nur befristete Dienste suchen" 
					></v-checkbox>
				</v-layout>
			
				<v-subheader>Allgemeine Optionen</v-subheader>
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
			
				<v-layout align-right>
					<v-btn color="success" @click="searchUpdate">suchen</v-btn>
				</v-layout>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
	<v-layout fill-height justify-space-between>

		<v-container item>
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
				<v-tab-item :key="0" class="tablediv">
					<ServiceTable :relation="'owner'" @clicked="onRowClick"/>
				</v-tab-item>
				<v-tab-item :key="1" class="tablediv">
					<ServiceTable :relation="'user'" @clicked="onRowClick"/>
				</v-tab-item>
				<v-tab-item :key="2" class="tablediv">
					<ServiceTable :relation="'visible'" @clicked="onRowClick"/>
				</v-tab-item>
				<v-tab-item :key="3" class="tablediv">
					<ServiceTable
					:tab_search="tab_search"
					:search_ip1="txtf_search_ip1"
					:search_ip2="txtf_search_ip2"
					:search_proto="txtf_search_proto"
					:search_supernet="cb_search_supernet"
					:search_subnet="cb_search_subnet"
					:search_range="cb_search_range"
					:search_own="cb_search_own"
					:search_used="cb_search_used"
					:search_visible="cb_search_visible"
					:search_disable_at="cb_search_limited"
					:search_case_sensitive="cb_search_case_sensitive"
					:search_exact="cb_search_exact"
					@clicked="onRowClick"
					/>
				</v-tab-item>
			</v-tabs-items>
		</v-container>

		<v-container item>
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
					<v-checkbox 
					v-if="tab_services===3 && tab_search===0"
					class="mx-1" height="0px" 
					label="Filtern nach Suche" v-model="filterBySearch" 
					></v-checkbox>
				</v-layout>
				<v-container v-if="selected && showDetails" fluid grid-list-xl>
					<!-- <v-layout row justify-space-between>
						<div>name:</div>
						<div>{{ selected.name }}</div>
					</v-layout> -->
					<v-layout row justify-space-between>
						<div>Beschreibung:</div>
						<div>{{ selected.description }}</div>
					</v-layout>
					<v-layout row justify-space-between>
						<div>Verantwortung:</div>
						<br/>
						<v-flex>
							<v-layout column wrap>
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
							</v-layout>
						</v-flex>
					</v-layout>
				</v-container>
			</div>

			<service-rules-table 
			v-if="selected && tab_details === 0 && tab_services !== 3"
			:selection="selected"
			:expandUser="expandUser"
			:IPAsName="IPAsName"
			></service-rules-table>
			<!-- property :filterBySearch evaluates to false, if the user 
				is not searching on tab_search === 1, because filtering the details 
				by a service name or owner is pointless -->
			<service-rules-table 
			v-else-if="selected && tab_details === 0"
			:selection="selected"
			:expandUser="expandUser"
			:IPAsName="IPAsName"
			:filterBySearch="tab_search === 0 && filterBySearch"
			:search_ip1="txtf_search_ip1"
			:search_ip2="txtf_search_ip2"
			:search_proto="txtf_search_proto"
			:search_supernet="cb_search_supernet"
			:search_subnet="cb_search_subnet"
			:search_range="cb_search_range"
			:search_own="cb_search_own"
			:search_used="cb_search_used"
			:search_visible="cb_search_visible"
			:search_limited="cb_search_limited"
			:search_case_sensitive="cb_search_case_sensitive"
			:search_exact="cb_search_exact"
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
import ServiceTable from './tables/ServiceTable';
import ServiceRulesTable from './tables/ServiceRulesTable';
import ServiceUsersTable from './tables/ServiceUsersTable';
import NetworkSelectionTable from './tables/NetworkSelectionTable';

export default {
	components: {
		ServiceTable,
		ServiceRulesTable,
		ServiceUsersTable,
		NetworkSelectionTable,
	},
	data: () => ({
		pnl_search: 0,
		tab_search: 0,
		tab_services: -1,
		tab_details: 0,
		txtf_url: "http://localhost/?#/services/0",
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
		cb_search_visible: false,
		cb_search_limited: false,
		cb_search_case_sensitive: false,
		cb_search_exact: false,
		selected: null,
		expandUser: false,
		IPAsName: false,
		filterBySearch: true,
		showDetails: false,
		admins: {},
	}),
	mounted () {
		if (this.$route.params.search.length === 1) {
			this.tab_services = 0;
		} else {
			this.tab_services = 3;
			this.setSearchParams(this.$route);
			if (this.txtf_search_string) { this.tab_search = 1 }
		}
	},
	beforeRouteUpdate (to) {
		if (this.$route.params.search.length > 1) {
			this.setSearchParams(to);
			if (this.txtf_search_string) { this.tab_search = 1 }
			else { this.tab_search = 0 }
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
		setSearchParams (route) {
			var vm = this;
			var params = route.params.search.split(';');
			vm.txtf_search_ip1 = '';
			vm.txtf_search_ip2 = '';
			vm.txtf_search_proto = '';
			vm.txtf_search_string = '';
			vm.cb_search_description = false;
			vm.cb_search_subnet = false;
			vm.cb_search_own = false;
			vm.cb_search_used = false;
			params.forEach( function (str)	{
				if (str.includes("ip1")) { vm.txtf_search_ip1 = str.match(/:(.*)/)[1].replace('\\','/'); }
				else if (str.includes("ip2")) { vm.txtf_search_ip2 = str.match(/:(.*)/)[1].replace('\\','/'); }
				else if (str.includes("prt")) { vm.txtf_search_proto = str.match(/:(.*)/)[1].replace('\\',' '); }
				else if (str.includes("sea")) { vm.txtf_search_string = str.match(/:(.*)/)[1].replace('\\',' '); }
				else if (str==="des") { vm.cb_search_description = true }
				else if (str==="sup") { vm.cb_search_supernet = true }
				else if (str==="sub") { vm.cb_search_subnet = true }
				else if (str==="ran") { vm.cb_search_range = true }
				else if (str==="own") { vm.cb_search_own = true }
				else if (str==="use") { vm.cb_search_used = true }
				else if (str==="usa") { vm.cb_search_visible = true }
				else if (str==="lim") { vm.cb_search_limited = true }
				else if (str==="sen") { vm.cb_search_case_sensitive = true }
				else if (str==="exa") { vm.cb_search_exact = true }
			});
		},
		onRowClick(rowData) {
			this.selected = rowData;
		},
		searchUpdate () {
			var search = "";

			if (this.txtf_search_ip1) {
				let str = "ip1:" + this.txtf_search_ip1 + ";";
				search += str.replace('/', '\\');
			}
			if (this.txtf_search_ip2) {
				let str = "ip2:" + this.txtf_search_ip2 + ";";
				search += str.replace('/', '\\');
			}
			if (this.txtf_search_proto) {
				let str = "ptr:" + this.txtf_search_proto + ";";
				search +=	str.replace(' ', '\\');
			}
			if (this.txtf_search_string) {
				let str = "ptr:" + this.txtf_search_string + ";";
				search +=	str.replace(' ', '\\');
			}
			if (this.cb_search_description) { search += "des;" }
			if (this.cb_search_supernet) { search += "sup;" }
			if (this.cb_search_subnet) { search += "sub;" }
			if (this.cb_search_range) { search += "ran;" }
			if (this.cb_search_own) { search += "own;" }
			if (this.cb_search_used) { search += "use;" }
			if (this.cb_search_visible) { search += "usa;" }
			if (this.cb_search_limited) { search += "lim;" }
			if (this.cb_search_case_sensitive) { search += "sen;" }
			if (this.cb_search_exact) { search += "exa;" }

			window.history.pushState('services', 'Suche', `/services/${search}`);
			this.getSearchedServices();
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

.tableContainer {
	height: 50%;
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
	height: calc(100% - 6ex);
}
</style>
