<template>
<v-container>
	
	<h3>Vergleiche den ausgewählten Stand mit einem älteren</h3>
	<br/>

	<v-card>		
		<v-card-text v-if="olderPolicies.length === 0">
			Keine älteren Stände verfügbar.
		</v-card-text>
		<v-card-text v-else-if="olderPolicies.length === 1">
			1 älterer Stand verfügbar.
		</v-card-text>
		<v-card-text v-else>
			{{olderPolicies.length}} ältere Stände verfügbar.
		</v-card-text>

		<v-combobox v-if="olderPolicies.length > 0"
    label="Vergleichsstand"
    :items="olderPolicies"
    v-model="oldPolicy"
    item-text="date"
    return-object
    full-width
    filled
    color="orange"
  ></v-combobox>
	</v-card>

	<br/>
	
	<v-card>
		<diff-tree v-if="!isEmpty(oldPolicy)" :oldPolicy="oldPolicy.date"></diff-tree>
	</v-card>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import diffTree from './DiffTree';

export default {
	components: {
		diffTree
	},
	data: () => ({
		olderPolicies: [],
		oldPolicy: null
	}),
	mounted () {
		this.getOlderPolicies();
	},
	watch : {
		'active.policy' (val, oldVal) {
			if (val !== oldVal) {
				this.getOlderPolicies();

				if (this.olderPolicies.length > 0) {
					this.oldPolicy = this.olderPolicies[0];
				} else {
					this.oldPolicy = null;
				}
			}
		}
	},
	computed: mapState(['history', 'active']),
	methods: {
		isEmpty(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop))
					return false;
			}
			return true;
		},
		childMessageReceived (newSelected) {
			this.oldPolicy = newSelected;
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
