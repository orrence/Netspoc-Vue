<template>
	<v-container>
		<v-row class="row">

        <v-col class="item">
          <h2>Netzauswahl</h2>
          <div class="tablediv">
            <NetworkTable
               v-if="Object.keys(networks).length > 0" :input="networkData"
               @clicked="onRowClick">
            </NetworkTable>
          </div>
        </v-col>

        <v-col class="item">
           <h2>Enthaltene Ressourcen</h2>
           <div class="tablediv">
             <ResourceTable
                v-if="selected" :selection="selected">
             </ResourceTable>
           </div>
        </v-col>

		</v-row>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import NetworkTable from './tables/NetworkTable';
import ResourceTable from './tables/ResourceTable';

export default {
	components: {
		NetworkTable,
		ResourceTable
	},
	data: () => ({
       networks: {},
       selected: null,
       networkData: {},
	}),
	mounted () {
       this.getNetworks();
	},
	computed: mapState(['active']),
	watch : {
		active: {
			deep: true,
			handler () {
				this.networks = {};
				this.selected = null;
				this.getNetworks();
         }
      }
   },
    methods: {
        getNetworks () {
            var vm = this;	// get vue instance
            if (!vm.active.owner) {
                return;
            }
            vm.axios.get('/get_networks', {
                params: {
                    chosen_networks: '',
                    active_owner: vm.active.owner,
                    history: vm.active.policy.date
                }
            }).then(function (response) {
                vm.networks = response.data.records;
                vm.networkData = response.data.records;
            }).catch(function (error) {
                vm.networks = {};
                vm.networkData = {};
                alert('get_networks: ' + error);
            });
        },
        onRowClick(rowData) {
            this.selected = rowData;
            }
    }
}
</script>

<style>
.row {
    height: 100%;
}
.container {
    height: 100%;
}
.item {
    height: 100%;
}
.tablediv {
    /*wenn die Höhe zu groß für den umgebenden Container ist,
      wird die Tabelle nicht gerendert! - Warum? Default - lösung?*/
    /*besser schrifthöhe nehmen als pixel*/
    height: calc(100% - 6ex);
    }
</style>
