<template>
<v-autocomplete
id="combo_policy"
label="Policy"
v-model="policy"
:items="getHistory"
:item-text="show"
outlined
dense
color="orange"
/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	name: 'combo-policy',
	computed: {
		...mapGetters(['getHistory']),
		policy: {
			get () { return this.$store.state.active.policy; },
			set (val) {
				var history = this.getHistory;
				for (var i = 0; i < history.length; i++) {
					if (val.slice(13) === history[i].policy) {
						this.setActivePolicy(history[i]);
						return;
					}
				}
			}
		}
	},
	methods: {
		...mapActions(['setActivePolicy']),
		show (val) {
			return val.date + " | " + val.policy;
		}
	}
}
</script>
