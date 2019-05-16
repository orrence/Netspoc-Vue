<template>
<v-container>
  <v-card>{{ loggedIn }}</v-card>
  <br/>
  <v-card>{{ owners }}</v-card>
  <br/>
  <v-card>{{ history }}</v-card>
  <br/>
  <v-card>{{ active }}</v-card>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: mapState(['loggedIn', 'owners', 'history', 'active']),
}
</script>