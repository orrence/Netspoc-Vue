<template>
<v-autocomplete
	id="combo_owner"
	label="Verantwortungsbereich"
	v-model="select"
	:items="getOwners"
	outlined
	dense
	:menu-props="{ auto: true}"
	color="orange"
/>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'combo-owner',
	data: () => ({
		lastSelected: "",
		loadedOwner: false,
		loadedActiveOwner: false
	}),
	computed: {
		...mapGetters(['getActiveOwner', 'getOwners']),
		select: {
			get () { return this.getActiveOwner; },
			set (val) { 
				this.$store.commit("services/SET_LOADING_CIRCLE", true);
				this.$store.dispatch('setActive', val); }
		},
	},
	mounted () {
		this.$store.dispatch('requestOwners')
			.then(() => {
				this.loadedOwner = true;
			});
		this.$store.dispatch('requestActive')
			.then(() => {
				this.loadedActiveOwner = true;
			});
	},
	methods: {
		filterClicked() {
			console.log('FILTER WAS CLICKED');
		}
	}
}
</script>

<style>
/* remove unwanted margins made by vuetify */
.v-select-list .v-list .v-input__slot { 
	margin-bottom: 0 !important;
	margin-top: 20;
}
</style>
