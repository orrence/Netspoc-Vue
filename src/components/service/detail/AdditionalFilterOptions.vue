<template>
  <v-row dense :align="'center'" class="py-1" >
    <v-col>
      <v-checkbox
        id="cb_expand_user"
        :value="expandUser"
        @change="expandUserChange"
        :disabled="tab_details !== 0"
        label="User expandieren"
        class="pl-2 mt-0"
        hide-details="false"
      />
    </v-col>
    <v-col>
      <v-checkbox
        id="cb_show_names"
        hide-details="false"
        class="mt-0"
        :value="IPAsName"
        @change="IPAsNameChange"
        :disabled="tab_details !== 0"
        label="Namen statt IPs"
      />
    </v-col>
    <v-col>
      <v-checkbox
        id="cb_filter_search"
        hide-details="false"
        :value="filterBySearch"
        @change="filterBySearchChange"
        :disabled="serviceTabNumber !== 3"
        label="Filtern nach Suche"
        class="mt-0"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: [
    "expandUser",
    "tab_details",
    "tab_services",
    "filterBySearch",
    "IPAsName",
  ],
  computed: {
    ...mapState("services", ["serviceTabNumber"]),
  },
  watch: {
    serviceTabNumber: {
      handler() {},
    },
  },
  methods: {
    expandUserChange(val) {
      this.$emit("expandUserChanged", val);
      this.$store.commit('services/SET_EXPAND_USER',val);
    },
    IPAsNameChange(val) {
      this.$emit("IPAsNameChanged", val);
      this.$store.commit('services/SET_IPASNAME',val);
    },
    filterBySearchChange(val) {
      this.$emit("filterBySearchChanged", val);
      this.$store.commit('services/FILTER_BY_SEARCH',val);

    },
  },
};
</script>
