<template>
  <v-app>
    <app-toolbar color="primary" />

    <v-main style="margin-top: 64px">
      <div class="fluid grid-list-md grey lighten-5 fill-height">
        <router-view />
      </div>
    </v-main>

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
          <v-btn color="primary" text @click="dialog = false" id="error_ok_btn">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import AppToolbar from "./components/AppToolbar";
import EventBus from "./plugins/event-bus";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    AppToolbar,
  },
  data() {
    return {
      dialog: false,
      windowheight: 600,
      errortext: "",
    };
  },
  computed: {
    ...mapGetters(["getActiveLoaded"]),
  },
  mounted() {
    /* let xlsxscript = document.createElement("script");
    xlsxscript.setAttribute("src", "js/xlsx.full.min.js");
    document.head.appendChild(xlsxscript);

    let pdfscript = document.createElement("script");
    pdfscript.setAttribute("src", "js/jspdf.min.js");
    document.head.appendChild(pdfscript);

    let autotablescript = document.createElement("script");
    autotablescript.setAttribute("src", "js/jspdf.plugin.autotable.js");
    document.head.appendChild(autotablescript); */
  },

  created() {
    var me = this;
    this.windowheight = window.innerHeight;
    if (this.$route.path == "/ldap_login" || this.$route.path == "/login") {
      this.$store.commit("setLoginpath", this.$route.path);
    }

    let meta = this.$route.meta;
    if (meta.requiresAuth == undefined || !meta.requiresAuth) {
      this.isPublicRoute = true;
    }
    EventBus.$on("httperror", function (selection) {
      me.errortext = selection.data.msg;
      me.$store.commit("services/SET_LOADING_CIRCLE", false);

      me.dialog = true;
    });
  },
};
</script>
 
<style>
@import "./assets/style.css";

/*invisible element below input fields causes misalignment*/
.v-text-field__details {
  display: none;
}
.v-application--wrap {
  /* display: block;
  min-height: 100% */
}
</style>
	