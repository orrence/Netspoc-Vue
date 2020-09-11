<template>
<v-container>
	<h1>Netspoc-Web 2</h1>
	
	<v-card
	:loading="false"
	class="mx-auto"
	> 
		<v-card-title primary-title>
			<h4>Login</h4>
		</v-card-title>

		<v-system-bar 
		v-if="!valid"
		color="error"
		id="bar_login_failed"
		>
			Kombination aus Benutzername / E-Mail und Passwort inkorrekt
		</v-system-bar>
	
		<v-system-bar 
		v-else-if="!login || !password"
		color="warning"
		id="bar_login_empty"
		>
			Anmeldedaten eingeben
		</v-system-bar>

		<v-form 
		class="mx-2" 
		@submit="submit"
		v-model="valid"
		onSubmit="return false"
		>
			<v-text-field
				id="txt_login"
				v-model="login"
				:rules="[v => !!v || 'Darf nicht leer sein']"
				required
				label="Benutzername / E-Mail"
				prepend-icon="person"
			></v-text-field>
	
			<v-text-field
				id="txt_password"
				v-model="password"
				:append-icon="show ? 'visibility' : 'visibility_off'"
				:rules="[v => !!v || 'Darf nicht leer sein']"
				:type="show ? 'text' : 'password'"
				@click:append="show = !show"
				required
				label="Passwort"
				prepend-icon="lock"
			></v-text-field>
			
			<v-card-actions>
				<v-flex class="text-xs-right">
					<v-btn
					id="btn_login"
					type="submit"
					:disabled="!valid"
					primary large block
					>Login</v-btn>	
				</v-flex>
			</v-card-actions>
		</v-form>
	</v-card>

	<br/>

	<v-card>
		<v-card-title primary-title>
			Hier koennte ihr Wiki stehen
		</v-card-title>
	</v-card>
</v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'app-login',
	data: () => ({
		login: null,
		password: null,
		valid: true,
		show: false
	}),
	methods: {
		...mapActions ('auth',['setLoggedIn','loginUser']),

		submit () {
			var vm = this;

			const formData = new FormData();
			formData.append('email', vm.login);
			formData.append('pass', vm.password);
			formData.append('app', 'foo');
			this.loginUser({data:formData});
			
		},
		clear () {
			this.password = null;
		}
	}
}
</script>
