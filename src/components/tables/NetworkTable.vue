<template>
<Tabulator
:name="`Netze_${active.owner}_${active.policy ? active.policy.date : ''}`"
:columns="[
	{
		title: 'IP-Addresse',
		field: 'ip',
		sorter: 'ip',
	},
	{
		title:'Name',
		field:'name',
	},
	{
		title:'Verantwortungsbereich',
		field:'owner',
	},
]"
:data="data"
:selectable="true"
:groupBy="''"
@selectionUpdate="passOnSelectionUpdate"
/>
</template>

<script>
import Tabulator from './Tabulator';
import { mapState } from 'vuex';

export default {
	components: {
		Tabulator,
	},
	data: () => ({
		data: [],
	}),
	computed: mapState(['active']),
	watch : {
		active: {
			deep: true,
			handler () {
				this.getNetworks();
			}
		}
	},
	mounted () {
		this.getNetworks()
	},
	methods: {
		getNetworks () {
			var vm = this;   // get vue instance
			if (!vm.active.owner) {
				vm.data = [];
				return;
			}
			vm.axios.get('/get_networks', {
				params: {
					chosen_networks: '',
					active_owner: vm.active.owner,
					history: vm.active.policy.date
				}
			}).then(function (response) {
				vm.data = response.data.records;
			}).catch(function (error) {
				vm.data = [];
				alert('get_networks: ' + error);
			});
		},
		passOnSelectionUpdate(data) {
			this.$emit('selectionUpdate', data.map(row => row.name));
		}
	}
}
</script>
