<template>
  <v-card tile class="fill-height" elevation="1">
    <v-tabs
      background-color="lightgray"
      v-model="tab_details"
      slider-color="orange"
    >
      <v-tab>Details zum Dienst</v-tab>
      <v-tab>Benutzer (User) des Dienstes</v-tab>
    </v-tabs>

    <additional-filter-options :tab_details="tab_details" />

    <v-tabs-items v-model="tab_details">
      <v-tab-item :key="0">
        <service-rules-table :search_input="searchInput" />
      </v-tab-item>
      <v-tab-item :key="1">
        <service-users-table />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import ServiceUsersTable from "../../tables/Service/ServiceUsersTable";
import ServiceRulesTable from "../../tables/Service/ServiceRulesTable";
import AdditionalFilterOptions from "./AdditionalFilterOptions";

import { mapState, mapGetters } from "vuex";

export default {
  components: {
    ServiceUsersTable,
    ServiceRulesTable,
    AdditionalFilterOptions,
  },
  data: () => ({
    pnl_search: 0,
    tab_details: 0,
    admins: {},
  }),

  computed: {
    ...mapState("services", [
      "searchInput",
      "serviceTabNumber",
    ]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  }
};
</script>