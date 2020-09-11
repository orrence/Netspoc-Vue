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
		<v-col cols="4">
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

		<v-col cols="8">
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
						class="pl-2"
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
						v-model="filterBySearch" 
						:disabled="tab_services !== 3"
						label="Filtern nach Suche"
						/>
					</v-col>
				</v-row>

				<v-row dense v-if="selection.length == 1">
					<v-col>
						<v-row dense :justify="'start'">
							<v-col cols="auto">
								<div class="pl-2">Beschreibung:</div>
							</v-col>
							<v-col cols="auto">
								<div>{{ selection[0].description }}</div>
							</v-col>
						</v-row>
						<v-row v-if="selection[0].disable_at" dense :justify="'start'">
							<v-col cols="auto">
								<div class="pl-2">Befristet bis:</div>
							</v-col>
							<v-col cols="auto">
								<div>{{ selection[0].disable_at }}</div>
							</v-col>
						</v-row>
						<v-row v-if="selection[0].disabled" dense :justify="'start'">
							<v-col cols="auto">
								<div class="pl-2">Status:</div>
							</v-col>
							<v-col cols="auto">
								<div>Disabled</div>
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

				<AdminsTable v-if="selection.length < 2" :selection="selection[0]"/>

			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import ServiceTable from '../components/tables/Service/ServiceTable';
import ServiceSearchPanel from '../components/ServiceSearchPanel';
import ServiceRulesTable from '../components/tables/Service/ServiceRulesTable';
import ServiceUsersTable from '../components/tables/Service/ServiceUsersTable';
import AdminsTable from '../components/tables/AdminsTable';

export default {
	components: {
		ServiceTable,
		ServiceSearchPanel,
		ServiceRulesTable,
		ServiceUsersTable,
		AdminsTable,
	},
	data: () => ({
		pnl_search: 0,
		tab_services: -1,
		tab_details: 0,
		selection: [],
		expandUser: false,
		IPAsName: false,
		filterBySearch: true,
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
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);
	},
	watch : {
		tab_services: {
			handler () {
				this.selection = [];
			}
		},
		search_input: {
			deep: true,
			handler () {
				this.selection = [];
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
		}
	}
}
</script>

<style>
.testitest {
	/*min-height: 600px;*/
	/*height: 100%;*/
}
</style>
