<template>
<v-container>
	
	<v-card v-if="olderPolicies.length > 0">
		<v-tab>Compare with {{olderPolicies.length}} older policies</v-tab>
		<combo-policy-compare :history="olderPolicies" :updateFunc="updateOldPolicy"></combo-policy-compare>  
	</v-card>
	<v-card v-else>
		<div>No older policies found.</div>
	</v-card>
	<br/>
	<v-card>
		<diff-tree v-if="oldPolicy" :oldPolicy="oldPolicy"></diff-tree>
	</v-card>
</v-container>
</template>

<script>
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
		activePolicy (val, oldVal) {
			if (val !== oldVal) {
				this.getOlderPolicies();
				this.oldPolicy = '';
			}
		}
	},
	computed: {
		history () {
			return this.$store.state.history;
		},
		activePolicy () {
			return this.$store.state.activePolicy;
		}
	},
	methods: {
		updateOldPolicy (value) {
			this.oldPolicy = value.date;
		},
		getOlderPolicies () {
			if (!this.activePolicy) {
				return;
			}
			var active = this.$store.state.activePolicy.date;
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
