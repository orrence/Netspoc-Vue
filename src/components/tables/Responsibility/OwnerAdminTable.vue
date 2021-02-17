<template>
  <div id="table_responsibilities">
    <Tabulator
      :name="`Verantwortliche`"
      :tableconfig="{
        reactiveData: true,
        selectable: 20,
        index: 'name',
      }"
      :columns="[
        {
           formatter: 'rowSelection',
          //formatter: 'tickCross',
          // titleFormatter: 'rowSelection',
          hozAlign: 'center',
          width: 10,
          headerSort: false,
          field: 'selected',
        },
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
  computed: {
    ...mapState("responsibilities", ["ownerAdminsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
  },
  methods: {
    ...mapActions("responsibilities", ["getOwnerAdmins"]),
    loadOwnerAdmins() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
      };
      console.log( "Load owner admins")
      console.dir(params)
      this.getOwnerAdmins(params);
    },
  },
}
</script>
