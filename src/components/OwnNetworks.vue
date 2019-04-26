<template>
  <v-container>
    <ul>
			<li v-for="( network, i) in networks" :key=i>
				{{ i }} : {{ network }}
			</li>
		</ul>
  </v-container>
</template>

<script>

  export default {
    data: () => ({
      networks: {}
    }),
		mounted () {
			this.$store.dispatch('getActiveOwner');
			this.getNetworks();
    },
    methods: {
			getNetworks () {
				var vm = this;	// get vue instance
				if (!vm.$store.state.loggedIn && !vm.$store.state.activeOwner) {
					return;
				}

				vm.axios.get('/get_networks', {
					params: {
						chosen_networks: '',
						active_owner: vm.$store.state.activeOwner,
						history: 'p1'
					}
				}).then(function (response) {
					vm.networks = response.data.records;
				}).catch(function (error) {
					alert('get_networks: ' + error);
				});
			}
    }
  }
</script>

<style>

</style>
