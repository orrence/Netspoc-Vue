<template>
<v-container>
	<v-tabs 
	v-model="cluster.tab_search"
	:height="20"
	slider-color="orange"
	grow
	>
		<v-tab>Regeln</v-tab>
		<v-tab>Beschreibung</v-tab>
		<v-tab>Netzauswahl</v-tab>
	</v-tabs>
	<v-tabs-items v-model="cluster.tab_search">
		<v-tab-item>
			<v-subheader>Wonach soll gesucht werden?</v-subheader>
			<v-row>
				<v-col>
					<v-text-field label="IP 1" v-model="cluster.txtf_search_ip1" id="txtf_search_ip1" color="orange"/>
				</v-col>
				<v-col>
					<v-text-field label="IP 2" v-model="cluster.txtf_search_ip2" id="txtf_search_ip2" color="orange"/>
				</v-col>
				<v-col>
					<v-text-field label="Protokoll" v-model="cluster.txtf_search_proto" id="txtf_search_proto" color="orange"/>
				</v-col>
			</v-row>

			<v-row>
				<v-col>
				<v-checkbox 
					v-model="cluster.cb_search_supernet"
					label="Übergeordnete Netze einbeziehen" 
					></v-checkbox>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.cb_search_subnet"
					label="Enthaltene Netze einbeziehen" 
					></v-checkbox>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.cb_search_range"
					label="Port-Ranges einbeziehen" 
					></v-checkbox>
				</v-col>
			</v-row>
		</v-tab-item>
	
		<v-tab-item>
			<v-subheader>Suchbegriff</v-subheader>
			<v-row>
				<v-col>
					<v-text-field label="Suchbegriff" v-model="cluster.txtf_search_string" id="txtf_search_string"/>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.cb_search_description"
					label="Suche auch in Dienstbeschreibungen" 
					/>
				</v-col>
			</v-row>
		</v-tab-item>

		<v-tab-item>
			<v-subheader>Eigene Netze zur Auswahl</v-subheader>
			<NetworkSelectionTable></NetworkSelectionTable>
		</v-tab-item>
	</v-tabs-items>

	<v-subheader>In welchen Diensten suchen?</v-subheader>
	<v-row>
		<v-col>
			<v-checkbox 
			v-model="cluster.cb_search_own"
			label="Eigene" 
			/>
		</v-col>
		<v-col>
			<v-checkbox 
			v-model="cluster.cb_search_used"
			label="Genutzte" 
			/>
		</v-col>
		<v-col>
			<v-checkbox 
			v-model="cluster.cb_search_visible"
			label="Nutzbare" 
			/>
		</v-col>
		<v-col>
			<v-checkbox 
			v-model="cluster.cb_search_limited"
			label="Nur befristete Dienste suchen" 
			/>
		</v-col>
	</v-row>

	<v-subheader>Allgemeine Optionen</v-subheader>
	<v-row>				
		<v-col>
			<v-checkbox 
			v-model="cluster.cb_search_case_sensitive"
			label="Groß-/Kleinschreibung beachten" 
			/>
		</v-col>
		<v-col>
			<v-checkbox 
			v-model="cluster.cb_search_exact"
			label="Suchergebnisse nur mit exakter Übereinstimmung" 
			/>
		</v-col>
	</v-row>

	<v-row :justify="'end'">
		<v-col>
			<v-btn color="success" @click="searchUpdate">suchen</v-btn>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
// import { mapState } from 'vuex';
import NetworkSelectionTable from './tables/NetworkSelectionTable';

export default {
	components: {
		NetworkSelectionTable
	},
	data: () => ({
		txtf_url: "http://localhost/?#/services/0",
		cluster: {
			tab_search: 0,
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
		},
	}),
	mounted () {
		if (this.$route.params.search.length > 1) {
			this.setSearchParams(this.$route);
			if (this.cluster.txtf_search_string) { this.tab_search = 1 }
			else { this.cluster.tab_search = 0 }
			this.emitSearchInputTpParent();
		}
	},
	beforeRouteUpdate (to) {
		if (this.$route.params.search.length > 1) {
			this.setSearchParams(to);
			if (this.cluster.txtf_search_string) { this.tab_search = 1 }
			else { this.tab_search = 0 }
		}
	},
	methods: {
		setSearchParams (route) {
			var cluster = this.cluster;
			var params = route.params.search.split(';');
			cluster.txtf_search_ip1 = '';
			cluster.txtf_search_ip2 = '';
			cluster.txtf_search_proto = '';
			cluster.txtf_search_string = '';
			cluster.cb_search_description = false;
			cluster.cb_search_subnet = false;
			cluster.cb_search_own = false;
			cluster.cb_search_used = false;
			params.forEach( function (str)	{
				if (str.includes("ip1")) { cluster.txtf_search_ip1 = str.match(/:(.*)/)[1].replace('\\','/'); }
				else if (str.includes("ip2")) { cluster.txtf_search_ip2 = str.match(/:(.*)/)[1].replace('\\','/'); }
				else if (str.includes("prt")) { cluster.txtf_search_proto = str.match(/:(.*)/)[1].replace('\\',' '); }
				else if (str.includes("sea")) { cluster.txtf_search_string = str.match(/:(.*)/)[1].replace('\\',' '); }
				else if (str==="des") { cluster.cb_search_description = true }
				else if (str==="sup") { cluster.cb_search_supernet = true }
				else if (str==="sub") { cluster.cb_search_subnet = true }
				else if (str==="ran") { cluster.cb_search_range = true }
				else if (str==="own") { cluster.cb_search_own = true }
				else if (str==="use") { cluster.cb_search_used = true }
				else if (str==="usa") { cluster.cb_search_visible = true }
				else if (str==="lim") { cluster.cb_search_limited = true }
				else if (str==="sen") { cluster.cb_search_case_sensitive = true }
				else if (str==="exa") { cluster.cb_search_exact = true }
			});
		},
		searchUpdate () {
			var search = "";
			var cluster = this.cluster;

			if (cluster.txtf_search_ip1) {
				let str = "ip1:" + cluster.txtf_search_ip1 + ";";
				search += str.replace('/', '\\');
			}
			if (cluster.txtf_search_ip2) {
				let str = "ip2:" + cluster.txtf_search_ip2 + ";";
				search += str.replace('/', '\\');
			}
			if (cluster.txtf_search_proto) {
				let str = "ptr:" + cluster.txtf_search_proto + ";";
				search +=	str.replace(' ', '\\');
			}
			if (cluster.txtf_search_string) {
				let str = "ptr:" + cluster.txtf_search_string + ";";
				search +=	str.replace(' ', '\\');
			}
			if (cluster.cb_search_description) { search += "des;" }
			if (cluster.cb_search_supernet) { search += "sup;" }
			if (cluster.cb_search_subnet) { search += "sub;" }
			if (cluster.cb_search_range) { search += "ran;" }
			if (cluster.cb_search_own) { search += "own;" }
			if (cluster.cb_search_used) { search += "use;" }
			if (cluster.cb_search_visible) { search += "usa;" }
			if (cluster.cb_search_limited) { search += "lim;" }
			if (cluster.cb_search_case_sensitive) { search += "sen;" }
			if (cluster.cb_search_exact) { search += "exa;" }

			window.history.pushState('services', 'Suche', `/services/${search}`);
			this.emitSearchInputTpParent();
		},
		emitSearchInputTpParent () {
			this.$emit('searchInputUpdate', this.cluster);
		}
	}
}
</script>