<template>
<Tabulator
:name="`Netze`"
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
:height="height"
@selectionUpdate="passOnSelectionUpdate"
/>
</template>

<script>
import Tabulator from './Tabulator';
import { mapState, mapGetters } from 'vuex';

export default {
	props: ['height'],
	components: {
		Tabulator,
	},
	data: () => ({
		data: [],
	}),
	computed: {
		...mapState(['active']),
		...mapGetters(['getActiveOwner', 'getActivePolicy']),
	},
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
			if (!vm.getActiveOwner) {
				vm.data = [];
				return;
			}

			vm.axios.get('/get_networks', {
				params: {
					active_owner: vm.getActiveOwner,
					history: vm.getActivePolicy,
					chosen_networks: ''
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
