<template>
<v-container>
	
	<v-card v-if="olderPolicies.length > 0">
		<h3>Compare with {{olderPolicies.length}} older policies</h3>
		<combo-policy-compare :history="olderPolicies" :updateFunc="updateOldPolicy"></combo-policy-compare>  
	</v-card>
	<v-card v-else>
		<h1>No older policies found.</h1>
	</v-card>
	<br/>
	<v-card>
		<diff-tree v-if="oldPolicy" :oldPolicy="oldPolicy"></diff-tree>
	</v-card>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import comboPolicyCompare from './combos/PolicyCompare';
import diffTree from './DiffTree';

export default {
	components: {
		comboPolicyCompare,
		diffTree
	},
	data: () => ({
		olderPolicies: [],
		oldPolicy: ''
	}),
	mounted () {
		this.getOlderPolicies()
	},
	watch : {
		'active.policy' (val, oldVal) {
			if (val !== oldVal) {
				this.getOlderPolicies();
				this.oldPolicy = '';
			}
		}
	},
	computed: mapState(['history', 'active']),
	methods: {
		updateOldPolicy (value) {
			this.oldPolicy = value.date;
		},
		getOlderPolicies () {
			if (!this.active.policy) {
				return;
			}
			var active = this.active.policy.date;
			var newOld = [];
			for (let i = 0; i < this.history.length; i++) {
				if (active > this.history[i].date) {
					newOld.push(this.history[i]);
				}
			}
			this.olderPolicies = newOld;
		}
	}
}
</script>

<style>

</style>
