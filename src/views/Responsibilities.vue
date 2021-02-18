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
		</v-col>
		<v-col cols="3">
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import OwnerAdminTable   from '../components/tables/Responsibility/OwnerAdminTable';
import OwnerWatcherTable from '../components/tables/Responsibility/OwnerWatcherTable';
import { mapGetters } from "vuex";

export default {
	components: {
		OwnerAdminTable,
		OwnerWatcherTable
	},
	data: () => ({
		superiorOwner : ''
	}),
  computed: {
    ...mapGetters(["getActiveLoaded"]),
  },
}
</script>
