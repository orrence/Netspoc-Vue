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

	<testing-test :initial-count="2">uff</testing-test>

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
import testingTest from './TestingTest';
export default {
	components: { testingTest },
  computed: mapState(['loggedIn', 'owners', 'history', 'active']),
  data: () => ({
    switchMe: false
  })
}
</script>