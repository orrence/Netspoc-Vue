<template>

<div class="tablediv" ref="box">
  <div ref="table"></div>

</div>

</template>

<script>

import Tabulator from 'tabulator-tables';
import _ from 'lodash'; // throttle/debounce

export default {
    props: ['config'],
    data: () => ({
        tabulator: null, //variable to hold your table
    }),
    watch: {
        //update table if data changes
        "config.data": {
            handler: function (newData) {
                this.tabulator.replaceData(newData);
            },
        },
    },
    mounted () {
        this.tabulator = new Tabulator(
            this.$refs.table,
            Object.assign(this.config, {})
        );

        /* $nextTick ist die Vue-interne Möglichkeit, nach dem rendern
           noch Code auszuführen. Scheinbar ist zum Zeitpunkt des nextTick
           die Höhe des umgebenden Containers aber noch nicht die richtige:
           die Tabelle wird zu hoch.*/
/*
        this.$nextTick(() => {
            this.config.height = this.$refs.box.clientHeight-2;
            this.tabulator.setHeight(this.config.height);
        });
*/
        setTimeout(() => {
            this.config.height = this.$refs.box.clientHeight;
            this.tabulator.setHeight(this.config.height);
        }, 100)
        window.addEventListener('resize',
                                _.debounce(this.handleWindowResize, 100))
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.handleWindowResize)

    },
    methods: {
        handleWindowResize() {
            /* wenn die Fenstergröße verkleinert wird, kann sich div nicht
               kleiner machen als die Tabelle. Um die dem Fenster angepasste
               Größe von div zu erhalten, wird daher zunächt die
               kleinstmögliche Tabelle gerendert.*/
            this.tabulator.setHeight(0);
            /* Leider braucht das umgebende div eine Weile, um seine
               richtige Größe zu finden. Wird die Tabelle direkt gezeichnet,
               ist die Höhe von div manch,al noch = 0, daher wieder eine
               Zeitverzögerung.*/
            setTimeout(() => {
                this.config.height = this.$refs.box.clientHeight;
                this.tabulator.setHeight(this.config.height);
            }, 50)
        },
    },
}
</script>

<style>
.tablediv {
    height: 100%;
}
</style>
