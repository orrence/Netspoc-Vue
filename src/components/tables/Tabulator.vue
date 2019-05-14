<template>
<v-flex>
  <div v-if="title">
    <!-- 
    <v-toolbar>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar> 
    -->
    <v-card>
      <v-tab>{{ title }}</v-tab>
      <slot></slot>
    </v-card>
  </div>
  <div ref="table" class="mytable"></div>
</v-flex>
</template>

<script>

import Tabulator from 'tabulator-tables';

export default {
  props: ['config', 'title'],
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
  },
}
</script>

<style>
  .mytable {
    max-height: calc(100vh - 112px);
  }
</style>
