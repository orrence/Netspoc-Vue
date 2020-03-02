<template>
<div class="tabbox" ref="tabbox">
	<div id="posidiv" class="posidiv"/>
	<Tabulator :config="getFullConfig()"/>
	{{config.data}}
</div>
</template>

<script>
import Tabulator from './Tabulator';
import { mapState } from 'vuex';

export default {
	components: {
		Tabulator,
	},
	props: ['relation', 'search_input'],
	data: () => ({
		config : {
			columns: [
				{ title: 'Name', field: 'name' },
			],
			data: [],
			layout: "fitColumns",
			layoutColumnsOnNewData:true,
			placeholder:"No Data Available",
			// height: "0",
		},
	}),
	computed: mapState(['active']),
	watch : {
		active: {
			deep: true,
			handler () {
				this.$emit('clicked', null);
				this.getServices();
			}
		},
		search_input: {
			deep: true,
			handler (newVal) {
				if(newVal){
					this.getServices();
				}
			}
		}
	},
	mounted () {
		if(this.search_input){
			this.getServices();
		}
	},
	methods: {
		getServices () {
			if (!this.active.owner || !this.relation && !this.search_input) {
				alert('no active owner or no relation and search input');
				return;
			}
			
			var vm = this;	// get vue instance
			vm.axios.get('/service_list', {
				params: vm.relation ? {	
					chosen_networks: '',
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					relation: vm.relation
				} : {
					chosen_networks: '',
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					relation: '',
					search_ip1: vm.input.tab_search === 0 ? vm.input.search_ip1 : '',
					search_ip2: vm.input.tab_search === 0 ? vm.input.search_ip2 : '',
					search_proto: vm.input.tab_search === 0 ? vm.input.search_proto : '',
					search_string: vm.input.tab_search === 1 ? vm.input.search_string : '',
					search_in_desc: vm.input.tab_search === 1 ? (vm.input.search_description ? 'on' : '') : '',
					search_supernet: vm.input.tab_search === 0 ? (vm.input.search_supernet ? 'on' : '') : '',
					search_subnet: vm.input.tab_search === 0 ? (vm.input.search_subnet ? 'on' : '') : '',
					search_range: vm.input.tab_search === 0 ? (vm.input.search_range ? 'on' : '') : '',
					search_own: vm.input.search_own ? 'on' : '',
					search_used: vm.input.search_used ? 'on' : '',
					search_visible: vm.input.search_visible ? 'on' : '',
					search_disable_at: vm.input.search_disable_at ? 'on' : '',
					search_case_sensitive: vm.input.search_case_sensitive ? 'on' : '',
					search_exact: vm.input.search_exact ? 'on' : ''
				}
			}).then(function (response) {
				vm.config.data = response.data.records;
			}).catch(function (error) {
				vm.config.data = [];
				alert('service_list: ' + error);
			});
		},

		/* Die rowclick-funktion ist nicht direkt in der Config spezifiziert,
		   weil ich sonst nicht mit this an die Daten rankomme -
		   gibt es einen anderen Weg? */
		getFullConfig: function () {
			var c = this.config;
			c.rowClick = function(e, row) {
				this.$emit('clicked', row.getData());
			}.bind(this);
			return c;
		},
	},
}
</script>

<style>
.posidiv {
	background-color: blue;
	height:10px;
}
.tabbox {
	height: 100%;
}
</style>
