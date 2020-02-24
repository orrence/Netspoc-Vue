<template>
<div class="tabbox" ref="tabbox">
	<Tabulator :config="getFullConfig()"/>
</div>
</template>

<script>
import Tabulator from './Tabulator';
import { mapState } from 'vuex';

export default {
	components: {
		Tabulator,
	},
	props: [
		'relation',
		'tab_search',
		'search_ip1',
		'search_ip2',
		'search_proto',
		'search_string',
		'search_description',
		'search_supernet',
		'search_subnet',
		'search_range',
		'search_own',
		'search_used',
		'search_visible',
		'search_disable_at',
		'search_case_sensitive',
		'search_exact',
	],
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
		}
	},
	mounted () {
		this.getServices()
	},
	methods: {
		getServices () {
			if (!this.active.owner) {
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
					search_ip1: vm.tab_search === 0 ? vm.search_ip1 : '',
					search_ip2: vm.tab_search === 0 ? vm.search_ip2 : '',
					search_proto: vm.tab_search === 0 ? vm.search_proto : '',
					search_string: vm.tab_search === 1 ? vm.search_string : '',
					search_in_desc: vm.tab_search === 1 ? (vm.search_description ? 'on' : '') : '',
					search_supernet: vm.tab_search === 0 ? (vm.search_supernet ? 'on' : '') : '',
					search_subnet: vm.tab_search === 0 ? (vm.search_subnet ? 'on' : '') : '',
					search_range: vm.tab_search === 0 ? (vm.search_range ? 'on' : '') : '',
					search_own: vm.search_own ? 'on' : '',
					search_used: vm.search_used ? 'on' : '',
					search_visible: vm.search_visible ? 'on' : '',
					search_disable_at: vm.search_disable_at ? 'on' : '',
					search_case_sensitive: vm.search_case_sensitive ? 'on' : '',
					search_exact: vm.search_exact ? 'on' : ''
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
.tabbox {
	height: 100%;
}
</style>
