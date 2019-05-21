<template>
<v-container >
	<v-treeview 
		:items="bTree"
		open-all
	></v-treeview>
</v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'diff-tree',
	props: {
		oldPolicy: {
			type: String,
			required: true
		}
	},
	data: () => ({
		bTree: [],
		ic: 0
	}),
	computed: mapState(['active']),
	mounted () {
		this.getDiff();
	},
	methods: {
		morphTree (backendTree) {
			if (backendTree.length == 0) { return; }
			for (let i = 0; i < backendTree.length; i++){ 
				Object.defineProperty(
					backendTree[i], 'id', {
						value: this.ic++,
						writable: false
						}
					); 
				if (backendTree[i].text) {
					Object.defineProperty(
						backendTree[i], 'name',
						Object.getOwnPropertyDescriptor(backendTree[i], "text")
						);
				} else {
					Object.defineProperty(
						backendTree[i], 'name',
						Object.getOwnPropertyDescriptor(backendTree[i], "iconCls")
						);
				}
				
				delete backendTree[i]["text"];

				if (!backendTree[i].leaf) {
					this.morphTree(backendTree[i].children);
				}
			}
		},
		getDiff () {
			var vm = this;	// get vue instance
			if (!vm.active.owner) {
				return;
			}
			vm.axios.get('/get_diff', {
				params: {
					active_owner: vm.active.owner,
					history: vm.active.policy.date,
					version: vm.oldPolicy
				}
			}).then(function (response) {
				vm.bTree = response.data;
				vm.morphTree(vm.bTree);
			}).catch(function (error) {
				vm.bTree = [];
				alert('get_networks: ' + error);
			});
		}
  }
}
</script>

<style>

</style>
