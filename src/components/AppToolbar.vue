<template>
<v-app-bar
app
dense
v-if="getLoggedIn"
elevate-on-scroll
>
	<v-tabs
	slider-color="orange"
	>
		<v-tab
		id="tab_services" 
		to="/services/0"
		> Dienste
		</v-tab>
		
		<v-tab
		id="tab_networks"
		to="/networks"
		> Netze
		</v-tab>
	
		<v-tab
		id="tab_diff"
		to="/diff"
		> Unterschiede
		</v-tab>
	</v-tabs>

	<v-spacer/>

	<combo-policy id="comb_policy" class="mx-1 pt-1"/>
	<combo-owner id="comb_owner" class="mr-1 pt-1"/>

	<v-btn id="btn_logout" @click="logout">logout</v-btn>
</v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import comboPolicy from './combos/Policy'
import comboOwner from './combos/Owner'
export default {
	name: 'app-toolbar',
	components: {
		comboPolicy,
		comboOwner
	},
	computed: {
		...mapGetters (['getLoggedIn'])
	},
	mounted () {
		this.requestLoggedIn;
	},
	methods: {
		...mapActions (['requestLoggedIn', 'setLoggedIn']),

		logout () {
			var vm = this;	// get vue instance

			vm.axios.get('/logout'
			).then(function () {
				vm.setLoggedIn(false);
				vm.$router.push('/login');
			}).catch(function (error) {
				alert('logout: ' + error);
			});
		}
	}
}
</script>

<style>
	a { text-decoration: none; }
</style>