<template>
	<v-app>
		<app-toolbar color="primary" />
		<v-content>
			<keep-alive>
				<router-view/>
			</keep-alive>
		</v-content>
	</v-app>
</template>

<script>
import AppToolbar from './components/AppToolbar'

export default {
	name: 'App',
	components: {
		AppToolbar
	}
}
</script>
 
<style>
/*invisible element below input fields causes misalignment*/
.v-text-field__details{
	display: none;
}
</style>
	