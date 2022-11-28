<template>
  <v-container>
    <h1>Netspoc-Web 2</h1>

    <v-card :loading="false" class="mx-auto">
      <v-card-title primary-title>
        <h4>{{loginTitle}}</h4>
      </v-card-title>

      <v-system-bar v-if="loginError" color="error" id="bar_login_failed"
        >Kombination aus Benutzername / E-Mail und Passwort
        inkorrekt</v-system-bar
      >

      <v-system-bar
        v-else-if="!login || !password"
        color="warning"
        id="bar_login_empty"
        >Anmeldedaten eingeben</v-system-bar
      >

      <v-form
        class="mx-2"
        @submit="submit"
        v-model="valid"
        onsubmit="return false"
      >
        <v-text-field
          id="txt_login"
          v-model="login"
          autofocus
          ref="userInputField"
          :rules="[(v) => !!v || 'Darf nicht leer sein']"
          required
          :label="isLDAPLogin ? 'Benutzername' : 'E-Mail-Adresse'"
          prepend-icon="person"
        ></v-text-field>

        <v-text-field
          id="txt_password"
          v-model="password"
          :append-icon="show ? 'visibility' : 'visibility_off'"
          :rules="[(v) => !!v || 'Darf nicht leer sein']"
          :type="show ? 'text' : 'password'"
          @click:append="show = !show"
          required
          label="Passwort"
          prepend-icon="lock"
        ></v-text-field>

        <v-card-actions>
          <v-flex class="text-xs-right">
            <v-btn
              id="btn_login"
              type="submit"
              :disabled="!valid"
              primary
              large
              block
              >Login</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-form>
      <div v-if="!isLDAPLogin" class="pl-4 pb-4">
        <p class="mb-1">Für Dataport Mitarbeiter</p>
        <a style="display: block" @click="goToLDAPLogin"
          >Anmeldung über Verzeichnisdienst</a
        >
      </div>
    </v-card>

    <br />

    <v-card>
      <iframe src="/pwvue/pwvue/doku.php" width="100%" height="400" frameborder="0">
      </iframe>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "app-login",
  data: () => ({
    login: null,
    password: null,
    valid: true,
    show: false,
    isLDAPLogin: false,
    loginTitle : 'Login mit Email-Adresse und Kennwort'
  }),
  computed: {
    ...mapState("auth", ["loginError"]),
  },
  created() {
    if (this.$route.path == this.$LDAPLOGIN) {
      this.isLDAPLogin = true;
    }
  },
  watch: {
    $route(to) {
      if (to.path == this.$LDAPLOGIN) {
        this.isLDAPLogin = true;
        this.loginTitle = 'Anmeldung über Verzeichnisdienst';
      } else if (to.path == this.$STANDARDLOGIN) {
        this.isLDAPLogin = false;
        this.loginTitle = 'Login mit Email-Adresse und Kennwort';
      }
    },
  },
  methods: {
    ...mapActions("auth", ["loginUser"]),

    submit() {
      var vm = this;

      this.$store.commit("setLoginpath", this.$route.path);
      let user = "email";
      
      if(this.$route.path == this.$LDAPLOGIN) {
        user = "user";
      }
      const formData = new FormData();

      formData.append(user, vm.login);
      formData.append("pass", vm.password);
      this.loginUser({ data: formData });
    },
    clear() {
      this.password = null;
    },
    goToLDAPLogin() {
      this.$refs.userInputField.focus();
      this.isLDAPLogin = true;
      this.$router.push({ path: "ldap_login" });
    },
  },
};
</script>
