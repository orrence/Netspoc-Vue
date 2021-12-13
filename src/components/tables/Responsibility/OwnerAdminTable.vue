<template>
  <div id="table_responsibilities">
    <Tabulator
      :name="`Verantwortliche`"
      :tableconfig="{
        reactiveData: true,
        index: 'name',
      }"
      :columns="[
        {
          title: 'Verantwortliche',
          field: 'email',
        },
      ]"
      :data="ownerAdminsData"
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
    ownerAdmins: "",
  }),
  mounted() {
    this.loadOwnerAdmins();
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.loadOwnerAdmins();
      },
    },
  },
  computed: {
    ...mapState(["active"]),
    ...mapState("responsibilities", ["ownerAdminsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  methods: {
    ...mapActions("responsibilities", ["getOwnerAdmins"]),
    loadOwnerAdmins() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
      };
      this.getOwnerAdmins(params);
    },
  },
}
</script>
