<template>
<v-combobox
id="combo_policy"
label="Policy"
v-model="policy"
:items="history"
:item-text="show"
outlined
dense
color="orange"
/>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'combo-policy',
	computed: {
		...mapState({ history: 'history' }),
		policy: {
			get () { return this.$store.state.active.policy; },
			set (val) { this.$store.commit('setActivePolicy', val); }
		}
	},
	methods: {
		show (val) {
			return val.date + " | " + val.policy;
		}
	}
}
</script>
