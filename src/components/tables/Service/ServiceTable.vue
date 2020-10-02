<template>
  <div :id="compID">
    <Tabulator
      :name="'Dienste'"
      :columns="[
	{
		title: 'Name',
		field: 'name' 
	},
]"
      :data="servicedata"
      :selectable="true"
      :groupBy="''"
      @selectionUpdate="passOnSelectionUpdate"
    />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapActions } from "vuex";

export default {
  components: {
    Tabulator,
  },
  props: ["servicedata","compID"],
  data: () => ({
    data: [],
  }),

  methods: {
    ...mapActions("services", ["getServicesList", "updateServiceSelection"]),

    passOnSelectionUpdate(data) {
      this.updateServiceSelection(data);
      //this.$emit("selectionUpdate", data);
    },
  },
};
</script>
