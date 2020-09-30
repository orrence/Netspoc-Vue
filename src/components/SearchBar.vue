<template>
  <v-row dense>
    <v-col>
      <v-expansion-panels tile hover>
        <v-expansion-panel>
          <v-expansion-panel-header>Suchoptionen</v-expansion-panel-header>
          <v-expansion-panel-content>
            <ServiceSearchPanel />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import ServiceSearchPanel from "../components/ServiceSearchPanel";

export default {
  components: {
    ServiceSearchPanel,
  },
};
</script>