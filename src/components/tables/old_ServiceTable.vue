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
	props:['relation'],
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
			var vm = this;  // get vue instance
			if (!vm.active.owner) {
				return;
			}
			vm.axios.get('/service_list', {
				params: {
					chosen_networks: '',
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					relation: vm.relation,
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
