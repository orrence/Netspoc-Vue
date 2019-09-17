<template>
  <v-app :dark="dark">
    <app-toolbar>
      <v-btn icon @click="invert">
        <v-icon v-if="dark" color="pink">favorite</v-icon>
        <v-icon v-else>invert_colors</v-icon>
      </v-btn>
    </app-toolbar>
    <v-content>
      <v-container>
        <!-- <keep-alive> -->
          <router-view/>
        <!-- </keep-alive> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppToolbar from './components/AppToolbar'

export default {
  name: 'App',
  components: {
    AppToolbar
  },
  data: () => ({
    dark: true
  }),
  methods: {
    invert () {
      this.dark = !this.dark;
    }
  }
}
</script>
