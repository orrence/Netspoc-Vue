<template>
  <div id="table_responsibilities">
    <Tabulator
      :name="`Zuschauer`"
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
          title: 'Zuschauer (Watcher)',
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
  computed: {
    ...mapState("responsibilities", ["ownerAdminsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
  },
  created() {},
  methods: {
    ...mapActions("responsibilities", ["getOwnerAdmins"]),
  },
}
</script>
