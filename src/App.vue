<template>
  <v-app dark>
    <app-toolbar></app-toolbar>
    <v-content>
      <v-container>
        <keep-alive>
          <router-view/>
        </keep-alive>
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
  data () {
    return {
      //
    }
  }
}
</script>
