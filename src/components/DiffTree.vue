<template>
<div v-if="loaded">
	<!-- <v-checkbox 
	v-model="collapse"
	label="Nodes Zusammenfassen" 
	/>
		<v-treeview
		:items="collapsedTree"
		open-all
		dense
		open-on-click
		/> -->
			
		<v-treeview 
		:items="tree"
		open-all
		dense
		open-on-click
		/>
		<!-- {{ collapsedTree }} -->
</div>
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
		collapse: true,
		tree: [],
		collapsedTree: [],
		loaded:false,
		ic: 1
	}),
	computed: {
		...mapState(['active']),
	},
	mounted () {
		this.getDiff();
	},
	watch : {
		active: {
			deep: true,
			handler () {
				this.getDiff();
			}
		},
		oldPolicy () {
			this.getDiff();
		}
	},
	methods: {
		morphTree (tree) {
			if (tree.length === 0) { return; }
			for (let i = 0; i < tree.length; i++){ 
				Object.defineProperty(
					tree[i], 'id', {
						value: this.ic++,
						writable: false
						}
					); 
				if (tree[i].text) {
					Object.defineProperty(
						tree[i], 'name',
						Object.getOwnPropertyDescriptor(tree[i], "text")
						);
				} else {
					Object.defineProperty(
						tree[i], 'name',
						Object.getOwnPropertyDescriptor(tree[i], "iconCls")
						);
				}
				
				delete tree[i]["text"];

				if (!tree[i].leaf) {
					this.morphTree(tree[i].children);
				}
			}
		},
		extraMorphTree (targetTree, tree) {
			for (let i = 0; i < tree.length; i++) {
				targetTree[i] = {...tree[i]};
				this.helpExtraMorphTree(targetTree[i]);
			}
		},
		helpExtraMorphTree (node) {
			if (node.leaf) { return; }
			if (node.children.length == 1 && !node.children[0].leaf) {
				if (!node.children[0].iconCls) {
					node.name += "/" + node.children[0].name;
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
				vm.tree = response.data;
				vm.morphTree(vm.tree);
				// vm.extraMorphTree(vm.collapsedTree, vm.tree); // experimental
				vm.loaded = true;
			}).catch(function (error) {
				vm.tree = [];
				vm.collapsedTree = [];
				alert('get_diff: ' + error);
			});
		}
  }
}
</script>
