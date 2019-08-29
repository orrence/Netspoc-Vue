<template>
<v-container>
	<v-card>
		<v-switch v-model="switchMe">
			<template v-slot:label>
				Turn on the progress:
				<v-progress-circular 
					:indeterminate="switchMe" 
					:value="0" 
					size="24" 
					class="ml-2"
				/>
			</template>
		</v-switch>
	</v-card>

  <v-card>{{ loggedIn }}</v-card>
  <br/>
  <v-card>{{ owners }}</v-card>
  <br/>
  <v-card>{{ history }}</v-card>
  <br/>
  <v-card>{{ active }}</v-card>
</v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: mapState(['loggedIn', 'owners', 'history', 'active']),
  data: () => ({
    switchMe: false
  })
}
</script>