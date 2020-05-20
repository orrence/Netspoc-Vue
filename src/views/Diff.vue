<!-- 
Todo: 
	- only show policies with changes
	- tree should always open showing the whole tree uncollapsed
-->

<template>
<v-container fluid>
	<h3>Vergleiche den ausgewählten Stand mit einem älteren</h3>
	<v-row dense :align="'center'">
		<v-col cols="6">
			<v-card tile>
				<v-card-text>
					{{availablePolicies}}
				</v-card-text>
			</v-card>
		</v-col>
		<v-col cols="6">
			<v-combobox 
			v-if="olderPolicies.length > 0"
			label="Vergleichsstand"
			:items="olderPolicies"
			v-model="oldPolicy"
			item-text="date"
			return-object
			outlined
			dense
			color="orange"
			class="pt-2"
			/>
		</v-col>
	</v-row>
	<v-row dense>
		<v-col>
			<v-card tile>
				<diff-tree v-if="!isEmpty(oldPolicy)" :oldPolicy="oldPolicy.date"></diff-tree>
			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
import diffTree from '../components/DiffTree';

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
	computed: {
		...mapState(['history', 'active']),
		availablePolicies () {
			if (this.olderPolicies && this.olderPolicies.length === 0)
				return "Keine älteren Stände verfügbar.";
			else if(this.olderPolicies && this.olderPolicies.length === 1)
				return "1 älterer Stand verfügbar.";
			else 
				return this.olderPolicies.length + "ältere Stände verfügbar.";
		}
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
