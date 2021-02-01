<template>
  <v-app-bar app color="primary" dark v-if="getLoggedIn">
    <v-tabs  slider-color="orange">
      <v-tab id="tab_services" to="/services">Dienste</v-tab>

      <v-tab id="tab_networks" to="/networks">Netze</v-tab>

      <v-tab id="tab_diff" to="/diff">Unterschiede</v-tab>
    </v-tabs>

    <v-spacer />

    <combo-policy id="comb_policy" class="mx-1 pt-1" />
    <combo-owner id="comb_owner" class="mr-1 pt-1" />

    <v-btn id="btn_logout" class="secondary" @click="logout">logout</v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import comboPolicy from "./combos/Policy";
import comboOwner from "./combos/Owner";
export default {
  name: "app-toolbar",
  components: {
    comboPolicy,
    comboOwner,
  },
  computed: {
    ...mapGetters("auth", ["getLoggedIn"]),
  },
  mounted() {
    this.requestLoggedIn;
  },
  methods: {
    ...mapActions("auth", ["requestLoggedIn", "setLoggedIn", "logoutUser"]),

    logout() {
      this.logoutUser();
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>