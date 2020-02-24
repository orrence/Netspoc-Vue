<template>
<div class="tabbox" ref="tabbox">
    <Tabulator :config="config"/>
</div>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './Tabulator';
export default {
    components: {
        Tabulator,
    },
    props:['selection'],
    data: () => ({
        config : {
            columns: [
                {
                    title: 'IP-Addresse',
                    field: 'ip', sorter:'ip'
                },
                {
                    title: 'Name',
                    field: 'name'
                },
                {
                    title: 'Verantwortungsbereich',
                    field: 'owner'
                },
            ],
            data: [],
            layout: "fitColumns",
            layoutColumnsOnNewData:true,
            placeholder: "No Data Available",
            height: "0",

        },
    }),
    computed: mapState(['active']),
    watch: {
        selection: function () {
            this.config.data = [];
            this.getHosts();
        }
    },
    mounted () {
        this.getHosts();
    },
    methods: {
        getHosts () {
            if (!this.selection) return;

            var vm = this;	// get vue instance
            vm.axios.get('/get_hosts', {
                params: {
                    network: vm.selection,
                    active_owner: vm.active.owner,
                    history: vm.active.policy.date
                }
            }).then(function (response) {
                vm.config.data = response.data.records;
            }).catch(function (error) {
                alert('get_hosts: ' + error);
            });
        }
    }
}
</script>

<style>
.tabbox {
    height: 100%
}
</style>
