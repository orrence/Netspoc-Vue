<template>
  <v-app :dark="dark">
    <app-toolbar>
      <v-switch 
      append-icon
      v-model="dark"
      color="orange"
      >
        <template v-slot:label>
          <v-icon v-if="dark" color="pink">favorite</v-icon>
          <v-icon v-else large>invert_colors</v-icon>
        </template>
      </v-switch>
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
  })
}
</script>
