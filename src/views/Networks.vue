<template>
  <v-container fluid>
    <v-row dense :justify="'center'">
      <v-col cols="6">
        <h3>Netzauswahl</h3>
        <NetworkTable
          v-if="getActiveLoaded"
          @selectionUpdate="captureSelectionUpdate"
        />
      </v-col>
      <v-col cols="6">
        <h3>Enthaltene Ressourcen</h3>
        <ResourceTable v-if="getActiveLoaded" :selection="selection" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NetworkTable from "../components/tables/Network/NetworkTable";
import ResourceTable from "../components/tables/Network/NetworkResourceTable";
import { mapGetters } from "vuex";

export default {
  components: {
    NetworkTable,
    ResourceTable,
  },
  data: () => ({
    selection: [],
  }),
  computed: {
    ...mapGetters(["getActiveLoaded"]),
  },
  methods: {
    captureSelectionUpdate(data) {
      this.selection = data;
    },
  },
};
</script>
