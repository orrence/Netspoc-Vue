<template>
<v-container >
	<v-treeview 
		v-if="loaded"
		open-all
		:items="bTree"
		dense
		open-on-click
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
		loaded:false,
		ic: 1
	}),
	computed: {
		...mapState(['active']),
	},
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
		extraMorphTree (backendTree) {
			for (let i = 0; i < backendTree.length; i++) {
				this.helpExtraMorphTree(backendTree[i]);
			}
		},
		helpExtraMorphTree (node) {
			if (node.leaf) { return; }
			if (node.children.length == 1 && !node.children[0].leaf) {
				if (!node.children[0].iconCls) {
					node.name += " / " + node.children[0].name;
					node.children = node.children[0].children;
					this.helpExtraMorphTree(node);
				} else {	
					for (let i = 0; i < node.children[0].children.length; i++) {
						switch (node.children[0].iconCls) {
							case "icon-add":
								node.children[0].children[i].name = "+ " + node.children[0].children[i].name;
								break;
							case "icon-delete":
								node.children[0].children[i].name = "- " + node.children[0].children[i].name;
								break;
							case "icon-page_edit":
								node.children[0].children[i].name = "! " + node.children[0].children[i].name;
								break;
							default:
								node.children[0].children[i].name = "? " + node.children[0].children[i].name;
								break;
						}
					}
					node.children = node.children[0].children;
				}
			} else {
				let swapList = [];
				for (let i = 0; i < node.children.length; i++) {
					if (!node.children[i].iconCls) {
						swapList.push(node.children[i]);
						this.helpExtraMorphTree(node.children[i]);
					} else {
						for (let j = 0; j < node.children[i].children.length; j++) {
							switch (node.children[i].iconCls) {
								case "icon-add":
									node.children[i].children[j].name = "+ " + node.children[i].children[j].name;
									break;
								case "icon-delete":
									node.children[i].children[j].name = "- " + node.children[i].children[j].name;
									break;
								case "icon-page_edit":
									node.children[i].children[j].name = "! " + node.children[i].children[j].name;
									break;
								default:
									node.children[i].children[j].name = "? " + node.children[i].children[j].name;
							}
							swapList.push(node.children[i].children[j]);
						}
					}
				}
				node.children = swapList;
			}
		},
		getDiff () {
			var vm = this;	// get vue instance
			vm.loaded = false;
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
				vm.ic = 0;
				vm.bTree = response.data;
				vm.morphTree(vm.bTree);
				vm.extraMorphTree(vm.bTree); // experimental
				vm.loaded = true;
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
