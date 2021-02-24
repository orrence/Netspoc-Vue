<template>
<v-container fluid>
	<v-row dense :justify="'center'">
		<v-col cols="3">
			<OwnerAdminTable  v-if="getActiveLoaded"/>
		</v-col>
		<v-col cols="3">
			<OwnerWatcherTable v-if="getActiveLoaded"/>
		</v-col>
		<v-col cols="3">
			<OwnerSupervisorTable v-if="getActiveLoaded"/>
		</v-col>
		<v-col cols="3">
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import OwnerAdminTable   from '../components/tables/Responsibility/OwnerAdminTable';
import OwnerWatcherTable from '../components/tables/Responsibility/OwnerWatcherTable';
import OwnerSupervisorTable from '../components/tables/Responsibility/OwnerSupervisorTable';
import { mapGetters } from "vuex";

export default {
	components: {
		OwnerAdminTable,
		OwnerWatcherTable,
		OwnerSupervisorTable
	},
	data: () => ({
	}),
  computed: {
    ...mapGetters(["getActiveLoaded"]),
  },
}
</script>
