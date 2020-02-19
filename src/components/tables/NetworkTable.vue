<template>
<div  class="tabbox" ref="tabbox">
  <Tabulator :config="getFullConfig()"></Tabulator>
</div>
</template>

<script>
import Tabulator from './Tabulator';

export default {
    components: {
        Tabulator,
    },
    props : ['input'],
    data: () => ({
        config : {
            columns: [
                {
                    title: 'IP-Addresse',
                    field: 'ip',
                    sorter: 'ip',
                },
                {
                    title:'Name',
                    field:'name',
                },
                {
                    title:'Verantwortungsbereich',
                    field:'owner',
                },
            ],
            data: [],
            layout: "fitColumns",
            layoutColumnsOnNewData:true,
            placeholder:"No Data Available",
            height: "0",
        },
    }),
    mounted () {
        this.config.data = this.input;
    },
    methods: {
        /* Die rowclick-funktion ist nicht direkt in der Config spezifiziert,
           weil ich sonst nicht mit this an die Daten rankomme -
           gibt es einen anderen Weg? */
        getFullConfig: function () {
            var c = this.config;
            c.rowClick = function(e, row) {
                this.$emit('clicked', row.getData().name);
            }.bind(this);
            return c;
        },
    },
}
</script>

<style>
.tabbox {
    height: 100%;
}
</style>
