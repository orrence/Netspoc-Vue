<template>
<v-container >
	{{ printPlain() }}
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
		tree: null
	}),
	computed: mapState(['active']),
	mounted () {
		this.getDiff();
	},
	methods: {
		printPlain () {
			return this.tree;
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
				vm.tree = response.data;
			}).catch(function (error) {
				vm.tree = {};
				alert('get_networks: ' + error);
			});
		}
  }
}
</script>

<style>

</style>
