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
      :data="data"
      :height="height"
    />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapState, mapGetters } from "vuex";
import urlSearchParams from "../c../../../mixins/urlSearchParams";
import Vue from "vue";

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
    ...mapState(["active"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.loadOwnerWatchers();
      },
    },
  },
  created() {},
  methods: {
    loadOwnerWatchers() {
      var vm = this;
      const formData = new FormData();
      formData.append("active_owner", vm.getActiveOwner);
      formData.append("history", vm.getActivePolicy);
      Vue.axios
        .post("get_watchers", formData)
        .then((res) => {
          let records = res.data.records;
          if (records.length > 0) {
            this.data = records;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
