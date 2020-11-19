<template>
    <v-row dense :align="'center'">
      <v-col>
        <v-checkbox
          id="cb_expand_user"
          :value="expandUser"
          @change="expandUserChange"
          :disabled="tab_details !== 0"
          label="User expandieren"
          class="pl-2"
        />
      </v-col>
      <v-col>
        <v-checkbox id="cb_show_names" :value="IPAsName" @change="IPAsNameChange" :disabled="tab_details !== 0" label="Namen statt IPs" />
      </v-col>
      <v-col>
        <v-checkbox
          id="cb_filter_search"
          :value="filterBySearch"
          @change="filterBySearchChange"
          :disabled="serviceTabNumber !== 3"
          label="Filtern nach Suche"
        /> 
      </v-col>
    </v-row>
</template>

<script>
import {mapState } from "vuex";

export default {
    props: ['expandUser','tab_details','tab_services','filterBySearch','IPAsName'],
    computed: {
         ...mapState("services", ["serviceTabNumber"]),
    },
    watch: {
      serviceTabNumber: {
        handler() {
         
        }
      }
    },
    methods: {
        expandUserChange(val) {
            this.$emit('expandUserChanged', val);
        },
        IPAsNameChange(val) {
            this.$emit('IPAsNameChanged', val);
        },
        filterBySearchChange(val) {
             this.$emit('filterBySearchChanged', val);
        }
    }
}
</script>
