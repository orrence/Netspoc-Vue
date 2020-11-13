<template>
  <v-app>
    <app-toolbar color="primary" />
    <v-content>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-content>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Fehler </v-card-title>

        <v-card-text class="py-4">
          Es ist ein Fehler aufgetreten: <br />
          <p v-html="errortext" />
          Bitte versuchen Sie es erneut oder wenden Sie sich an die
          Fachabteilung.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import AppToolbar from "./components/AppToolbar";
import EventBus from "./plugins/event-bus";

export default {
  name: "App",
  components: {
    AppToolbar,
  },
  data() {
    return {
      dialog: false,
      errortext: "",
    };
  },
  created() {
    var me = this;
    EventBus.$on("httperror", function (selection) {
      console.log("ERROR NOW");
      console.log(selection);
      me.errortext = selection.data.msg;
      me.$store.commit("services/SET_LOADING_CIRCLE", false);

      me.dialog = true;
    });
  },
};
</script>
 
<style>
/*invisible element below input fields causes misalignment*/
.v-text-field__details {
  display: none;
}
</style>
	