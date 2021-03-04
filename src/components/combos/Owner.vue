<template>
  <v-autocomplete
    id="combo_owner"
    label="Verantwortungsbereich"
    v-model="select"
    :items="getOwners"
    outlined
    dense
    :menu-props="{ auto: true }"
    color="orange"
  />
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "combo-owner",
  computed: {
    ...mapGetters(["getActiveOwner", "getOwners"]),
    select: {
      get() {
        return this.getActiveOwner;
      },
      set(val) {
        this.$store.commit("services/SET_LOADING_CIRCLE", true);
        this.$store.dispatch("setActive", val);
      },
    },
  },
};
</script>

<style>
/* remove unwanted margins made by vuetify */
.v-select-list .v-list .v-input__slot {
  margin-bottom: 0 !important;
  margin-top: 20;
}
</style>
