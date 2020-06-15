<template>
<v-container fluid>
	<v-tabs 
	v-model="cluster.tab_search"
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
			<v-row dense>
				<v-col>
					<v-text-field 
					outlined 
					dense 
					label="IP 1" 
					v-model="cluster.search_ip1" 
					id="txtf_search_ip1" 
					color="orange"
					/>
				</v-col>
				<v-col>
					<v-text-field 
					outlined 
					dense 
					label="IP 2" 
					v-model="cluster.search_ip2" 
					id="txtf_search_ip2" 
					color="orange"
					/>
				</v-col>
				<v-col>
					<v-text-field 
					outlined 
					dense 
					label="Protokoll" 
					v-model="cluster.search_proto" 
					id="txtf_search_proto" 
					color="orange"
					/>
				</v-col>
			</v-row>

			<v-row dense :align="'center'">
				<v-col>
				<v-checkbox 
					v-model="cluster.search_supernet"
					label="Übergeordnete Netze einbeziehen" 
					></v-checkbox>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_subnet"
					label="Enthaltene Netze einbeziehen" 
					></v-checkbox>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_range"
					label="Port-Ranges einbeziehen" 
					></v-checkbox>
				</v-col>
			</v-row>
		</v-tab-item>
	
		<v-tab-item>
			<v-subheader>Suchbegriff</v-subheader>
			<v-row dense>
				<v-col>
					<v-text-field outlined dense label="Suchbegriff" v-model="cluster.search_string" id="search_string"/>
				</v-col>
			</v-row>
			<v-row dense>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_description"
					label="Suche auch in Dienstbeschreibungen" 
					/>
				</v-col>
			</v-row>
			
		</v-tab-item>

		<v-tab-item>
			<NetworkTable :height="'311px'" @selectionUpdate="captureSelectionUpdate"/>
		</v-tab-item>
	</v-tabs-items>
	
	<v-divider/>

	<v-row dense :align="'center'">
		<v-col>
			<v-subheader>In welchen Diensten suchen?</v-subheader>
			<v-row dense :align="'center'">
				<v-col>
					<v-checkbox 
					v-model="cluster.search_own"
					label="Eigene" 
					/>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_used"
					label="Genutzte" 
					/>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_visible"
					label="Nutzbare" 
					/>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_limited"
					label="Nur befristete Dienste suchen" 
					/>
				</v-col>
			</v-row>		
		</v-col>
		<v-divider vertical/>
		<v-col>
			<v-subheader>Allgemeine Optionen</v-subheader>
			<v-row dense :align="'center'">				
				<v-col>
					<v-checkbox 
					v-model="cluster.search_case_sensitive"
					label="Groß-/Kleinschreibung beachten" 
					/>
				</v-col>
				<v-col>
					<v-checkbox 
					v-model="cluster.search_exact"
					label="Suchergebnisse nur mit exakter Übereinstimmung" 
					/>
				</v-col>
			</v-row>
		</v-col>
	</v-row>

	<v-row dense :justify="'end'">
		<v-col>
			<v-btn text color="success" @click="searchUpdate">suchen</v-btn>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import NetworkTable from './tables/NetworkTable';

export default {
	components: {
		NetworkTable
	},
	data: () => ({
		url: "http://localhost/?#/services/0",
		cluster: {
			tab_search: 0,
			search_ip1: "",
			search_ip2: "",
			search_proto: "",
			search_string: "",
			search_networks: [],
			search_description: true,
			search_supernet: false,
			search_subnet: true,
			search_range: false,
			search_own: true,
			search_used: true,
			search_visible: false,
			search_limited: false,
			search_case_sensitive: false,
			search_exact: false,
		},
	}),
	mounted () {
		if (this.$route.params.search.length > 1) {
			this.setSearchParams(this.$route);
			if (this.cluster.search_string) { this.tab_search = 1 }
			else { this.cluster.tab_search = 0 }
			this.emitSearchInputToParent();
		}
	},
	beforeRouteUpdate (to) {
		if (this.$route.params.search.length > 1) {
			this.setSearchParams(to);
			if (this.cluster.search_string) { this.tab_search = 1 }
			else { this.tab_search = 0 }
		}
	},
	methods: {
		setSearchParams (route) {
			var cluster = this.cluster;
			var params = route.params.search.split(';');
			cluster.search_ip1 = "";
			cluster.search_ip2 = "";
			cluster.search_proto = "";
			cluster.search_string = "";
			cluster.search_networks = [];
			cluster.search_description = false;
			cluster.search_subnet = false;
			cluster.search_own = false;
			cluster.search_used = false;
			params.forEach( function (str)	{
				if (str.includes("ip1")) { cluster.search_ip1 = str.match(/:(.*)/)[1].replace(/\\\\/g, '/'); }
				else if (str.includes("ip2")) { cluster.search_ip2 = str.match(/:(.*)/)[1].replace(/\\\\/g, '/'); }
				else if (str.includes("prt")) { cluster.search_proto = str.match(/:(.*)/)[1]; }
				else if (str.includes("sea")) { cluster.search_string = str.match(/:(.*)/)[1]; }
				// else if (str.includes("net")) { cluster.search_string = str.match(/:(.*)/)[1].replace(/\\\\/g, ':'); }
				else if (str==="des") { cluster.search_description = true }
				else if (str==="sup") { cluster.search_supernet = true }
				else if (str==="sub") { cluster.search_subnet = true }
				else if (str==="ran") { cluster.search_range = true }
				else if (str==="own") { cluster.search_own = true }
				else if (str==="use") { cluster.search_used = true }
				else if (str==="usa") { cluster.search_visible = true }
				else if (str==="lim") { cluster.search_limited = true }
				else if (str==="sen") { cluster.search_case_sensitive = true }
				else if (str==="exa") { cluster.search_exact = true }
			});
		},
		searchUpdate () {
			var search = "";
			var cluster = this.cluster;

			if (cluster.search_ip1) {
				let str = "ip1:" + cluster.search_ip1 + ";";
				search += str.replace(/\//g, '\\');
			}
			if (cluster.search_ip2) {
				let str = "ip2:" + cluster.search_ip2 + ";";
				search += str.replace(/\//g, '\\');
			}
			if (cluster.search_proto) {
				let str = "ptr:" + cluster.search_proto + ";";
				search +=	str;
			}
			if (cluster.search_string) {
				let str = "sea:" + cluster.search_string + ";";
				search +=	str;
			}
			// if (cluster.search_networks) {
			// 	let str = cluster.search_networks + ";";
			// 	search +=	"net:" + str.replace(/:/g, '\\');
			// }
			if (cluster.search_description) { search += "des;" }
			if (cluster.search_supernet) { search += "sup;" }
			if (cluster.search_subnet) { search += "sub;" }
			if (cluster.search_range) { search += "ran;" }
			if (cluster.search_own) { search += "own;" }
			if (cluster.search_used) { search += "use;" }
			if (cluster.search_visible) { search += "usa;" }
			if (cluster.search_limited) { search += "lim;" }
			if (cluster.search_case_sensitive) { search += "sen;" }
			if (cluster.search_exact) { search += "exa;" }

			window.history.pushState('services', 'Suche', `/services/${search}`);
			this.emitSearchInputToParent();
		},
		captureSelectionUpdate (data) {
			this.cluster.search_networks = data;
		},
		emitSearchInputToParent () {
			this.$emit('searchInputUpdate', {...this.cluster});
		},
	}
}
</script>