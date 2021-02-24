<template>
  <div id="table_supervisors">
    <Tabulator
      :name="`Verantwortliche`"
      :tableconfig="{
        reactiveData: true,
        index: 'name',
      }"
      :columns="[
        {
          title: 'Übergeordnete',
          field: 'name',
        },
      ]"
      :data="ownerSupervisorsData"
      :height="height"
    />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapState, mapGetters, mapActions } from "vuex";
import urlSearchParams from "../c../../../mixins/urlSearchParams";

export default {
  mixins: [urlSearchParams],
  props: ["height"],
  components: {
    Tabulator,
  },
  data: () => ({
    data: [],
    selectionModel: "",
  }),
  mounted() {
    this.loadOwnerSupervisors();
  },
  computed: {
    ...mapState("responsibilities", ["ownerSupervisorsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
  },
  methods: {
    ...mapActions("responsibilities", ["getOwnerSupervisors"]),
    loadOwnerSupervisors() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
      };
      console.log( "Load owner admins")
      console.dir(params)
      this.getOwnerSupervisors(params);
    },
  },
}
</script>
