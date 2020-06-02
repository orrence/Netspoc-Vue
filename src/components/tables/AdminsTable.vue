<template>
<Tabulator
:name="`Verantwortliche`"
:columns="[
	{
		title: 'Verantwortung',
		field: 'email',
	}
]"
:data="data"
:selectable="false"
:groupBy="'owner'"
:height="'140px'"
/>
</template>

<script>
import Tabulator from './Tabulator';
import { mapState } from 'vuex';

export default {
	components: {
		Tabulator,
	},
	props:['selection'],
	data: () => ({
		data: [],
		buffer: [],
		requests: 0,
	}),
	computed: mapState(['active']),
	watch : {
		active: {
			deep: true,
			handler () {
				this.getAdminsForAllOwner();
			}
		},
		selection: {
			handler () {
				this.admins = {};
				this.getAdminsForAllOwner();
			}
		},
		requests (amount) {
			if(amount === 0){
				this.data = this.buffer;
				this.buffer = [];
			}
		}
	},
	mounted () {
		this.getAdminsForAllOwner();
	},
	methods: {
		getAdminsForAllOwner() {
			if (this.selection) {
				var owner = this.selection.owner.map(owner => owner.name);
				this.requests = owner.length;
				for (let i = 0; i < owner.length; i++) {
					this.getAdmins(owner[i]);
				}
			}
		},
		getAdmins(owner) {
			var vm = this;
			if (!vm.active.owner || !vm.active.policy) {
				this.requests--;
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
				var admins = response.data.records;
				for (let i = 0; i < admins.length; i++) {
					vm.buffer.push({
						'owner': owner,
						'email': admins[i].email
					});
				}
				vm.requests--;
			}).catch(function (error) {
				vm.requests--;
				alert(`get_admins(${owner}): ` + error);
			});
		},
	}
}
</script>
