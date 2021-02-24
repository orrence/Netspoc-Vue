<template>
  <div id="table_watchers">
    <Tabulator
      :name="`Zuschauer`"
      :tableconfig="{
        reactiveData: true,
        index: 'name',
      }"
      :columns="[
        {
          title: 'Zuschauer (Watcher)',
          field: 'email',
        },
      ]"
      :data="ownerWatchersData"
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
    this.loadOwnerWatchers();
  },
  computed: {
    ...mapState("responsibilities", ["ownerWatchersData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
  },
  created() {},
  methods: {
    ...mapActions("responsibilities", ["getOwnerWatchers"]),
      loadOwnerWatchers() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
      };
      console.log( "Load owner admins")
      console.dir(params)
      this.getOwnerWatchers(params);
    },
  },
}
</script>
