<template>
  <v-container fluid>
    <v-row dense :justify="'center'">
      <v-col cols="6">
        <h3>Netzauswahl</h3>
        <NetworkTable
          @selectionUpdate="captureSelectionUpdate"
        />
      </v-col>
      <v-col cols="6">
        <h3>Enthaltene Ressourcen</h3>
        <ResourceTable :selection="selection" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NetworkTable from "../components/tables/Network/NetworkTable";
import ResourceTable from "../components/tables/Network/NetworkResourceTable";

export default {
  components: {
    NetworkTable,
    ResourceTable,
  },
  data: () => ({
    selection: [],
  }),
  methods: {
    captureSelectionUpdate(data) {
      console.log('DATEN LADEN');
      this.selection = data;
    },
  },
};
</script>
