<template>
    <v-row dense >
      <v-col>
        <v-row dense :justify="'start'">
          <v-col cols="auto">
            <div class="pl-2">Beschreibung:</div>
          </v-col>
          <v-col cols="auto">
            <div>{{ serviceSelection[0].description }}</div>
          </v-col>
        </v-row>
        <v-row v-if="serviceSelection[0].disable_at" dense :justify="'start'">
          <v-col cols="auto">
            <div class="pl-2">Befristet bis:</div>
          </v-col>
          <v-col cols="auto">
            <div>{{ serviceSelection[0].disable_at }}</div>
          </v-col>
        </v-row>
        <v-row v-if="serviceSelection[0].disabled" dense :justify="'start'">
          <v-col cols="auto">
            <div class="pl-2">Status:</div>
          </v-col>
          <v-col cols="auto">
            <div>Disabled</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
export default {
    props: ['serviceSelection']
}
</script>